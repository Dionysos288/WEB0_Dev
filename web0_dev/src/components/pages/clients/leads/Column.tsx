import styles from './Column.module.scss';
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Task from './Task';
import React, { useMemo } from 'react';
import Spacing from '@/components/General/Spacing';
import { PlusSpecial } from '@/svgs';
import { ClientColumnType } from '@/components/types/types';

const Column = ({ column }: { column: ClientColumnType }) => {
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
			{title === 'Leads' && (
				<div
					className={styles.line}
					style={{ backgroundColor: 'var(--leads-90)' }}
				/>
			)}
			{title === 'Contacted' && (
				<div
					className={styles.line}
					style={{ backgroundColor: 'var(--contacted-90)' }}
				/>
			)}
			{title === 'Opportunity' && (
				<div
					className={styles.line}
					style={{ backgroundColor: 'var(--oppurtunity-90)' }}
				/>
			)}
			{title === 'Client' && (
				<div
					className={styles.line}
					style={{ backgroundColor: 'var(--client-90)' }}
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
					<span>Add User</span>
				</button>
			</div>
		</div>
	);
};

export default Column;
