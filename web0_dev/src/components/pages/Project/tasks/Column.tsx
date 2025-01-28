import styles from './Column.module.scss';
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskComponent from './Task';
import React, { useMemo } from 'react';
import Spacing from '@/components/General/Spacing';
import { TaskColumnType } from '@/components/types/types';
import PlusFilled from '@/svgs/Plus-Filled';

const Column = ({ column }: { column: TaskColumnType }) => {
	const { title, tasks } = column;
	const allTasks = tasks.length;
	const tasksId = useMemo(() => {
		return tasks.map((task) => task.id);
	}, [tasks]);

	const { attributes, listeners, setNodeRef } = useSortable({
		id: column.id,
		data: { type: 'column', title: title },
		disabled: true,
	});

	return (
		<div ref={setNodeRef} {...attributes} {...listeners}>
			<div className={styles.header}>
				<h2 className={styles.title}>{title}</h2>
				<p>{allTasks}</p>
			</div>
			<Spacing space={8} />
			{title === 'Backlog' && (
				<div
					className={styles.line}
					style={{ backgroundColor: 'var(--rejected)' }}
				/>
			)}
			{title === 'In_Progress' && (
				<div
					className={styles.line}
					style={{ backgroundColor: 'var(--progress)' }}
				/>
			)}
			{title === 'Completed' && (
				<div
					className={styles.line}
					style={{ backgroundColor: 'var(--completed)' }}
				/>
			)}
			<Spacing space={16} />
			<div className={styles.column}>
				<SortableContext items={tasksId} strategy={verticalListSortingStrategy}>
					{tasks.map((task) => (
						<TaskComponent key={task.id} task={task} />
					))}
				</SortableContext>
				<button className={styles.addTask}>
					<PlusFilled fill={'var(--main-80)'} width="16" height="16" />
					<span>Add User</span>
				</button>
			</div>
		</div>
	);
};

export default Column;
