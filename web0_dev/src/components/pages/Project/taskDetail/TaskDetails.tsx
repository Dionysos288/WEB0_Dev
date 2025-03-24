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
} from '@/actions/TaskActions';
import { toast } from 'sonner';
import Team from '@/svgs/Team';
import PhaseIcon from '@/svgs/Phase';
import TiptapEditor from '@/components/editor/TiptapEditor';
import UrgentPriority from '@/svgs/UrgentPriority';
import HighPriority from '@/svgs/HighPriority';
import MediumPriority from '@/svgs/MediumPriority';
import LowPriority from '@/svgs/LowPriority';
import NoPriority from '@/svgs/NoPriority';
import ProjectIcon from '@/svgs/Project';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';
import ButtonSelector from '@/components/pages/projects/addProject/ButtonSelector';
import Spacing from '@/components/general/Spacing';
import DatePicker from '@/svgs/DatePicker';
import Label from '@/svgs/Label';
import { getProjectsAndPhases } from '@/actions/ProjectActions';
import { getLabels } from '@/actions/LabelActions';
import { getMembers } from '@/actions/AccountActions';
import SingleDatePicker from '../../../../components/general/ui/date/SingleDatePicker';
import { useComments } from '@/contexts/CommentsContext';
import { ActivityWithUser, TaskUpdateData } from '@/types/comment';

interface TaskDetailsProps {
	task: Task & {
		Phase?: Phase;
		project: Project;
		assignees?: Member[];
		labels?: Label[];
	};
	orgUrl: string;
	memberId: string;
	organizationId: string;
	userName: string;
	userImage: string | null;
}

interface Member {
	id: string;
	user: {
		email: string;
		image: string | null;
	};
}

interface Label {
	id: string;
	title: string;
	color: string;
}

