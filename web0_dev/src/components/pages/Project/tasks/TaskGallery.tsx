import styles from './TaskGallery.module.scss';
import {
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
	DragOverEvent,
	useDroppable,
} from '@dnd-kit/core';

import {
	useEffect,
	useMemo,
	useState,
	useCallback,
	useTransition,
	useRef,
} from 'react';
import Column from './Column';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import TaskComponent from './Task';
import {
	Phase,
	Task,
	TaskStatus,
	TimeLog,
	Comment,
	Label,
	Member,
	projectPriority,
} from '@prisma/client';
import { TaskColumnType } from '@/components/types/types';
import ArrowLineRight from '@/svgs/ArrowLineRight';
import SVG from '@/components/general/SVG';
import Dots from '@/svgs/Dots';
import { useOutsideRef } from '@/utils/useOutsideRef';
import {
	bulkUpdateTaskPriority,
	bulkUpdateTaskStatus,
	bulkUpdateTaskPhase,
	bulkUpdateTaskAssignees,
	bulkUpdateTaskLabels,
	bulkUpdateTaskDueDate,
	bulkDeleteTasks,
} from '@/actions/TaskActions';
import { updateTaskStatus } from '@/actions/CRUDTask';
import { toast } from 'sonner';
import { Dispatch, SetStateAction } from 'react';
import Toolbar, { ToolbarAction } from '@/components/general/Toolbar/Toolbar';
import MoreHorizontal from '@/svgs/MoreHorizontal';
import ButtonSelector from '@/components/pages/projects/addProject/ButtonSelector';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';
import Team from '@/svgs/Team';
import NoPriority from '@/svgs/NoPriority';
import MediumPriority from '@/svgs/MediumPriority';
import HighPriority from '@/svgs/HighPriority';
import UrgentPriority from '@/svgs/UrgentPriority';
import LowPriority from '@/svgs/LowPriority';
import PhaseIcon from '@/svgs/Phase';
import DatePicker from '@/svgs/DatePicker';
import SingleDatePicker from '@/components/general/ui/date/SingleDatePicker';
import LabelIcon from '@/svgs/Label';

const statusHeaderMap: Record<TaskStatus, string> = {
	Backlog: 'Backlog',
	todo: 'To Do',
	inProgress: 'In Progress',
	inReview: 'In Review',
	Completed: 'Completed',
	canceled: 'Canceled',
};

