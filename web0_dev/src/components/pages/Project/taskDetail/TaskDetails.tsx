'use client';

import {
	Phase,
	Project,
	Task,
	TaskStatus,
	projectPriority,
} from '@prisma/client';
import styles from './TaskDetails.module.scss';
import { useCallback, useEffect, useState, useRef } from 'react';
import {
	updateTask,
	getTaskComments,
	getTaskActivities,
	addComment,
} from '@/actions/TaskActions';
import { toast } from 'sonner';
import Image from 'next/image';
import ChatText from '@/svgs/ChatText';
import PhaseIcon from '@/svgs/Phase';
import { Editor, EditorProvider } from 'react-simple-wysiwyg';
import TextFormatToolbar from '@/components/general/editor/TextFormatToolbar';

interface TaskDetailsProps {
	task: Task & {
		Phase?: Phase | null;
		project: Project;
	};
	orgUrl: string;
	memberId: string;
	organizationId: string;
	userName: string;
	userImage: string | null;
}

interface Comment {
	id: string;
	content: string;
	createdAt: Date;
	author: {
		user: {
			name: string;
			image: string | null;
		};
	};
}

interface ActivityWithUser {
	id: string;
	type: string;
	description: string;
	createdAt: Date;
	actor: {
		user: {
			name: string;
			image: string | null;
		};
	};
}

