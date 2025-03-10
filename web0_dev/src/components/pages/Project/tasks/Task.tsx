import styles from './Task.module.scss';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import {
	Phase,
	Task as TaskType,
	TimeLog,
	Comment,
	Label,
	Member,
	projectPriority,
	TaskStatus,
} from '@prisma/client';
import Clock from '@/svgs/Clock';
import ChatText from '@/svgs/ChatText';
import PhaseIcon from '@/svgs/Phase';
import { useRouter } from 'next/navigation';
import Team from '@/svgs/Team';
import NoPriority from '@/svgs/NoPriority';
import MediumPriority from '@/svgs/MediumPriority';
import HighPriority from '@/svgs/HighPriority';
import UrgentPriority from '@/svgs/UrgentPriority';
import LowPriority from '@/svgs/LowPriority';
import { getDateFormat } from '@/utils/DateHooks';
import DatePicker from '@/svgs/DatePicker';
import Spacing from '@/components/general/Spacing';
import SVG from '@/components/general/SVG';
import { useState, useRef } from 'react';
import ButtonSelector from '@/components/pages/projects/addProject/ButtonSelector';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';
import SingleDatePicker from '@/components/general/ui/date/SingleDatePicker';
import LabelIcon from '@/svgs/Label';

interface TaskProps {
	task: TaskType & {
		Phase?: Phase;
		Comment?: Comment[];
		timeLogs?: TimeLog[];
		labels?: Label[];
		assignees?: Member[];
	};
	orgUrl?: string;
	onUpdatePriority?: (
		taskId: string,
		priority: projectPriority
	) => Promise<void>;
	onUpdateStatus?: (taskId: string, status: TaskStatus) => Promise<void>;
	onUpdatePhase?: (taskId: string, phaseId: string | null) => Promise<void>;
	onUpdateAssignees?: (taskId: string, assigneeIds: string[]) => Promise<void>;
	onUpdateLabels?: (taskId: string, labelIds: string[]) => Promise<void>;
	onUpdateDueDate?: (taskId: string, dueDate: Date | null) => Promise<void>;
	phases?: Phase[];
	availableLabels?: Label[];
	availableMembers?: Member[];
}

