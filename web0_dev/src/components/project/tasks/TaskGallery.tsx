'use client';
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
} from '@dnd-kit/core';

import { useEffect, useState } from 'react';
import Column from './Column';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import Task from './Task';
import { ColumnType, TaskType } from './Types';
const TasksData: TaskType[] = [
	{ id: 1, columnId: 123, title: 'ik' },
	{ id: 2, columnId: 123, title: 'ben' },
	{ id: 3, columnId: 123, title: 'dion' },
	{ id: 4, columnId: 234, title: 'ik' },
	{ id: 5, columnId: 234, title: 'ben' },
	{ id: 6, columnId: 234, title: 'dion' },
	{ id: 7, columnId: 345, title: 'ik' },
	{ id: 8, columnId: 345, title: 'ben' },
	{ id: 9, columnId: 345, title: 'dion' },
];

const columnsData: ColumnType[] = [
	{
		id: 123,
		title: 'Backlog',
		tasks: TasksData.filter((task) => task.columnId === 123),
	},
	{
		id: 234,
		title: 'In Progress',
		tasks: TasksData.filter((task) => task.columnId === 234),
	},
	{
		id: 345,
		title: 'Completed',
		tasks: TasksData.filter((task) => task.columnId === 345),
	},
];
const TaskGallery = () => {
	const [tasks, setTasks] = useState<TaskType[]>(TasksData);
	const [colums, setColumns] = useState<ColumnType[]>(columnsData);
	const [activeTask, setActiveTask] = useState<TaskType | null>(null);
	useEffect(() => {
		setColumns((columns) => {
			return columns.map((column) => {
				return {
					...column,
					tasks: tasks.filter((task) => task.columnId === column.id),
				};
			});
		});
	}, [tasks]);

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

	function onDragStart(event: DragOverEvent) {
		if (event.active.data.current?.type === 'task') {
			setActiveTask(event.active.data.current.task);
			return;
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
		if (isActiveTask && isOverTask) {
			setTasks((task) => {
				const activeIndex = task.findIndex((t) => t.id === activeId);
				const overIndex = task.findIndex((t) => t.id === overId);
				tasks[activeIndex].columnId = tasks[overIndex].columnId;
				return arrayMove(tasks, activeIndex, overIndex);
			});
		}
		const isOverColumn = over.data.current?.type === 'column';
		if (isActiveTask && isOverColumn) {
			setTasks((task) => {
				const activeIndex = task.findIndex((t) => t.id === activeId);
				tasks[activeIndex].columnId = Number(overId);
				return arrayMove(tasks, activeIndex, Number(overId));
			});
		}
	}

	console.log(activeTask);
	return (
		<div className={styles.wrapper}>
			<DndContext
				sensors={sensors}
				onDragStart={onDragStart}
				onDragEnd={() => setActiveTask(null)}
				onDragOver={onDragOver}
			>
				<div className={styles.grid}>
					{colums.map((column) => (
						<Column key={column.id} column={column} />
					))}
				</div>
				{createPortal(
					<DragOverlay>{activeTask && <Task task={activeTask} />}</DragOverlay>,
					document.body
				)}
			</DndContext>
		</div>
	);
};

export default TaskGallery;