const TaskDetails = ({
	task,
	orgUrl,
	memberId,
	organizationId,
	userName,
	userImage,
}: TaskDetailsProps) => {
	const [title, setTitle] = useState(task.title);
	const [description, setDescription] = useState(task.description || '');
	const [status, setStatus] = useState<TaskStatus>(task.status);
	const [priority, setPriority] = useState<projectPriority>(task.priority);
	const [content, setContent] = useState(task.content || '');
	const [isChatOpen, setIsChatOpen] = useState(true);
	const [comments, setComments] = useState<Comment[]>([]);
	const [activities, setActivities] = useState<ActivityWithUser[]>([]);
	const [newComment, setNewComment] = useState('');
	const editorRef = useRef<HTMLDivElement>(null);

	const titleTimer = useRef<ReturnType<typeof setTimeout>>(null!);
	const descriptionTimer = useRef<ReturnType<typeof setTimeout>>(null!);
	const contentTimer = useRef<ReturnType<typeof setTimeout>>(null!);

	useEffect(() => {
		const loadCommentsAndActivities = async () => {
			const [commentsResult, activitiesResult] = await Promise.all([
				getTaskComments(task.id),
				getTaskActivities(task.id),
			]);

			if (commentsResult.data) {
				setComments(commentsResult.data);
			}
			if (activitiesResult.data) {
				setActivities(activitiesResult.data);
			}
		};

		loadCommentsAndActivities();
	}, [task.id]);

	const createOptimisticActivity = (field: string, newValue: string) => {
		let description = '';
		if (field.toLowerCase() === 'status') {
			description = `Status changed to ${newValue}`;
		} else if (field.toLowerCase() === 'priority') {
			description = `Priority set to ${newValue.toLowerCase()}`;
		}

		const optimisticActivity: ActivityWithUser = {
			id: `temp-${Date.now()}`,
			type: 'task_updated',
			description,
			createdAt: new Date(),
			actor: {
				user: {
					name: userName,
					image: userImage,
				},
			},
		} as ActivityWithUser;

		setActivities((prev) => [optimisticActivity, ...prev]);
		return optimisticActivity;
	};

	const handleUpdate = useCallback(
		async (
			data: Partial<Task>,
			field: string,
			displayValue: string,
			createActivity = false
		) => {
			let optimisticActivity;
			if (createActivity) {
				optimisticActivity = createOptimisticActivity(field, displayValue);
			}

			try {
				const { data: result, error } = await updateTask(
					task.id,
					data,
					orgUrl,
					memberId,
					organizationId
				);
				if (error) {
					if (optimisticActivity) {
						setActivities((prev) =>
							prev.filter((a) => a.id !== optimisticActivity.id)
						);
					}
					switch (field.toLowerCase()) {
						case 'title':
							setTitle(task.title);
							break;
						case 'description':
							setDescription(task.description || '');
							break;
						case 'status':
							setStatus(task.status);
							break;
						case 'priority':
							setPriority(task.priority);
							break;
						case 'content':
							setContent(task.content || '');
							break;
					}
					toast.error('Failed to update task');
				} else if (result?.activity && optimisticActivity) {
					setActivities((prev) =>
						prev.map((a) =>
							a.id === optimisticActivity.id
								? (result.activity as ActivityWithUser)
								: a
						)
					);
				}
			} catch {
				if (optimisticActivity) {
					setActivities((prev) =>
						prev.filter((a) => a.id !== optimisticActivity.id)
					);
				}
				toast.error('Failed to update task');
			}
		},
		[task, orgUrl, memberId, organizationId, userName, userImage]
	);

	const handleTitleChange = (newTitle: string) => {
		setTitle(newTitle);
		if (titleTimer.current) {
			clearTimeout(titleTimer.current);
		}
		titleTimer.current = setTimeout(() => {
			handleUpdate({ title: newTitle }, 'Title', newTitle, false);
		}, 500);
	};

	const handleDescriptionChange = (newDescription: string) => {
		setDescription(newDescription);
		if (descriptionTimer.current) {
			clearTimeout(descriptionTimer.current);
		}
		descriptionTimer.current = setTimeout(() => {
			handleUpdate(
				{ description: newDescription },
				'Description',
				newDescription,
				false
			);
		}, 500);
	};

	const handleContentChange = (e: { target: { value: string } }) => {
		const newContent = e.target.value;
		setContent(newContent);
		if (contentTimer.current) {
			clearTimeout(contentTimer.current);
		}
		contentTimer.current = setTimeout(() => {
			handleUpdate({ content: newContent }, 'Content', 'updated', false);
		}, 500);
	};

	const handleStatusChange = (newStatus: TaskStatus) => {
		setStatus(newStatus);
		handleUpdate({ status: newStatus }, 'Status', newStatus, true);
	};

	const handlePriorityChange = (newPriority: projectPriority) => {
		setPriority(newPriority);
		handleUpdate({ priority: newPriority }, 'Priority', newPriority, true);
	};

	const handleAddComment = async () => {
		if (!newComment.trim()) return;

		const optimisticComment: Comment = {
			id: `temp-${Date.now()}`,
			content: newComment,
			createdAt: new Date(),
			author: {
				user: {
					name: userName,
					image: userImage,
				},
			},
		} as Comment;

		setComments((prev) => [optimisticComment, ...prev]);
		const commentContent = newComment;
		setNewComment('');

		try {
			const { data, error } = await addComment(
				task.id,
				commentContent,
				memberId,
				organizationId
			);
			if (error || !data) {
				setComments((prev) =>
					prev.filter((c) => c.id !== optimisticComment.id)
				);
				toast.error(error || 'Failed to add comment');
				setNewComment(commentContent);
				return;
			}

			setComments((prev) =>
				prev.map((c) => (c.id === optimisticComment.id ? data : c))
			);
		} catch {
			setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
			toast.error('Failed to add comment');
			setNewComment(commentContent);
		}
	};

	useEffect(() => {
		return () => {
			if (titleTimer.current) clearTimeout(titleTimer.current);
			if (descriptionTimer.current) clearTimeout(descriptionTimer.current);
			if (contentTimer.current) clearTimeout(contentTimer.current);
		};
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.mainContent}>
				<div className={styles.header}>
					<input
						type="text"
						value={title}
						onChange={(e) => handleTitleChange(e.target.value)}
						className={styles.titleInput}
						placeholder="Task title"
					/>
					<input
						type="text"
						value={description}
						onChange={(e) => handleDescriptionChange(e.target.value)}
						className={styles.descriptionInput}
						placeholder="Task #1 description"
					/>
				</div>

				<div className={styles.divider} />

				<div className={styles.properties}>
					<div className={styles.property}>
						<label>Status</label>
						<select
							value={status}
							onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
							className={styles.statusSelect}
						>
							<option value="Backlog">Backlog</option>
							<option value="todo">To Do</option>
							<option value="inProgress">In Progress</option>
							<option value="inReview">In Review</option>
							<option value="Completed">Completed</option>
							<option value="canceled">Canceled</option>
						</select>
					</div>

					<div className={styles.property}>
						<label>Priority</label>
						<select
							value={priority}
							onChange={(e) =>
								handlePriorityChange(e.target.value as projectPriority)
							}
							className={styles.prioritySelect}
						>
							<option value="noPriority">No Priority</option>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
							<option value="urgent">Urgent</option>
						</select>
					</div>

					<div className={styles.property}>
						<label>Phase</label>
						<div className={styles.phaseDisplay}>
							<PhaseIcon fill={'var(--main-70)'} width="16" height="16" />
							<span>{task.Phase?.title || 'No phase'}</span>
						</div>
					</div>

					<div className={styles.property}>
						<label>Project</label>
						<div className={styles.projectDisplay}>
							<Image
								src={'https://placehold.co/24'}
								alt={task.project.title}
								width={24}
								height={24}
							/>
							<span>{task.project.title}</span>
						</div>
					</div>
				</div>

				<div className={styles.divider} />

				<div className={styles.content} ref={editorRef}>
					<EditorProvider>
						<Editor
							value={content}
							onChange={handleContentChange}
							containerProps={{
								className: styles.contentEditor,
								style: {
									minHeight: '200px',
									width: '100%',
									border: 'none',
									backgroundColor: 'var(--bg)',
								},
							}}
							placeholder="Add your content here..."
						/>
					</EditorProvider>
					<TextFormatToolbar editorRef={editorRef} />
				</div>
			</div>

			<div className={`${styles.chatSidebar} ${isChatOpen ? styles.open : ''}`}>
				<div className={styles.chatHeader}>
					<h3>Comments & Activity</h3>
					<button onClick={() => setIsChatOpen(!isChatOpen)}>
						{isChatOpen ? 'Close' : 'Open'}
					</button>
				</div>
				<div className={styles.chatContent}>
					<div className={styles.commentInput}>
						<textarea
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Write a comment..."
							rows={3}
						/>
						<button onClick={handleAddComment} disabled={!newComment.trim()}>
							Comment
						</button>
					</div>

					{comments.length === 0 && activities.length === 0 ? (
						<div className={styles.emptyState}>
							<ChatText fill={'var(--text-50)'} width="24" height="24" />
							<p>No comments or activity yet</p>
						</div>
					) : (
						<div className={styles.timeline}>
							{[...comments, ...activities]
								.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
								.map((item) => (
									<div
										key={item.id}
										className={`${styles.timelineItem} ${
											'content' in item ? styles.comment : styles.activity
										}`}
									>
										<div className={styles.timelineHeader}>
											<Image
												src={
													'content' in item
														? item.author.user.image ||
														  'https://placehold.co/24'
														: item.actor.user.image || 'https://placehold.co/24'
												}
												alt="User"
												width={24}
												height={24}
											/>
											<span className={styles.userName}>
												{'content' in item
													? item.author.user.name
													: item.actor.user.name}
											</span>
											<span className={styles.timeAgo}>
												{new Date(item.createdAt).toLocaleDateString()}
											</span>
										</div>
										<div className={styles.timelineContent}>
											{'content' in item ? (
												<p>{item.content}</p>
											) : (
												<p>{item.description}</p>
											)}
										</div>
									</div>
								))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TaskDetails;
