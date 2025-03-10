'use server';

import { SortOptions } from '@/components/types/types';
import prisma from '@/lib/db';
import { Phase, Prisma, Task, TaskStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const updateFilterTasks = async ({
	id,
	isAscending,
	phaseId,
	query,
	type,
}: {
	id: string;
	phaseId?: string;
	isAscending: boolean;
	query: string;
	type: SortOptions;
}) => {
	try {
		const orderBy: Prisma.TaskOrderByWithRelationInput =
			type === 'date'
				? { createdAt: isAscending ? 'asc' : 'desc' }
				: type === 'title'
				? { title: isAscending ? 'asc' : 'desc' }
				: type === 'priority'
				? { priority: isAscending ? 'asc' : 'desc' }
				: { createdAt: 'desc' };
		const where: Prisma.TaskWhereInput = {};
		if (id) {
			where.projectId = id;
		}
		if (phaseId) {
			where.phaseId = phaseId;
		}
		if (query) {
			where.title = { contains: query, mode: 'insensitive' };
		}

		const data = (await prisma.task.findMany({
			where,
			orderBy,
			include: {
				Phase: true,
			},
		})) as (Task & { Phase: Phase })[];

		return { data };
	} catch (error) {
		console.error(error);
		return {
			data: [],
			error: 'An error occurred while fetching data.',
		};
	}
};

const updateTaskStatus = async (
	taskId: string,
	status: TaskStatus,
	projectId: string,
	orgUrl: string
) => {
	try {
		const updatedTask = await prisma.task.update({
			where: { id: taskId },
			data: { status },
			include: {
				Phase: true,
			},
		});

		// Revalidate the tasks page for this project
		revalidatePath(`/${orgUrl}/projects/${projectId}/tasks`);

		return { data: updatedTask, error: null };
	} catch (error) {
		console.error('Error updating task status:', error);
		return {
			data: null,
			error: 'Failed to update task status',
		};
	}
};

const deleteTask = async (
	taskId: string,
	projectId: string,
	orgUrl: string
) => {
	try {
		await prisma.task.delete({
			where: { id: taskId },
		});

		revalidatePath(`/${orgUrl}/projects/${projectId}/tasks`);

		return { success: true, error: null };
	} catch (error) {
		console.error('Error deleting task:', error);
		return {
			success: false,
			error: 'Failed to delete task',
		};
	}
};

export { updateFilterTasks, updateTaskStatus, deleteTask };
