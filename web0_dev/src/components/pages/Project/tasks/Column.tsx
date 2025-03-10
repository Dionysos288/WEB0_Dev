'use client';
import styles from './Column.module.scss';
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { useMemo, useState, useCallback } from 'react';
import Spacing from '@/components/general/Spacing';
import { TaskColumnType } from '@/components/types/types';
import PlusFilled from '@/svgs/Plus-Filled';
import TaskComponent from './Task';
import SVG from '@/components/general/SVG';
import Dots from '@/svgs/Dots';
import { useOutsideRef } from '@/utils/useOutsideRef';
import AddTaskPopup from './AddTaskPopup';
import {
	projectPriority,
	TaskStatus,
	Phase,
	Label,
	Member,
} from '@prisma/client';

interface ColumnProps {
	column: TaskColumnType;
	onHideColumn: (columnId: number) => void;
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
	selectedTasks?: Set<string>;
	onTaskSelect?: (taskId: string, event: React.MouseEvent) => void;
}

const Column = ({
	column,
	onHideColumn,
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
	selectedTasks = new Set(),
	onTaskSelect,
}: ColumnProps) => {
	const { title, displayTitle, tasks } = column;
	const allTasks = tasks.length;
	const [showDropdown, setShowDropdown] = useState(false);
	const [showAddTask, setShowAddTask] = useState(false);

	const handleClickOutside = useCallback(() => {
		setShowDropdown(false);
	}, []);

	const dropdownRef = useOutsideRef(handleClickOutside);

	const tasksId = useMemo(() => {
		return tasks.map((task) => task.id);
	}, [tasks]);

	const { attributes, listeners, setNodeRef } = useSortable({
		id: column.id,
		data: { type: 'column', title: title },
		disabled: true,
	});

	const getColumnColor = (title: string) => {
		switch (title) {
			case 'Backlog':
				return 'var(--canceled)';
			case 'inProgress':
				return 'var(--progress)';
			case 'Completed':
				return 'var(--completed)';
			default:
				return 'var(--main-25)';
		}
	};

	return (
		<>
			<div
				ref={setNodeRef}
				{...attributes}
				{...listeners}
				className={`${styles.columnWrapper} `}
			>
				<div className={styles.header}>
					<div className={styles.headerLeft}>
						<h2 className={styles.title}>{displayTitle || title}</h2>
						<p>{allTasks}</p>
					</div>
					<div className={styles.headerRight} ref={dropdownRef}>
						<SVG onClick={() => setShowDropdown(!showDropdown)}>
							<Dots fill={'var(--main)'} width="18" height="18" />
						</SVG>
						<div
							className={`${styles.dropdown} ${
								showDropdown ? styles.show : ''
							}`}
						>
							<button
								onClick={() => {
									onHideColumn?.(column.id);
									setShowDropdown(false);
								}}
							>
								Hide column
							</button>
						</div>
					</div>
				</div>
				<Spacing space={8} />
				<div
					className={styles.line}
					style={{ backgroundColor: getColumnColor(title) }}
				/>
				<Spacing space={16} />
				<div className={styles.column}>
					<SortableContext
						items={tasksId}
						strategy={verticalListSortingStrategy}
					>
						{tasks.map((task) => (
							<TaskComponent
								key={task.id}
								task={task}
								orgUrl={orgUrl}
								onUpdatePriority={onUpdatePriority}
								onUpdateStatus={onUpdateStatus}
								onUpdatePhase={onUpdatePhase}
								onUpdateAssignees={onUpdateAssignees}
								onUpdateLabels={onUpdateLabels}
								onUpdateDueDate={onUpdateDueDate}
								phases={phases}
								availableLabels={availableLabels}
								availableMembers={availableMembers}
								isSelected={selectedTasks.has(task.id)}
								onSelect={onTaskSelect}
							/>
						))}
					</SortableContext>
					<button
						className={styles.addTask}
						onClick={() => setShowAddTask(true)}
					>
						<PlusFilled width="13" height="13" />
					</button>
				</div>
			</div>
			<AddTaskPopup
				isOpen={showAddTask}
				onClose={() => setShowAddTask(!showAddTask)}
				projectId={projectId}
				defaultStatus={column.title as TaskStatus}
			/>
		</>
	);
};

export default Column;
