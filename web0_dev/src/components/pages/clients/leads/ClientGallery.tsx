'use client';
import styles from './ClientGallery.module.scss';
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
import { Client } from '@prisma/client';
import { ClientColumnType } from '@/components/types/types';

const ClientGallery = ({ TasksData }: { TasksData: Client[] }) => {
	const columnsData: ClientColumnType[] = [
		{
			id: 1,
			title: 'Leads',
			tasks: TasksData.filter((task) => task.status === 'Leads'),
		},
		{
			id: 2,
			title: 'Contacted',
			tasks: TasksData.filter((task) => task.status === 'Contacted'),
		},
		{
			id: 3,
			title: 'Opportunity',
			tasks: TasksData.filter((task) => task.status === 'Opportunity'),
		},
		{
			id: 4,
			title: 'Client',
			tasks: TasksData.filter((task) => task.status === 'Client'),
		},
	];
	const [tasks, setTasks] = useState<Client[]>(TasksData);
	const [colums, setColumns] = useState<ClientColumnType[]>(columnsData);
	const [activeTask, setActiveTask] = useState<Client | null>(null);
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
					<DragOverlay>{activeTask && <Task task={activeTask} />}</DragOverlay>,
					document.body
				)}
			</DndContext>
		</div>
	);
};

export default ClientGallery;
