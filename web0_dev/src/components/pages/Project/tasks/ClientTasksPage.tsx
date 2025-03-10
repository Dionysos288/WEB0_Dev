'use client';

import FilterBar from '@/components/general/filterBar/FilterBar';
import Spacing from '@/components/general/Spacing';
import {
	SortOptions,
	ExtendedLibrary,
	fileType,
} from '@/components/types/types';
import { useState, useEffect } from 'react';
import TaskGallery from './TaskGallery';
import {
	Phase,
	Task,
	TimeLog,
	Comment,
	Label,
	Member,
	projectPriority,
	TaskStatus,
} from '@prisma/client';
import { updateTaskPriority, updateTask } from '@/actions/TaskActions';

type ExtendedTask = Task & {
	phase?: Phase;
	comments?: Comment[];
	timeLogs?: TimeLog[];
	labels?: Label[];
	assignees?: Member[];
};

const ClientTasksPage = ({
	tasksData,
	orgUrl,
	projectId,
	phases,
	availableLabels,
	availableMembers,
}: {
	tasksData: ExtendedTask[];
	orgUrl: string;
	projectId: string;
	phases: Phase[];
	availableLabels: Label[];
	availableMembers: Member[];
}) => {
	const [tasks, setTasks] = useState<ExtendedTask[]>(tasksData);
	const [options] = useState<string[]>([]);
	const [query, setQuery] = useState('');
	const [sortType, setSortType] = useState<[SortOptions, boolean]>([
		'date',
		false,
	]);

	useEffect(() => {
		setTasks(tasksData);
	}, [tasksData]);

	const handleUpdatePriority = async (
		taskId: string,
		priority: projectPriority
	) => {
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === taskId ? { ...task, priority } : task
			)
		);

		const result = await updateTaskPriority(
			taskId,
			priority,
			orgUrl,
			projectId
		);

		if (!result.success) {
			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === taskId ? { ...task, priority: task.priority } : task
				)
			);
		}
	};

	const handleUpdateStatus = async (taskId: string, status: TaskStatus) => {
		const task = tasks.find((t) => t.id === taskId);
		if (!task) return;

		setTasks((prevTasks) =>
			prevTasks.map((t) => (t.id === taskId ? { ...t, status } : t))
		);

		const result = await updateTask(
			taskId,
			{ status },
			orgUrl,
			task.organizationId || '',
			projectId
		);

		if (!result.data) {
			setTasks((prevTasks) =>
				prevTasks.map((t) =>
					t.id === taskId ? { ...t, status: task.status } : t
				)
			);
		}
	};

	const handleUpdatePhase = async (taskId: string, phaseId: string | null) => {
		const task = tasks.find((t) => t.id === taskId);
		if (!task) return;

		setTasks((prevTasks) =>
			prevTasks.map((t) =>
				t.id === taskId
					? {
							...t,
							phaseId,
							Phase: phaseId
								? t.phase?.id === phaseId
									? t.phase
									: undefined
								: undefined,
					  }
					: t
			)
		);

		const result = await updateTask(
			taskId,
			{ phaseId },
			orgUrl,
			task.organizationId || '',
			projectId
		);

		if (!result.data) {
			setTasks((prevTasks) =>
				prevTasks.map((t) =>
					t.id === taskId
						? { ...t, phaseId: task.phaseId, Phase: task.phase }
						: t
				)
			);
		}
	};

	const handleUpdateAssignees = async (
		taskId: string,
		assigneeIds: string[]
	) => {
		const task = tasks.find((t) => t.id === taskId);
		if (!task) return;

		setTasks((prevTasks) =>
			prevTasks.map((t) =>
				t.id === taskId
					? {
							...t,
							assignees: assigneeIds.map((id) => ({
								id,

								organizationId: task.organizationId || '',
								userId: '',
								role: '',
								createdAt: new Date(),
							})),
					  }
					: t
			)
		);

		const result = await updateTask(
			taskId,
			{
				assignees: {
					set: assigneeIds.map((id) => ({ id })),
				},
			} as Partial<Task>,
			orgUrl,
			task.organizationId || '',
			projectId
		);

		if (!result.data) {
			setTasks((prevTasks) =>
				prevTasks.map((t) =>
					t.id === taskId ? { ...t, assignees: task.assignees } : t
				)
			);
		}
	};

	const handleUpdateLabels = async (taskId: string, labelIds: string[]) => {
		const task = tasks.find((t) => t.id === taskId);
		if (!task) return;

		setTasks((prevTasks) =>
			prevTasks.map((t) =>
				t.id === taskId
					? {
							...t,
							labels: labelIds.map((id) => ({
								id,
								name: '',
								color: '',
								organizationId: task.organizationId || '',
								createdAt: new Date(),
								updatedAt: new Date(),
							})),
					  }
					: t
			)
		);

		const result = await updateTask(
			taskId,
			{
				labels: {
					set: labelIds.map((id) => ({ id })),
				},
			} as Partial<Task>,
			orgUrl,
			task.organizationId || '',
			projectId
		);

		if (!result.data) {
			setTasks((prevTasks) =>
				prevTasks.map((t) =>
					t.id === taskId ? { ...t, labels: task.labels } : t
				)
			);
		}
	};

	const handleUpdateDueDate = async (taskId: string, dueDate: Date | null) => {
		const task = tasks.find((t) => t.id === taskId);
		if (!task) return;

		setTasks((prevTasks) =>
			prevTasks.map((t) => (t.id === taskId ? { ...t, dueDate } : t))
		);

		const result = await updateTask(
			taskId,
			{ dueDate },
			orgUrl,
			task.organizationId || '',
			projectId
		);

		if (!result.data) {
			setTasks((prevTasks) =>
				prevTasks.map((t) =>
					t.id === taskId ? { ...t, dueDate: task.dueDate } : t
				)
			);
		}
	};

	return (
		<>
			<FilterBar
				options={['date', 'title', 'priority']}
				data={tasks}
				setData={
					setTasks as unknown as React.Dispatch<
						React.SetStateAction<
							ExtendedLibrary[] | fileType[] | (Task & { phase?: Phase })[]
						>
					>
				}
				model={'task'}
				id={tasksData[0]?.projectId || projectId}
				setQuery={setQuery}
				query={query}
				filters={options}
				sortType={sortType}
				setSortType={setSortType}
			/>

			<Spacing space={28} />
			<TaskGallery
				tasks={tasks}
				setTasks={setTasks}
				orgUrl={orgUrl}
				projectId={projectId}
				onUpdatePriority={handleUpdatePriority}
				onUpdateStatus={handleUpdateStatus}
				onUpdatePhase={handleUpdatePhase}
				onUpdateAssignees={handleUpdateAssignees}
				onUpdateLabels={handleUpdateLabels}
				onUpdateDueDate={handleUpdateDueDate}
				phases={phases}
				availableLabels={availableLabels}
				availableMembers={availableMembers}
			/>
		</>
	);
};

export default ClientTasksPage;
