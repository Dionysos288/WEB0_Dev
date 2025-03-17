import styles from './CommentsSidebar.module.scss';
import Image from 'next/image';
import ChatText from '@/svgs/ChatText';
import { useState } from 'react';

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

interface CommentsSidebarProps {
	isOpen: boolean;
	onClose: () => void;
	comments: Comment[];
	activities: ActivityWithUser[];
	onAddComment: (content: string) => Promise<void>;
}

const CommentsSidebar = ({
	isOpen,
	onClose,
	comments,
	activities,
	onAddComment,
}: CommentsSidebarProps) => {
	const [newComment, setNewComment] = useState('');

	const handleAddComment = async () => {
		if (!newComment.trim()) return;
		await onAddComment(newComment);
		setNewComment('');
	};

	return (
		<div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
			<div className={styles.header}>
				<h3>Comments & Activity</h3>
				<button onClick={onClose}>Close</button>
			</div>
			<div className={styles.content}>
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
													? item.author.user.image || 'https://placehold.co/24'
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
	);
};

export default CommentsSidebar;