const Task = ({
	task,
	orgUrl,
	onUpdatePriority,
	onUpdateStatus,
	onUpdatePhase,
	onUpdateAssignees,
	onUpdateLabels,
	onUpdateDueDate,
	phases = [],
	availableLabels = [],
	availableMembers = [],
}: TaskProps) => {
	const router = useRouter();
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: { type: 'task', task },
	});
	const style = { transition, transform: CSS.Transform.toString(transform) };

	// Priority selector state
	const [isPriorityOpen, setIsPriorityOpen] = useState(false);
	const [priorityQuery, setPriorityQuery] = useState('');
	const [currentPriority, setCurrentPriority] = useState<projectPriority>(
		task.priority || 'noPriority'
	);
	const priorityRef = useRef(null);

	// Status selector state
	const [isStatusOpen, setIsStatusOpen] = useState(false);
	const [statusQuery, setStatusQuery] = useState('');
	const [currentStatus, setCurrentStatus] = useState<TaskStatus>(task.status);
	const statusRef = useRef(null);

	// Phase selector state
	const [isPhaseOpen, setIsPhaseOpen] = useState(false);
	const [phaseQuery, setPhaseQuery] = useState('');
	const [currentPhase, setCurrentPhase] = useState<Phase | null>(
		task.Phase || null
	);
	const phaseRef = useRef(null);

	// Assignee selector state
	const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
	const [assigneeQuery, setAssigneeQuery] = useState('');
	const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
		task.assignees?.map((a) => a.id) || []
	);
	const assigneeRef = useRef(null);

	// Label selector state
	const [isLabelOpen, setIsLabelOpen] = useState<string | null>(null);
	const [labelQuery, setLabelQuery] = useState('');
	const [selectedLabels, setSelectedLabels] = useState<string[]>(
		task.labels?.map((l) => l.id) || []
	);
	const labelRef = useRef(null);

	// Date picker state
	const [isDateOpen, setIsDateOpen] = useState(false);
	const [currentDueDate, setCurrentDueDate] = useState<Date | null>(
		task.dueDate ? new Date(task.dueDate) : null
	);

	const priorityOptions = [
		{ label: 'No Priority', value: 'noPriority', icon: NoPriority },
		{ label: 'Low', value: 'low', icon: LowPriority },
		{ label: 'Medium', value: 'medium', icon: MediumPriority },
		{ label: 'High', value: 'high', icon: HighPriority },
		{ label: 'Urgent', value: 'urgent', icon: UrgentPriority },
	];

	const statusOptions = [
		{ label: 'Backlog', value: 'Backlog', icon: Team },
		{ label: 'To Do', value: 'todo', icon: Team },
		{ label: 'In Progress', value: 'inProgress', icon: Team },
		{ label: 'In Review', value: 'inReview', icon: Team },
		{ label: 'Completed', value: 'Completed', icon: Team },
		{ label: 'Canceled', value: 'canceled', icon: Team },
	];

	const phaseOptions = [
		{ label: 'No Phase', value: 'none', icon: PhaseIcon },
		...phases.map((phase) => ({
			label: phase.title,
			value: phase.id,
			icon: PhaseIcon,
		})),
	];

	const memberOptions = availableMembers.map((member) => ({
		label: member.user?.name || member.user?.email || 'Unknown',
		value: member.id,
		icon: Team,
	}));

	const labelOptions = availableLabels.map((label) => ({
		label: label.name,
		value: label.id,
		icon: LabelIcon,
		color: label.color,
	}));

	const [priorityState, setPriorityOptions] = useState(priorityOptions);
	const [statusState, setStatusOptions] = useState(statusOptions);
	const [phaseState, setPhaseOptions] = useState(phaseOptions);
	const [memberState, setMemberOptions] = useState(memberOptions);
	const [labelState, setLabelOptions] = useState(labelOptions);

	const handlePriorityChange = async (value: string | { value: string }) => {
		const newPriority = (
			typeof value === 'string' ? value : value.value
		) as projectPriority;
		setCurrentPriority(newPriority);
		setIsPriorityOpen(false);

		if (onUpdatePriority) {
			try {
				await onUpdatePriority(task.id, newPriority);
			} catch (error) {
				setCurrentPriority(task.priority || 'noPriority');
				console.error('Failed to update priority:', error);
			}
		}
	};

	const handleStatusChange = async (value: string | { value: string }) => {
		const newStatus = (
			typeof value === 'string' ? value : value.value
		) as TaskStatus;
		setCurrentStatus(newStatus);
		setIsStatusOpen(false);

		if (onUpdateStatus) {
			try {
				await onUpdateStatus(task.id, newStatus);
			} catch (error) {
				setCurrentStatus(task.status);
				console.error('Failed to update status:', error);
			}
		}
	};

	const handlePhaseChange = async (value: string | { value: string }) => {
		const phaseId = typeof value === 'string' ? value : value.value;
		const newPhase =
			phaseId === 'none' ? null : phases.find((p) => p.id === phaseId) || null;
		setCurrentPhase(newPhase);
		setIsPhaseOpen(false);

		if (onUpdatePhase) {
			try {
				await onUpdatePhase(task.id, newPhase?.id || null);
			} catch (error) {
				setCurrentPhase(task.Phase || null);
				console.error('Failed to update phase:', error);
			}
		}
	};

	const handleAssigneesChange = async (value: string | { value: string }) => {
		const memberId = typeof value === 'string' ? value : value.value;
		const newAssignees = selectedAssignees.includes(memberId)
			? selectedAssignees.filter((id) => id !== memberId)
			: [...selectedAssignees, memberId];

		setSelectedAssignees(newAssignees);

		if (onUpdateAssignees) {
			try {
				await onUpdateAssignees(task.id, newAssignees);
			} catch (error) {
				setSelectedAssignees(task.assignees?.map((a) => a.id) || []);
				console.error('Failed to update assignees:', error);
			}
		}
	};

	const handleLabelsChange = async (value: string | { value: string }) => {
		const labelId = typeof value === 'string' ? value : value.value;
		const newLabels = selectedLabels.includes(labelId)
			? selectedLabels.filter((id) => id !== labelId)
			: [...selectedLabels, labelId];

		setSelectedLabels(newLabels);

		if (onUpdateLabels) {
			try {
				await onUpdateLabels(task.id, newLabels);
			} catch (error) {
				setSelectedLabels(task.labels?.map((l) => l.id) || []);
				console.error('Failed to update labels:', error);
			}
		}
	};

	const handleDateChange = async (date: Date | null) => {
		setCurrentDueDate(date);
		setIsDateOpen(false);

		if (onUpdateDueDate) {
			try {
				await onUpdateDueDate(task.id, date);
			} catch (error) {
				setCurrentDueDate(task.dueDate ? new Date(task.dueDate) : null);
				console.error('Failed to update due date:', error);
			}
		}
	};

	const handleQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<typeof priorityOptions>>,
		oldData: typeof priorityOptions,
		setQuery: (value: string) => void
	) => {
		const value = e.target.value;
		setQuery(value);

		if (value.trim() === '') {
			setOptions(oldData);
			return;
		}

		const filtered = oldData.filter((option) =>
			option.label.toLowerCase().includes(value.toLowerCase())
		);
		setOptions(filtered);
	};

	const handleClick = (e: React.MouseEvent) => {
		if (isDragging) return;

		if ((e.target as HTMLElement).closest('[data-selector]')) return;

		if (orgUrl) {
			router.push(`/${orgUrl}/projects/${task.projectId}/tasks/${task.id}`);
		}
	};

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				{...attributes}
				{...listeners}
				style={style}
				className={`${styles.task} ${styles.dragging}`}
			></div>
		);
	}

	const PriorityIcon =
		priorityOptions.find((opt) => opt.value === currentPriority)?.icon ||
		NoPriority;
	const StatusIcon =
		statusOptions.find((opt) => opt.value === currentStatus)?.icon || Team;

	const getDateColor = (date: Date | null) => {
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

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			style={style}
			className={styles.task}
			onClick={handleClick}
		>
			<div className={styles.topRow}>
				<div className={styles.leftSide}>
					<div
						className={styles.selector}
						onClick={(e) => {
							e.stopPropagation();
							setIsPriorityOpen(true);
						}}
						data-selector="priority"
					>
						<SVG>
							<PriorityIcon
								fill={
									currentPriority === 'urgent'
										? 'var(--orange-90)'
										: 'var(--main)'
								}
								width="14"
								height="14"
							/>
						</SVG>
						{isPriorityOpen && (
							<div className={styles.selectorPopup}>
								<ClickOutsideWrapper onClose={() => setIsPriorityOpen(false)}>
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
										options={priorityState}
										placeholder="Select Priority"
										oldData={priorityOptions}
										setOptions={setPriorityOptions}
										setIsChosen={handlePriorityChange}
										setIsOpenOption={setIsPriorityOpen}
										isChosen={currentPriority}
									/>
								</ClickOutsideWrapper>
							</div>
						)}
					</div>
					<p>{task.customId}</p>
				</div>

				<div
					className={styles.selector}
					onClick={(e) => {
						e.stopPropagation();
						setIsStatusOpen(true);
					}}
					data-selector="status"
				>
					<SVG>
						<StatusIcon fill={'var(--main-70)'} width="14" height="14" />
					</SVG>
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
									options={statusState}
									placeholder="Select Status"
									oldData={statusOptions}
									setOptions={setStatusOptions}
									setIsChosen={handleStatusChange}
									setIsOpenOption={setIsStatusOpen}
									isChosen={currentStatus}
								/>
							</ClickOutsideWrapper>
						</div>
					)}
				</div>
			</div>
			<Spacing space={4} />
			<div className={styles.row}>
				<h3>{task.title}</h3>
			</div>
			<Spacing space={12} />
			<div className={styles.bottom}>
				<div
					className={styles.selector}
					onClick={(e) => {
						e.stopPropagation();
						setIsAssigneeOpen(true);
					}}
					data-selector="assignee"
				>
					<div className={styles.assignees}>
						{selectedAssignees.length > 0 ? (
							selectedAssignees.map((assigneeId) => {
								const member = availableMembers.find(
									(m) => m.id === assigneeId
								);
								return (
									<div className={styles.imgWrapper} key={assigneeId}>
										<Image
											src={member?.user?.image || 'https://placehold.co/24'}
											alt={`${member?.user?.name || 'User'}'s profile picture`}
											width={24}
											height={24}
											className={styles.profileImage}
										/>
									</div>
								);
							})
						) : (
							<div className={styles.imgWrapper}>
								<Image
									src={'https://placehold.co/24'}
									alt={`User's profile picture`}
									width={24}
									height={24}
									className={styles.profileImage}
								/>
							</div>
						)}
					</div>
					{isAssigneeOpen && (
						<div className={styles.selectorPopup}>
							<ClickOutsideWrapper onClose={() => setIsAssigneeOpen(false)}>
								<ButtonSelector
									query={assigneeQuery}
									onQueryChange={(e) =>
										handleQueryChange(
											e,
											setMemberOptions,
											memberOptions,
											setAssigneeQuery
										)
									}
									inputRef={assigneeRef}
									options={memberState}
									placeholder="Select Assignees"
									oldData={memberOptions}
									setOptions={setMemberOptions}
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
				{currentPhase && (
					<div
						className={styles.selector}
						onClick={(e) => {
							e.stopPropagation();
							setIsPhaseOpen(true);
						}}
						data-selector="phase"
					>
						<div className={styles.wrapper}>
							<PhaseIcon fill={'var(--main-70)'} width="12" height="12" />
							<p>{currentPhase.title}</p>
						</div>

						{isPhaseOpen && (
							<div className={styles.selectorPopup}>
								<ClickOutsideWrapper onClose={() => setIsPhaseOpen(false)}>
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
										options={phaseState}
										placeholder="Select Phase"
										oldData={phaseOptions}
										setOptions={setPhaseOptions}
										setIsChosen={handlePhaseChange}
										setIsOpenOption={setIsPhaseOpen}
										isChosen={currentPhase?.id || 'none'}
									/>
								</ClickOutsideWrapper>
							</div>
						)}
					</div>
				)}
				{currentDueDate && (
					<div
						className={styles.selector}
						onClick={(e) => {
							e.stopPropagation();
							setIsDateOpen(true);
						}}
						data-selector="date"
					>
						<div className={styles.wrapper}>
							<DatePicker
								fill={getDateColor(currentDueDate)}
								width="12"
								height="12"
							/>
							<p style={{ color: getDateColor(currentDueDate) }}>
								{getDateFormat(currentDueDate.toString())}
							</p>
						</div>

						{isDateOpen && (
							<div className={styles.selectorPopup}>
								<ClickOutsideWrapper onClose={() => setIsDateOpen(false)}>
									<SingleDatePicker
										date={currentDueDate}
										setDate={handleDateChange}
										setIsDateOpen={setIsDateOpen}
									/>
								</ClickOutsideWrapper>
							</div>
						)}
					</div>
				)}
				{selectedLabels.length > 0 && (
					<>
						{selectedLabels.map((labelId) => {
							const label = availableLabels.find((l) => l.id === labelId);
							if (!label) return null;
							return (
								<div
									key={labelId}
									className={styles.selector}
									onClick={(e) => {
										e.stopPropagation();
										setIsLabelOpen(isLabelOpen === labelId ? null : labelId);
									}}
									data-selector="label"
								>
									<div className={styles.wrapper}>
										<div
											className={styles.label}
											style={{ backgroundColor: label.color }}
										></div>
										<p>{label.name}</p>
									</div>
									{isLabelOpen === labelId && (
										<div className={styles.selectorPopup}>
											<ClickOutsideWrapper onClose={() => setIsLabelOpen(null)}>
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
													options={labelState}
													placeholder="Select Labels"
													oldData={labelOptions}
													setOptions={setLabelOptions}
													setIsChosen={handleLabelsChange}
													setIsOpenOption={() => setIsLabelOpen(null)}
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
							);
						})}
					</>
				)}

				{task.estimatedTime || (task.timeLogs && task.timeLogs.length > 0) ? (
					<div className={styles.wrapper}>
						<Clock fill={'var(--main)'} width="12" height="12" />
						<p>{`${
							task.estimatedTime && task.timeLogs && task.timeLogs.length > 0
								? `${
										task.timeLogs.reduce((acc, log) => acc + log.duration, 0) /
										60
								  }h / ${task.estimatedTime / 60}h`
								: task.estimatedTime
								? `${task.estimatedTime / 60}h`
								: `${
										(task.timeLogs || []).reduce(
											(acc, log) => acc + log.duration,
											0
										) / 60
								  }h`
						}`}</p>
					</div>
				) : null}

				{task.Comment && task.Comment.length > 0 && (
					<div className={`${styles.wrapper} ${styles.full}`}>
						<ChatText fill={'var(--main-70)'} width="12" height="12" />
						<p>{task.Comment.length}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Task;