interface OptionItem {
	label: string;
	value: string;
	icon: React.FC<{ fill?: string; width?: string; height?: string }>;
	color?: string;
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
	const [priority, setPriority] = useState<projectPriority>(
		task.priority ?? projectPriority.medium
	);
	const [content, setContent] = useState(task.content || '');
	const { setComments, setActivities } = useComments();
	const [isStatusOpen, setIsStatusOpen] = useState(false);
	const [statusQuery, setStatusQuery] = useState('');
	const [statusOptions, setStatusOptions] = useState<OptionItem[]>([
		{ label: 'Backlog', value: 'Backlog', icon: Team },
		{ label: 'To Do', value: 'todo', icon: Team },
		{ label: 'In Progress', value: 'inProgress', icon: Team },
		{ label: 'In Review', value: 'inReview', icon: Team },
		{ label: 'Completed', value: 'Completed', icon: Team },
		{ label: 'Canceled', value: 'canceled', icon: Team },
	]);
	const [isPriorityOpen, setIsPriorityOpen] = useState(false);
	const [priorityQuery, setPriorityQuery] = useState('');
	const [priorityOptions, setPriorityOptions] = useState<OptionItem[]>([
		{ label: 'No Priority', value: 'noPriority', icon: NoPriority },
		{ label: 'Low', value: 'low', icon: LowPriority },
		{ label: 'Medium', value: 'medium', icon: MediumPriority },
		{ label: 'High', value: 'high', icon: HighPriority },
		{ label: 'Urgent', value: 'urgent', icon: UrgentPriority },
	]);
	const [isPhaseOpen, setIsPhaseOpen] = useState(false);
	const [phaseQuery, setPhaseQuery] = useState('');
	const [phaseOptions, setPhaseOptions] = useState<OptionItem[]>([
		{ label: 'No Phase', value: 'none', icon: PhaseIcon },
		...(task.Phase
			? [{ label: task.Phase.title, value: task.Phase.id, icon: PhaseIcon }]
			: []),
	]);
	const createdAt = new Date(task.createdAt);
	const createdAtFormatted = createdAt.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	});

	// Project state
	const [isProjectOpen, setIsProjectOpen] = useState(false);
	const [projectQuery, setProjectQuery] = useState('');
	const [projectOptions, setProjectOptions] = useState<OptionItem[]>([
		{
			label: task.project.title,
			value: task.project.id,
			icon: ProjectIcon,
		},
	]);

	// Assignee state
	const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
	const [assigneeQuery, setAssigneeQuery] = useState('');
	const [assigneeOptions, setAssigneeOptions] = useState<OptionItem[]>([]);
	const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
		task.assignees?.map((a) => a.id) || []
	);

	// Label state
	const [isLabelOpen, setIsLabelOpen] = useState(false);
	const [labelQuery, setLabelQuery] = useState('');
	const [labelOptions, setLabelOptions] = useState<OptionItem[]>([]);
	const [selectedLabels, setSelectedLabels] = useState<string[]>(
		task.labels?.map((l) => l.id) || []
	);

	// Date state
	const [isDateOpen, setIsDateOpen] = useState(false);
	const [dueDate, setDueDate] = useState<Date | undefined>(
		task.dueDate ? new Date(task.dueDate) : undefined
	);

	// Project and phase data cache
	const [projectsWithPhases, setProjectsWithPhases] = useState<{
		[key: string]: OptionItem[];
	}>({});

	const titleTimer = useRef<ReturnType<typeof setTimeout>>(null!);
	const descriptionTimer = useRef<ReturnType<typeof setTimeout>>(null!);
	const contentTimer = useRef<ReturnType<typeof setTimeout>>(null!);
	const statusRef = useRef<HTMLInputElement>(null);
	const priorityRef = useRef<HTMLInputElement>(null);
	const phaseRef = useRef<HTMLInputElement>(null);
	const projectRef = useRef<HTMLInputElement>(null);
	const assigneeRef = useRef<HTMLInputElement>(null);
	const labelRef = useRef<HTMLInputElement>(null);

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

	useEffect(() => {
		const fetchData = async () => {
			const [membersResult, projectsResult, labelsResult] = await Promise.all([
				getMembers(organizationId),
				getProjectsAndPhases(organizationId),
				getLabels(organizationId),
			]);

			if (membersResult.data) {
				const dataMapped = membersResult.data.map((member) => ({
					label: member.user.email,
					value: member.id,
					icon: Team,
				}));
				setAssigneeOptions(dataMapped);
			}

			if (projectsResult.data) {
				const projectsMapped = projectsResult.data.projects.map((project) => ({
					label: project.title,
					value: project.id,
					icon: ProjectIcon,
				}));
				setProjectOptions(projectsMapped);

				const phasesMap: { [key: string]: OptionItem[] } = {};
				projectsResult.data.projects.forEach((project) => {
					if (project.phases && project.phases.length > 0) {
						phasesMap[project.id] = [
							{
								label: 'No Phase',
								value: 'none',
								icon: PhaseIcon,
							},
							...project.phases.map((phase) => ({
								label: phase.title,
								value: phase.id,
								icon: PhaseIcon,
							})),
						];
					}
				});
				setProjectsWithPhases(phasesMap);
			}

			if (labelsResult.data) {
				const labelsMapped = labelsResult.data.map((label) => ({
					label: label.title,
					value: label.id,
					icon: Label,
					color: label.color,
				}));
				setLabelOptions(labelsMapped);
			}
		};

		fetchData();
	}, [organizationId]);

	const createOptimisticActivity = (field: string, newValue: string) => {
		let description = '';
		if (field.toLowerCase() === 'status') {
			description = `Status changed to ${newValue}`;
		} else if (field.toLowerCase() === 'priority') {
			description = `Priority set to ${newValue.toLowerCase()}`;
		} else if (field.toLowerCase() === 'assignees') {
			description = `Assignees updated`;
		} else if (field.toLowerCase() === 'labels') {
			description = `Labels updated`;
		}

		const optimisticActivity: ActivityWithUser = {
			id: `temp-${field}-${Date.now()}-${Math.random()
				.toString(36)
				.substr(2, 9)}`,
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
			data: TaskUpdateData,
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
							setPriority(task.priority ?? projectPriority.medium);
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

	const handleStatusChange = (value: string | OptionItem) => {
		const newStatus = (
			typeof value === 'string' ? value : value.value
		) as TaskStatus;
		setStatus(newStatus);
		setIsStatusOpen(false);
		handleUpdate({ status: newStatus }, 'Status', newStatus, true);
	};

	const handlePriorityChange = (value: string | OptionItem) => {
		const newPriority = (
			typeof value === 'string' ? value : value.value
		) as projectPriority;
		setPriority(newPriority);
		setIsPriorityOpen(false);
		handleUpdate({ priority: newPriority }, 'Priority', newPriority, true);
	};

	const handlePhaseChange = (value: string | OptionItem) => {
		const phaseId = typeof value === 'string' ? value : value.value;
		setIsPhaseOpen(false);
		handleUpdate(
			{ phaseId: phaseId === 'none' ? null : phaseId },
			'Phase',
			typeof value === 'string' ? value : value.label,
			true
		);
	};

	const handleQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<OptionItem[]>>,
		options: OptionItem[],
		setQuery: React.Dispatch<React.SetStateAction<string>>
	) => {
		const value = e.target.value.toLowerCase();
		setQuery(value);
		const filtered = options.filter((item) =>
			item.label.toLowerCase().includes(value)
		);
		setOptions(filtered);
	};

	const handleProjectChange = (value: string | OptionItem) => {
		const projectId = typeof value === 'string' ? value : value.value;
		setIsProjectOpen(false);
		handleUpdate(
			{ projectId },
			'Project',
			typeof value === 'string' ? value : value.label,
			true
		);

		// Reset phase when project changes
		handleUpdate({ phaseId: null }, 'Phase', 'No phase', true);
	};

	const handleAssigneesChange = async (value: string | OptionItem) => {
		const memberId = typeof value === 'string' ? value : value.value;
		const isRemoving = selectedAssignees.includes(memberId);

		const newAssignees = isRemoving
			? selectedAssignees.filter((id) => id !== memberId)
			: [...selectedAssignees, memberId];

		setSelectedAssignees(newAssignees);

		const optimisticActivity = createOptimisticActivity('assignees', '');

		try {
			const { data: result, error } = await updateTask(
				task.id,
				{
					assignees: isRemoving
						? { disconnect: [{ id: memberId }] }
						: { connect: [{ id: memberId }] },
				} as TaskUpdateData,
				orgUrl,
				memberId,
				organizationId
			);

			if (error) {
				console.error('Failed to update assignees:', error);
				setActivities((prev) =>
					prev.filter((a) => a.id !== optimisticActivity.id)
				);
				setSelectedAssignees(task.assignees?.map((a) => a.id) || []);
				toast.error('Failed to update assignees');
			} else if (result?.activity) {
				setActivities((prev) =>
					prev.map((a) =>
						a.id === optimisticActivity.id
							? (result.activity as ActivityWithUser)
							: a
					)
				);
			}
		} catch (error) {
			console.error('Failed to update assignees:', error);
			setActivities((prev) =>
				prev.filter((a) => a.id !== optimisticActivity.id)
			);
			setSelectedAssignees(task.assignees?.map((a) => a.id) || []);
			toast.error('Failed to update assignees');
		}
	};

	const handleLabelsChange = async (value: string | OptionItem) => {
		const labelId = typeof value === 'string' ? value : value.value;
		const isRemoving = selectedLabels.includes(labelId);

		const newLabels = isRemoving
			? selectedLabels.filter((id) => id !== labelId)
			: [...selectedLabels, labelId];

		setSelectedLabels(newLabels);

		const optimisticActivity = createOptimisticActivity('labels', '');

		try {
			const { data: result, error } = await updateTask(
				task.id,
				{
					labels: isRemoving
						? { disconnect: [{ id: labelId }] }
						: { connect: [{ id: labelId }] },
				} as TaskUpdateData,
				orgUrl,
				memberId,
				organizationId
			);

			if (error) {
				console.error('Failed to update labels:', error);
				setActivities((prev) =>
					prev.filter((a) => a.id !== optimisticActivity.id)
				);
				setSelectedLabels(task.labels?.map((l) => l.id) || []);
				toast.error('Failed to update labels');
			} else if (result?.activity) {
				setActivities((prev) =>
					prev.map((a) =>
						a.id === optimisticActivity.id
							? (result.activity as ActivityWithUser)
							: a
					)
				);
			}
		} catch (error) {
			console.error('Failed to update labels:', error);
			setActivities((prev) =>
				prev.filter((a) => a.id !== optimisticActivity.id)
			);
			setSelectedLabels(task.labels?.map((l) => l.id) || []);
			toast.error('Failed to update labels');
		}
	};

	const handleDateChange = (date: Date | undefined) => {
		setDueDate(date);
		setIsDateOpen(false);
		handleUpdate(
			{ dueDate: date || null },
			'Due Date',
			date ? date.toLocaleDateString() : 'No due date',
			true
		);
	};

	const getDateColor = (date?: Date) => {
		if (!date) return 'var(--main-65)';
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const dueDate = new Date(date);
		dueDate.setHours(0, 0, 0, 0);

		if (dueDate < today) return 'var(--error-600)';
		const sevenDaysFromNow = new Date(today);
		sevenDaysFromNow.setDate(today.getDate() + 7);

		if (dueDate <= sevenDaysFromNow) return 'var(--orange-90)';
		return 'var(--main)';
	};

	const getAssigneeColor = () => {
		return selectedAssignees.length === 0 ? 'var(--main-65)' : 'var(--main)';
	};

	const getLabelColor = () => {
		return selectedLabels.length === 0 ? 'var(--main-65)' : 'var(--main)';
	};

	useEffect(() => {
		return () => {
			if (titleTimer.current) clearTimeout(titleTimer.current);
			if (descriptionTimer.current) clearTimeout(descriptionTimer.current);
			if (contentTimer.current) clearTimeout(contentTimer.current);
		};
	}, []);

	useEffect(() => {
		if (task) {
			const pageInfoEvent = new CustomEvent('pageinfo', {
				detail: {
					id: task.id,
					title: `${task.project.title}: ${task.title}`,
					type: 'task',
					pathname: window.location.pathname,
				},
			});
			window.dispatchEvent(pageInfoEvent);
		}
	}, [task]);

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
						placeholder={`Task description`}
					/>
				</div>
				<Spacing space={20} />
				<div className={styles.divider} />
				<Spacing space={28} />
				<div className={styles.properties}>
					<div className={styles.topPart}>
						<div className={styles.taskId}>
							<p>{task.customId}</p>
						</div>
						<div className={styles.createdAt}>
							<p>Created {createdAtFormatted}</p>
						</div>
					</div>
					<Spacing space={8} />
					<div className={styles.propertiePart}>
						<div className={styles.property}>
							<div
								className={styles.selector}
								onClick={() => setIsStatusOpen(true)}
								data-selector="status"
							>
								<div className={styles.wrapper}>
									<Team fill={'var(--main)'} width="16" height="16" />
									<span>{status}</span>
								</div>
								{isStatusOpen && (
									<div className={styles.selectorPopup}>
										<ClickOutsideWrapper onClose={() => setIsStatusOpen(false)}>
											<ButtonSelector
												query={statusQuery}
												onQueryChange={(e) =>
													handleQueryChange(
														e,
														setStatusOptions,
														statusOptions,
														setStatusQuery
													)
												}
												inputRef={statusRef}
												options={statusOptions}
												placeholder="Select Status"
												oldData={statusOptions}
												setOptions={setStatusOptions}
												setIsChosen={handleStatusChange}
												setIsOpenOption={setIsStatusOpen}
												isChosen={status}
											/>
										</ClickOutsideWrapper>
									</div>
								)}
							</div>
						</div>

						<div className={styles.property}>
							<div
								className={styles.selector}
								onClick={() => setIsPriorityOpen(true)}
								data-selector="priority"
							>
								<div className={styles.wrapper}>
									{priority === 'urgent' ? (
										<UrgentPriority
											fill={'var(--orange-90)'}
											width="16"
											height="16"
										/>
									) : priority === 'high' ? (
										<HighPriority fill={'var(--main)'} width="16" height="16" />
									) : priority === 'medium' ? (
										<MediumPriority
											fill={'var(--main)'}
											width="16"
											height="16"
										/>
									) : priority === 'low' ? (
										<LowPriority fill={'var(--main)'} width="16" height="16" />
									) : (
										<NoPriority fill={'var(--main)'} width="16" height="16" />
									)}
									<span
										style={{
											color:
												priority === 'urgent'
													? 'var(--orange-90)'
													: 'var(--main)',
										}}
									>
										{priority.charAt(0).toUpperCase() + priority.slice(1)}
									</span>
								</div>
								{isPriorityOpen && (
									<div className={styles.selectorPopup}>
										<ClickOutsideWrapper
											onClose={() => setIsPriorityOpen(false)}
										>
											<ButtonSelector
												query={priorityQuery}
												onQueryChange={(e) =>
													handleQueryChange(
														e,
														setPriorityOptions,
														priorityOptions,
														setPriorityQuery
													)
												}
												inputRef={priorityRef}
												options={priorityOptions}
												placeholder="Select Priority"
												oldData={priorityOptions}
												setOptions={setPriorityOptions}
												setIsChosen={handlePriorityChange}
												setIsOpenOption={setIsPriorityOpen}
												isChosen={priority}
											/>
										</ClickOutsideWrapper>
									</div>
								)}
							</div>
						</div>

						<div className={styles.property}>
							<div
								className={styles.selector}
								onClick={() => setIsProjectOpen(true)}
								data-selector="project"
							>
								<div className={styles.wrapper}>
									<ProjectIcon fill={'var(--main)'} width="16" height="16" />
									<span>{task.project.title}</span>
								</div>
								{isProjectOpen && (
									<div className={styles.selectorPopup}>
										<ClickOutsideWrapper
											onClose={() => setIsProjectOpen(false)}
										>
											<ButtonSelector
												query={projectQuery}
												onQueryChange={(e) =>
													handleQueryChange(
														e,
														setProjectOptions,
														projectOptions,
														setProjectQuery
													)
												}
												inputRef={projectRef}
												options={projectOptions}
												placeholder="Select Project"
												oldData={projectOptions}
												setOptions={setProjectOptions}
												setIsChosen={handleProjectChange}
												setIsOpenOption={setIsProjectOpen}
												isChosen={task.project.id}
											/>
										</ClickOutsideWrapper>
									</div>
								)}
							</div>
						</div>

						{projectsWithPhases[task.project.id] && (
							<div className={styles.property}>
								<div
									className={styles.selector}
									onClick={() => setIsPhaseOpen(true)}
									data-selector="phase"
								>
									<div className={styles.wrapper}>
										<PhaseIcon
											fill={task.Phase ? 'var(--main)' : 'var(--main-65)'}
											width="16"
											height="16"
										/>
										<span
											style={{
												color: task.Phase ? 'var(--main)' : 'var(--main-65)',
											}}
										>
											{task.Phase?.title || 'No phase'}
										</span>
									</div>
									{isPhaseOpen && (
										<div className={styles.selectorPopup}>
											<ClickOutsideWrapper
												onClose={() => setIsPhaseOpen(false)}
											>
												<ButtonSelector
													query={phaseQuery}
													onQueryChange={(e) =>
														handleQueryChange(
															e,
															setPhaseOptions,
															phaseOptions,
															setPhaseQuery
														)
													}
													inputRef={phaseRef}
													options={phaseOptions}
													placeholder="Select Phase"
													oldData={phaseOptions}
													setOptions={setPhaseOptions}
													setIsChosen={handlePhaseChange}
													setIsOpenOption={setIsPhaseOpen}
													isChosen={task.Phase?.id || 'none'}
												/>
											</ClickOutsideWrapper>
										</div>
									)}
								</div>
							</div>
						)}

						<div className={styles.property}>
							<div
								className={styles.selector}
								onClick={() => setIsAssigneeOpen(true)}
								data-selector="assignee"
							>
								<div className={styles.wrapper}>
									<Team fill={getAssigneeColor()} width="16" height="16" />
									<span style={{ color: getAssigneeColor() }}>
										{selectedAssignees.length === 0
											? 'Assignee'
											: `${selectedAssignees.length} assigned`}
									</span>
								</div>
								{isAssigneeOpen && (
									<div className={styles.selectorPopup}>
										<ClickOutsideWrapper
											onClose={() => setIsAssigneeOpen(false)}
										>
											<ButtonSelector
												query={assigneeQuery}
												onQueryChange={(e) =>
													handleQueryChange(
														e,
														setAssigneeOptions,
														assigneeOptions,
														setAssigneeQuery
													)
												}
												inputRef={assigneeRef}
												options={assigneeOptions}
												placeholder="Select Assignees"
												oldData={assigneeOptions}
												setOptions={setAssigneeOptions}
												setIsChosen={handleAssigneesChange}
												setIsOpenOption={setIsAssigneeOpen}
												isChosen=""
												isComboBox={true}
												selectedItems={selectedAssignees}
												onSelectedItemsChange={setSelectedAssignees}
											/>
										</ClickOutsideWrapper>
									</div>
								)}
							</div>
						</div>

						<div className={styles.property}>
							<div
								className={styles.selector}
								onClick={() => setIsLabelOpen(true)}
								data-selector="label"
							>
								<div className={styles.wrapper}>
									{selectedLabels.length > 0 ? (
										<div className={styles.selectedLabels}>
											<div className={styles.labelPills}>
												{selectedLabels.map((labelId, index) => {
													const label = labelOptions.find(
														(l) => l.value === labelId
													);
													return label && index < 3 ? (
														<div
															key={labelId}
															className={styles.labelPill}
															style={{ backgroundColor: label.color }}
														/>
													) : null;
												})}
											</div>
											<span style={{ color: getLabelColor() }}>
												{selectedLabels.length === 1
													? labelOptions.find(
															(l) => l.value === selectedLabels[0]
													  )?.label
													: `${selectedLabels.length} labels`}
											</span>
										</div>
									) : (
										<>
											<Label fill={getLabelColor()} width="16" height="16" />
											<span style={{ color: getLabelColor() }}>Labels</span>
										</>
									)}
								</div>
								{isLabelOpen && (
									<div className={styles.selectorPopup}>
										<ClickOutsideWrapper onClose={() => setIsLabelOpen(false)}>
											<ButtonSelector
												query={labelQuery}
												onQueryChange={(e) =>
													handleQueryChange(
														e,
														setLabelOptions,
														labelOptions,
														setLabelQuery
													)
												}
												inputRef={labelRef}
												options={labelOptions}
												placeholder="Select Labels"
												oldData={labelOptions}
												setOptions={setLabelOptions}
												setIsChosen={handleLabelsChange}
												setIsOpenOption={setIsLabelOpen}
												isChosen=""
												isComboBox={true}
												selectedItems={selectedLabels}
												onSelectedItemsChange={setSelectedLabels}
												showColorBadge={true}
											/>
										</ClickOutsideWrapper>
									</div>
								)}
							</div>
						</div>

						<div className={styles.property}>
							<div
								className={styles.selector}
								onClick={() => setIsDateOpen(true)}
								data-selector="date"
							>
								<div className={styles.wrapper}>
									<DatePicker
										fill={getDateColor(dueDate)}
										width="16"
										height="16"
									/>
									<span style={{ color: getDateColor(dueDate) }}>
										{dueDate
											? dueDate.toLocaleDateString('en-US', {
													month: 'short',
													day: 'numeric',
											  })
											: 'Due date'}
									</span>
								</div>
								{isDateOpen && (
									<div className={styles.selectorPopup}>
										<ClickOutsideWrapper onClose={() => setIsDateOpen(false)}>
											<SingleDatePicker
												date={dueDate}
												setDate={handleDateChange}
												setIsDateOpen={() => setIsDateOpen(false)}
											/>
										</ClickOutsideWrapper>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<Spacing space={28} />

				<div className={styles.contentSection}>
					<div className={styles.editorWrapper}>
						<TiptapEditor
							content={content}
							onChange={(newContent) => {
								setContent(newContent);
								if (contentTimer.current) {
									clearTimeout(contentTimer.current);
								}
								contentTimer.current = setTimeout(() => {
									handleUpdate(
										{ content: newContent },
										'Content',
										'updated',
										false
									);
								}, 500);
							}}
							placeholder="Add your content here..."
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TaskDetails;
