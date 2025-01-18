import styles from './Column.module.scss';
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Task from './Task';
import React, { useMemo } from 'react';
import Spacing from '@/components/General/Spacing';
import { ColumnType } from './Types';
import { PlusSpecial } from '@/svgs';

const Column = ({ column }: { column: ColumnType }) => {
	const { title, tasks } = column;
	const allTasks = tasks.length;
	const tasksId = useMemo(() => {
		return tasks.map((task) => task.id);
	}, [tasks]);

	const { attributes, listeners, setNodeRef } = useSortable({
		id: column.id,
		data: { type: 'column', column },
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
			{title === 'In Progress' && (
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
						<Task key={task.id} task={task} />
					))}
				</SortableContext>
				<button className={styles.addTask}>
					<PlusSpecial fill={'var(--main)'} opacity={'0.8'} />
					<span>Add Task</span>
				</button>
			</div>
		</div>
	);
};

export default Column;