const HiddenColumn = ({
	column,
	onShowColumn,
}: {
	column: TaskColumnType;
	onShowColumn?: (columnId: number) => void;
}) => {
	const { setNodeRef, isOver, active } = useDroppable({
		id: `hidden-${column.id}`,
		data: { type: 'column', title: column.title },
	});

	const [showDropdown, setShowDropdown] = useState(false);
	const handleClickOutside = useCallback(() => {
		setShowDropdown(false);
	}, []);

	const dropdownRef = useOutsideRef(handleClickOutside);
	const isValidDrop = active?.data?.current?.type === 'task' && isOver;

	return (
		<div
			ref={setNodeRef}
			className={`${styles.hiddenColumn} ${isValidDrop ? styles.isOver : ''}`}
			data-column-id={column.id}
		>
			<span>{statusHeaderMap[column.title as TaskStatus] || column.title}</span>
			<span>{column.tasks.length}</span>
			{column.tasks.length > 0 && (
				<div className={styles.headerRight} ref={dropdownRef}>
					<SVG onClick={() => setShowDropdown(!showDropdown)}>
						<Dots fill={'var(--main)'} width="18" height="18" />
					</SVG>
					{showDropdown && (
						<div className={styles.dropdown}>
							<button
								onClick={() => {
									onShowColumn?.(column.id);
									setShowDropdown(false);
								}}
							>
								Show column
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

type ExtendedTask = Task & {
	phase?: Phase;
	comments?: Comment[];
	timeLogs?: TimeLog[];
	labels?: Label[];
	assignees?: Member[];
};

interface TaskGalleryProps {
	tasks: ExtendedTask[];
	setTasks: Dispatch<SetStateAction<ExtendedTask[]>>;
	orgUrl: string;
	projectId: string;
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
	availableMembers?: (Member & { user: { email: string } })[];
}

const TaskGallery = ({
	tasks,
	setTasks,
	orgUrl,
	projectId,
	onUpdatePriority,
	onUpdateStatus,
	onUpdatePhase,
	onUpdateAssignees,
	onUpdateLabels,
	onUpdateDueDate,
	phases = [],
	availableLabels = [],
	availableMembers = [],
}: TaskGalleryProps) => {
	const [, startTransition] = useTransition();
	const statuses = useMemo<TaskStatus[]>(
		() => [
			'Backlog',
			'todo',
			'inProgress',
			'inReview',
			'Completed',
			'canceled',
		],
		[]
	);

	const [visibleColumns, setVisibleColumns] = useState<TaskColumnType[]>([]);
	const [hiddenColumns, setHiddenColumns] = useState<TaskColumnType[]>([]);
	const [manuallyHiddenColumns, setManuallyHiddenColumns] = useState<string[]>(
		[]
	);
	const [activeTask, setActiveTask] = useState<Task | null>(null);
	const [isHiddenCollapsed, setIsHiddenCollapsed] = useState(false);
	const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
	const [anchorTask, setAnchorTask] = useState<string | null>(null);
	const [isShiftPressed, setIsShiftPressed] = useState(false);
	const [isCtrlPressed, setIsCtrlPressed] = useState(false);

	const [isPriorityOpen, setIsPriorityOpen] = useState(false);
	const [priorityQuery, setPriorityQuery] = useState('');
	const priorityRef = useRef(null);

	const [isStatusOpen, setIsStatusOpen] = useState(false);
	const [statusQuery, setStatusQuery] = useState('');
	const statusRef = useRef(null);

	const [isPhaseOpen, setIsPhaseOpen] = useState(false);
	const [phaseQuery, setPhaseQuery] = useState('');
	const phaseRef = useRef(null);

	const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
	const [assigneeQuery, setAssigneeQuery] = useState('');
	const assigneeRef = useRef(null);

	const [selectedPriorityValue, setSelectedPriorityValue] =
		useState<string>('');
	const [selectedStatusValue, setSelectedStatusValue] = useState<string>('');
	const [selectedPhaseValue, setSelectedPhaseValue] = useState<string>('');
	const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);

	const [isDateOpen, setIsDateOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

	const [isLabelOpen, setIsLabelOpen] = useState(false);
	const [labelQuery, setLabelQuery] = useState('');
	const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
	const labelRef = useRef(null);

	const labelOptions = availableLabels.map((label) => ({
		label: label.name,
		value: label.id,
		icon: LabelIcon,
		color: label.color,
	}));

	const [labelState, setLabelOptions] = useState(labelOptions);

	const handleHideColumn = (columnId: number) => {
		const columnToHide = visibleColumns.find((col) => col.id === columnId);
		if (columnToHide) {
			setVisibleColumns((prev) => prev.filter((col) => col.id !== columnId));
			setHiddenColumns((prev) => [...prev, columnToHide]);
			setManuallyHiddenColumns((prev) => [...prev, columnToHide.title]);
		}
	};

	const handleShowColumn = (columnId: number) => {
		const columnToShow = hiddenColumns.find((col) => col.id === columnId);
		if (columnToShow) {
			setHiddenColumns((prev) => prev.filter((col) => col.id !== columnId));
			setVisibleColumns((prev) => [...prev, columnToShow]);
			setManuallyHiddenColumns((prev) =>
				prev.filter((title) => title !== columnToShow.title)
			);
		}
	};

	useEffect(() => {
		const updatedColumnsData = statuses.map((status, index) => {
			const tasksForStatus = tasks.filter((task) => task.status === status);
			return {
				id: index + 1,
				title: status,
				displayTitle: statusHeaderMap[status],
				tasks: tasksForStatus,
			};
		});

		const newVisibleColumns: TaskColumnType[] = [];
		const newHiddenColumns: TaskColumnType[] = [];

		updatedColumnsData.forEach((column) => {
			if (manuallyHiddenColumns.includes(column.title)) {
				newHiddenColumns.push(column);
			} else if (column.tasks.length === 0) {
				newHiddenColumns.push(column);
			} else {
				newVisibleColumns.push(column);
			}
		});

		setVisibleColumns(newVisibleColumns);
		if (!activeTask) {
			setHiddenColumns(newHiddenColumns);
		}
	}, [tasks, statuses, activeTask, manuallyHiddenColumns]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Shift') {
				setIsShiftPressed(true);
			} else if (e.key === 'Control') {
				setIsCtrlPressed(true);
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === 'Shift') {
				setIsShiftPressed(false);
			} else if (e.key === 'Control') {
				setIsCtrlPressed(false);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const updateTaskStatusWithOptimisticUI = useCallback(
		async (
			taskId: string,
			newStatus: TaskStatus,
			previousTasks: (Task & {
				Phase?: Phase;
				Comment?: Comment[];
				timeLogs?: TimeLog[];
				labels?: Label[];
				assignees?: Member[];
			})[]
		) => {
			try {
				const { error } = await updateTaskStatus(
					taskId,
					newStatus,
					projectId,
					orgUrl
				);
				if (error) {
					setTasks(previousTasks);
					toast.error('Failed to update task status');
				}
			} catch (err: unknown) {
				setTasks(previousTasks);
				toast.error('Failed to update task status');
				console.error('Error updating task status:', err);
			}
		},
		[projectId, orgUrl, setTasks]
	);

	function onDragStart(event: DragOverEvent) {
		if (event.active.data.current?.type === 'task') {
			setActiveTask(event.active.data.current.task);
		}
	}

	function onDragOver(event: DragOverEvent) {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (active.id === over.id) return;

		const isActiveTask = active.data.current?.type === 'task';
		const isOverTask = over.data.current?.type === 'task';
		const isOverColumn = over.data.current?.type === 'column';
		const overColumnTitle = over?.data.current?.title;

		if (isActiveTask && isOverTask) {
			setTasks((prevTasks) => {
				const activeIndex = prevTasks.findIndex((t) => t.id === activeId);
				const overIndex = prevTasks.findIndex((t) => t.id === overId);
				const newStatus = prevTasks[overIndex].status;

				const updatedTasks = [...prevTasks];
				updatedTasks[activeIndex] = {
					...updatedTasks[activeIndex],
					status: newStatus,
				};

				return arrayMove(updatedTasks, activeIndex, overIndex);
			});
		}

		if (
			isActiveTask &&
			isOverColumn &&
			!hiddenColumns.some((col) => col.title === overColumnTitle)
		) {
			setTasks((prevTasks) => {
				const activeIndex = prevTasks.findIndex((t) => t.id === activeId);
				const updatedTasks = [...prevTasks];
				updatedTasks[activeIndex] = {
					...updatedTasks[activeIndex],
					status: overColumnTitle,
				};

				return arrayMove(updatedTasks, activeIndex, activeIndex);
			});
		}
	}

	function onDragEnd(event: DragOverEvent) {
		const { active, over } = event;

		if (over) {
			const isOverColumn = over.data.current?.type === 'column';
			const isOverTask = over.data.current?.type === 'task';
			const overColumnTitle = over?.data.current?.title;
			const activeId = active.id;

			const previousTasks = [...tasks];

			if (isOverTask) {
				const overId = over.id;
				const task = tasks.find((t) => t.id === overId);
				if (task) {
					setTasks((prevTasks) => {
						const updatedTasks = [...prevTasks];
						const activeIndex = updatedTasks.findIndex(
							(t) => t.id === activeId
						);
						updatedTasks[activeIndex] = {
							...updatedTasks[activeIndex],
							status: task.status,
						};
						return updatedTasks;
					});

					startTransition(() => {
						updateTaskStatusWithOptimisticUI(
							activeId as string,
							task.status,
							previousTasks
						);
					});
				}
			} else if (isOverColumn && overColumnTitle) {
				setTasks((prevTasks) => {
					const updatedTasks = [...prevTasks];
					const activeIndex = updatedTasks.findIndex((t) => t.id === activeId);
					updatedTasks[activeIndex] = {
						...updatedTasks[activeIndex],
						status: overColumnTitle,
					};
					return updatedTasks;
				});

				startTransition(() => {
					updateTaskStatusWithOptimisticUI(
						activeId as string,
						overColumnTitle as TaskStatus,
						previousTasks
					);
				});
			}
		}

		setActiveTask(null);
	}

	const handleTaskSelect = (taskId: string, e: React.MouseEvent) => {
		e.preventDefault();

		if (!isShiftPressed && !isCtrlPressed) {
			setSelectedTasks(new Set([taskId]));
			setAnchorTask(taskId);
			return;
		}

		if (isCtrlPressed && !isShiftPressed) {
			setSelectedTasks((prev) => {
				const newSet = new Set(prev);
				if (newSet.has(taskId)) {
					newSet.delete(taskId);
				} else {
					newSet.add(taskId);
				}
				return newSet;
			});
			setAnchorTask(taskId);
			return;
		}

		if (isShiftPressed) {
			if (!anchorTask) {
				setSelectedTasks(new Set([taskId]));
				setAnchorTask(taskId);
				return;
			}

			const visibleTasks: string[] = [];

			const tasksByColumn: Record<string, string[]> = {};

			tasks.forEach((task) => {
				const columnKey = task.status || 'unknown';
				if (!tasksByColumn[columnKey]) {
					tasksByColumn[columnKey] = [];
				}
				tasksByColumn[columnKey].push(task.id);
			});

			Object.keys(statusHeaderMap).forEach((columnKey) => {
				if (tasksByColumn[columnKey]) {
					visibleTasks.push(...tasksByColumn[columnKey]);
				}
			});

			const anchorIndex = visibleTasks.indexOf(anchorTask);
			const currentIndex = visibleTasks.indexOf(taskId);

			if (anchorIndex === -1 || currentIndex === -1) return;

			const start = Math.min(anchorIndex, currentIndex);
			const end = Math.max(anchorIndex, currentIndex);
			const tasksToSelect = visibleTasks.slice(start, end + 1);

			setSelectedTasks(new Set(tasksToSelect));
		}
	};

	const clearSelection = () => {
		setSelectedTasks(new Set());
		setAnchorTask(null);
	};

	const handleBulkPriorityChange = async (priority: projectPriority) => {
		if (selectedTasks.size === 0) return;

		const taskIds = Array.from(selectedTasks);

		const previousTasks = [...tasks];

		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				selectedTasks.has(task.id) ? { ...task, priority } : task
			)
		);

		try {
			const result = await bulkUpdateTaskPriority(
				taskIds,
				priority,
				orgUrl,
				projectId
			);

			if (!result.success) {
				setTasks(previousTasks);
				toast.error('Failed to update task priorities');
			} else {
				toast.success(`Updated priority for ${taskIds.length} tasks`);
			}
		} catch (error) {
			setTasks(previousTasks);
			toast.error('Failed to update task priorities');
			console.error('Error updating task priorities:', error);
		}
	};

	const handleBulkStatusChange = async (status: TaskStatus) => {
		if (selectedTasks.size === 0) return;

		const taskIds = Array.from(selectedTasks);

		const previousTasks = [...tasks];

		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				selectedTasks.has(task.id) ? { ...task, status } : task
			)
		);

		try {
			const result = await bulkUpdateTaskStatus(
				taskIds,
				status,
				orgUrl,
				projectId
			);

			if (!result.success) {
				setTasks(previousTasks);
				toast.error('Failed to update task statuses');
			} else {
				toast.success(`Updated status for ${taskIds.length} tasks`);
			}
		} catch (error) {
			setTasks(previousTasks);
			toast.error('Failed to update task statuses');
			console.error('Error updating task statuses:', error);
		}
	};

	const handleBulkPhaseChange = async (phaseId: string | null) => {
		if (selectedTasks.size === 0) return;

		const taskIds = Array.from(selectedTasks);

		const previousTasks = [...tasks];

		const phaseObj = phases.find((p) => p.id === phaseId);

		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				selectedTasks.has(task.id)
					? { ...task, phaseId, phase: phaseObj }
					: task
			)
		);

		try {
			const result = await bulkUpdateTaskPhase(
				taskIds,
				phaseId,
				orgUrl,
				projectId
			);

			if (!result.success) {
				setTasks(previousTasks);
				toast.error('Failed to update task phases');
			} else {
				toast.success(`Updated phase for ${taskIds.length} tasks`);
			}
		} catch (error) {
			setTasks(previousTasks);
			toast.error('Failed to update task phases');
			console.error('Error updating task phases:', error);
		}
	};

	const handleBulkAssigneesChange = async (assigneeIds: string[]) => {
		if (selectedTasks.size === 0) return;

		const taskIds = Array.from(selectedTasks);

		const previousTasks = [...tasks];

		const assignees = availableMembers.filter((member) =>
			assigneeIds.includes(member.id)
		);

		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				selectedTasks.has(task.id) ? { ...task, assignees } : task
			)
		);

		try {
			const result = await bulkUpdateTaskAssignees(
				taskIds,
				assigneeIds,
				orgUrl,
				projectId
			);

			if (!result.success) {
				setTasks(previousTasks);
				toast.error('Failed to update task assignees');
			} else {
				toast.success(`Updated assignees for ${taskIds.length} tasks`);
			}
		} catch (error) {
			setTasks(previousTasks);
			toast.error('Failed to update task assignees');
			console.error('Error updating task assignees:', error);
		}
	};

	const handleBulkDateChange = async (date: Date | undefined) => {
		if (selectedTasks.size === 0) return;

		const taskIds = Array.from(selectedTasks);

		const previousTasks = [...tasks];

		const dueDate = date || null;

		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				selectedTasks.has(task.id) ? { ...task, dueDate } : task
			)
		);

		try {
			const result = await bulkUpdateTaskDueDate(
				taskIds,
				dueDate,
				orgUrl,
				projectId
			);

			if (!result.success) {
				setTasks(previousTasks);
				toast.error('Failed to update due dates');
			} else {
				toast.success(`Updated due date for ${taskIds.length} tasks`);
			}
		} catch (error) {
			setTasks(previousTasks);
			toast.error('Failed to update due dates');
			console.error('Error updating due dates:', error);
		}
	};

	const handleBulkLabelsChange = async (labelIds: string[]) => {
		if (selectedTasks.size === 0) return;

		const taskIds = Array.from(selectedTasks);

		const previousTasks = [...tasks];

		const labels = availableLabels.filter((label) =>
			labelIds.includes(label.id)
		);

		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				selectedTasks.has(task.id) ? { ...task, labels } : task
			)
		);

		try {
			const result = await bulkUpdateTaskLabels(
				taskIds,
				labelIds,
				orgUrl,
				projectId
			);

			if (!result.success) {
				setTasks(previousTasks);
				toast.error('Failed to update task labels');
			} else {
				toast.success(`Updated labels for ${taskIds.length} tasks`);
			}
		} catch (error) {
			setTasks(previousTasks);
			toast.error('Failed to update task labels');
			console.error('Error updating task labels:', error);
		}
	};

	const handleBulkDelete = async () => {
		if (selectedTasks.size === 0) return;

		const taskIds = Array.from(selectedTasks);

		const previousTasks = [...tasks];

		setTasks((prevTasks) =>
			prevTasks.filter((task) => !selectedTasks.has(task.id))
		);

		try {
			const result = await bulkDeleteTasks(taskIds, orgUrl, projectId);

			if (!result.success) {
				setTasks(previousTasks);
				toast.error('Failed to delete tasks');
			} else {
				toast.success(`Successfully deleted ${taskIds.length} tasks`);
				clearSelection();
			}
		} catch (error) {
			setTasks(previousTasks);
			toast.error('Failed to delete tasks');
			console.error('Error deleting tasks:', error);
		}
	};

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
		label: member.user.email || 'Unknown',
		value: member.id,
		icon: Team,
	}));

	const [priorityState, setPriorityOptions] = useState(priorityOptions);
	const [statusState, setStatusOptions] = useState(statusOptions);
	const [phaseState, setPhaseOptions] = useState(phaseOptions);
	const [memberState, setMemberOptions] = useState(memberOptions);

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

	const findCommonPriority = () => {
		const selectedTasksList = tasks.filter((task) =>
			selectedTasks.has(task.id)
		);
		if (selectedTasksList.length === 0) return '';

		const firstTaskPriority = selectedTasksList[0]?.priority || '';

		return selectedTasksList.every(
			(task) => task.priority === firstTaskPriority
		)
			? firstTaskPriority
			: '';
	};

	const findCommonStatus = () => {
		const selectedTasksList = tasks.filter((task) =>
			selectedTasks.has(task.id)
		);
		if (selectedTasksList.length === 0) return '';

		const firstTaskStatus = selectedTasksList[0]?.status || '';

		return selectedTasksList.every((task) => task.status === firstTaskStatus)
			? firstTaskStatus
			: '';
	};

	const findCommonPhase = () => {
		const selectedTasksList = tasks.filter((task) =>
			selectedTasks.has(task.id)
		);
		if (selectedTasksList.length === 0) return '';

		const allNoPhase = selectedTasksList.every((task) => !task.phaseId);
		if (allNoPhase) return 'none';

		const firstTaskPhaseId = selectedTasksList[0]?.phaseId || '';

		return selectedTasksList.every((task) => task.phaseId === firstTaskPhaseId)
			? firstTaskPhaseId
			: '';
	};

	const findCommonAssignees = () => {
		const selectedTasksList = tasks.filter((task) =>
			selectedTasks.has(task.id)
		);
		if (selectedTasksList.length === 0) return [];

		const firstTaskAssigneeIds =
			selectedTasksList[0]?.assignees?.map((a) => a.id) || [];

		return firstTaskAssigneeIds.filter((assigneeId) =>
			selectedTasksList.every((task) =>
				task.assignees?.some((a) => a.id === assigneeId)
			)
		);
	};

	const handleLabelQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<typeof labelOptions>>,
		oldData: typeof labelOptions
	) => {
		const value = e.target.value;
		setLabelQuery(value);

		if (value.trim() === '') {
			setOptions(oldData);
			return;
		}

		const filtered = oldData.filter((option) =>
			option.label.toLowerCase().includes(value.toLowerCase())
		);
		setOptions(filtered);
	};

	const findCommonLabels = () => {
		const selectedTasksList = tasks.filter((task) =>
			selectedTasks.has(task.id)
		);
		if (selectedTasksList.length === 0) return [];

		const firstTaskLabelIds =
			selectedTasksList[0]?.labels?.map((l) => l.id) || [];

		return firstTaskLabelIds.filter((labelId) =>
			selectedTasksList.every((task) =>
				task.labels?.some((l) => l.id === labelId)
			)
		);
	};

	const toolbarActions: ToolbarAction[] = [
		{
			label: 'Priority',
			icon: MoreHorizontal,
			onClick: () => {
				const commonPriority = findCommonPriority();
				setSelectedPriorityValue(commonPriority);
				setIsPriorityOpen(true);
			},
			dropdown: (
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
							setIsChosen={(value) => {
								const priority =
									typeof value === 'string' ? value : value.value;
								setSelectedPriorityValue(priority);
								handleBulkPriorityChange(priority as projectPriority);
								setIsPriorityOpen(false);
							}}
							setIsOpenOption={setIsPriorityOpen}
							isChosen={selectedPriorityValue}
						/>
					</ClickOutsideWrapper>
				</div>
			),
			isOpen: isPriorityOpen,
		},
		{
			label: 'Status',
			icon: MoreHorizontal,
			onClick: () => {
				const commonStatus = findCommonStatus();
				setSelectedStatusValue(commonStatus);
				setIsStatusOpen(true);
			},
			dropdown: (
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
							setIsChosen={(value) => {
								const status = typeof value === 'string' ? value : value.value;
								setSelectedStatusValue(status);
								handleBulkStatusChange(status as TaskStatus);
								setIsStatusOpen(false);
							}}
							setIsOpenOption={setIsStatusOpen}
							isChosen={selectedStatusValue}
						/>
					</ClickOutsideWrapper>
				</div>
			),
			isOpen: isStatusOpen,
		},
		{
			label: 'Phase',
			icon: PhaseIcon,
			onClick: () => {
				const commonPhase = findCommonPhase();
				setSelectedPhaseValue(commonPhase);
				setIsPhaseOpen(true);
			},
			dropdown: (
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
							setIsChosen={(value) => {
								const phaseId = typeof value === 'string' ? value : value.value;
								setSelectedPhaseValue(phaseId);
								handleBulkPhaseChange(phaseId === 'none' ? null : phaseId);
								setIsPhaseOpen(false);
							}}
							setIsOpenOption={setIsPhaseOpen}
							isChosen={selectedPhaseValue}
						/>
					</ClickOutsideWrapper>
				</div>
			),
			isOpen: isPhaseOpen,
		},
		{
			label: 'Assignees',
			icon: Team,
			onClick: () => {
				const commonAssignees = findCommonAssignees();
				setSelectedAssigneeIds(commonAssignees);
				setIsAssigneeOpen(true);
			},
			dropdown: (
				<div className={styles.selectorPopup}>
					<ClickOutsideWrapper onClose={() => setIsAssigneeOpen(false)}>
						<div className={styles.selectorContainer}>
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
								setIsChosen={() => {
									return;
								}}
								setIsOpenOption={setIsAssigneeOpen}
								isChosen=""
								isComboBox={true}
								selectedItems={selectedAssigneeIds}
								onSelectedItemsChange={(items) => {
									setSelectedAssigneeIds(items);
									handleBulkAssigneesChange(items);
								}}
							/>
						</div>
					</ClickOutsideWrapper>
				</div>
			),
			isOpen: isAssigneeOpen,
		},
		{
			label: 'Due Date',
			icon: DatePicker,
			onClick: () => setIsDateOpen(true),
			dropdown: (
				<div className={styles.selectorPopup}>
					<ClickOutsideWrapper onClose={() => setIsDateOpen(false)}>
						<div className={styles.selectorContainer}>
							<SingleDatePicker
								date={selectedDate}
								setDate={(date) => {
									setSelectedDate(date);
									handleBulkDateChange(date);
									setIsDateOpen(false);
								}}
								setIsDateOpen={(isOpen) => setIsDateOpen(!!isOpen)}
							/>
						</div>
					</ClickOutsideWrapper>
				</div>
			),
			isOpen: isDateOpen,
		},
		{
			label: 'Labels',
			icon: LabelIcon,
			onClick: () => {
				const commonLabels = findCommonLabels();
				setSelectedLabelIds(commonLabels);
				setIsLabelOpen(true);
			},
			dropdown: (
				<div className={styles.selectorPopup}>
					<ClickOutsideWrapper onClose={() => setIsLabelOpen(false)}>
						<div className={styles.selectorContainer}>
							<ButtonSelector
								query={labelQuery}
								onQueryChange={(e) =>
									handleLabelQueryChange(e, setLabelOptions, labelOptions)
								}
								inputRef={labelRef}
								options={labelState}
								placeholder="Select Labels"
								oldData={labelOptions}
								setOptions={setLabelOptions}
								setIsChosen={() => {
									return;
								}}
								setIsOpenOption={setIsLabelOpen}
								isChosen=""
								isComboBox={true}
								selectedItems={selectedLabelIds}
								onSelectedItemsChange={(items) => {
									setSelectedLabelIds(items);
									handleBulkLabelsChange(items);
								}}
								showColorBadge={true}
							/>
						</div>
					</ClickOutsideWrapper>
				</div>
			),
			isOpen: isLabelOpen,
		},
		{
			label: 'Delete',
			icon: MoreHorizontal,
			onClick: handleBulkDelete,
			variant: 'danger',
		},
	];

	return (
		<div className={styles.wrapper}>
			<DndContext
				sensors={sensors}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
				onDragOver={onDragOver}
			>
				<div className={styles.container}>
					<div className={styles.grid}>
						{visibleColumns.map((column) => (
							<Column
								key={column.id}
								column={column}
								onHideColumn={handleHideColumn}
								orgUrl={orgUrl}
								projectId={projectId}
								onUpdatePriority={onUpdatePriority}
								onUpdateStatus={onUpdateStatus}
								onUpdatePhase={onUpdatePhase}
								onUpdateAssignees={onUpdateAssignees}
								onUpdateLabels={onUpdateLabels}
								onUpdateDueDate={onUpdateDueDate}
								phases={phases}
								availableLabels={availableLabels}
								availableMembers={availableMembers}
								selectedTasks={selectedTasks}
								onTaskSelect={handleTaskSelect}
							/>
						))}
					</div>

					<div
						className={`${styles.hiddenColumns} ${
							isHiddenCollapsed ? styles.collapsed : ''
						}`}
					>
						<button
							className={styles.hiddenHeader}
							onClick={() => setIsHiddenCollapsed(!isHiddenCollapsed)}
						>
							<div className={styles.headerContent}>
								<h3>Hidden columns</h3>
								<span>{hiddenColumns.length}</span>
							</div>
							<ArrowLineRight
								width="16"
								height="16"
								className={styles.chevron}
							/>
						</button>
						<div className={styles.hiddenList}>
							{hiddenColumns.map((column) => (
								<HiddenColumn
									key={column.id}
									column={column}
									onShowColumn={handleShowColumn}
								/>
							))}
						</div>
					</div>
				</div>
				{createPortal(
					<DragOverlay>
						{activeTask && (
							<TaskComponent
								task={activeTask}
								orgUrl={orgUrl}
								phases={phases}
								availableLabels={availableLabels}
								availableMembers={availableMembers}
							/>
						)}
					</DragOverlay>,
					document.body
				)}
			</DndContext>

			<Toolbar
				selectedCount={selectedTasks.size}
				onClearSelection={clearSelection}
				actions={toolbarActions}
			/>
		</div>
	);
};

export default TaskGallery;
