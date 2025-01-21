import styles from './Column.module.scss';
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskComponent from './Task';
import React, { useMemo } from 'react';
import Spacing from '@/components/General/Spacing';
import { PlusSpecial } from '@/svgs';
import { Task, TaskColumn } from '@prisma/client';

const Column = ({ column }: { column: TaskColumn & { Tasks?: Task[] } }) => {
	const { title, Tasks } = column;

	const allTasks = Tasks?.length;
	const tasksId = useMemo(() => {
		if (!Tasks) return [];
		return Tasks.map((task) => task.id);
	}, [Tasks]);

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
				{!Tasks ? (
					<></>
				) : (
					<SortableContext
						items={tasksId}
						strategy={verticalListSortingStrategy}
					>
						{Tasks.map((task) => (
							<TaskComponent key={task.id} task={task} />
						))}
					</SortableContext>
				)}

				<button className={styles.addTask}>
					<PlusSpecial fill={'var(--main)'} opacity={'0.8'} />
					<span>Add Task</span>
				</button>
			</div>
		</div>
	);
};

export default Column;
