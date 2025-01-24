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
import TaskComponent from './Task';
import { Task } from '@prisma/client';
import { TaskColumnType } from '@/components/types/types';

const TaskGallery = ({ TasksData }: { TasksData: Task[] }) => {
	const columnsData: TaskColumnType[] = [
		{
			id: 1,
			title: 'Backlog',
			tasks: TasksData.filter((task) => task.status === 'Backlog'),
		},
		{
			id: 2,
			title: 'In_Progress',
			tasks: TasksData.filter((task) => task.status === 'In_Progress'),
		},
		{
			id: 3,
			title: 'Completed',
			tasks: TasksData.filter((task) => task.status === 'Completed'),
		},
	];
	const [tasks, setTasks] = useState<Task[]>(TasksData);
	const [colums, setColumns] = useState<TaskColumnType[]>(columnsData);
	const [activeTask, setActiveTask] = useState<Task | null>(null);
	useEffect(() => {
		setColumns((columns) => {
			return columns.map((column) => {
				return {
					...column,
					tasks: tasks.filter((task) => task.status === column.title),
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
				tasks[activeIndex].status = tasks[overIndex].status;
				return arrayMove(tasks, activeIndex, overIndex);
			});
		}
		const isOverColumn = over.data.current?.type === 'column';
		const overColumnTitle = over?.data.current?.title;

		if (isActiveTask && isOverColumn) {
			setTasks((task) => {
				const activeIndex = task.findIndex((t) => t.id === activeId);
				tasks[activeIndex].status = overColumnTitle;
				return arrayMove(tasks, activeIndex, Number(overId));
			});
		}
	}

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
					<DragOverlay>
						{activeTask && <TaskComponent task={activeTask} />}
					</DragOverlay>,
					document.body
				)}
			</DndContext>
		</div>
	);
};

export default TaskGallery;
