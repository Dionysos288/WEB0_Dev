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
import { updateTaskStatus } from '@/actions/CRUDTask';
import { toast } from 'sonner';
import { Dispatch, SetStateAction } from 'react';

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
	availableMembers?: Member[];
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
		</div>
	);
};

export default TaskGallery;
