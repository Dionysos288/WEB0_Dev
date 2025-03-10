'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { Task, projectPriority, TaskStatus } from '@prisma/client';

interface CreateTaskData extends Partial<Task> {
	assignees?: string[];
	labels?: string[];
}

export const createTask = async (
	taskData: CreateTaskData,
	organizationSlug: string
) => {
	try {
		if (!taskData.organizationId || !taskData.title) {
			throw new Error('Organization ID and title are required');
		}

		const organization = await prisma.organization.findUnique({
			where: { slug: organizationSlug },
			select: {
				taskCounter: true,
			},
		});

		if (!organization) {
			throw new Error('Organization not found');
		}

		const newTaskCounter = organization.taskCounter + 1;

		await prisma.organization.update({
			where: { slug: organizationSlug },
			data: { taskCounter: newTaskCounter },
		});

		const createData = {
			customId: `${organizationSlug}-${newTaskCounter}`,
			title: taskData.title,
			description: taskData.description || null,
			priority: (taskData.priority || 'noPriority') as projectPriority,
			status: (taskData.status || 'Backlog') as TaskStatus,
			dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
			estimatedTime: taskData.estimatedTime || null,
			content: null,
			organizationId: taskData.organizationId,
			projectId: taskData.projectId,
			phaseId: taskData.phaseId,
			cycleId: taskData.cycleId,
			labels: {
				connect: taskData.labels?.map((id) => ({ id })),
			},
			assignees: {
				connect: taskData.assignees?.map((id) => ({ id })),
			},
		};
		console.log(createData);

		await prisma.task.create({
			data: createData,
			include: {
				Organization: true,
				project: true,
				Phase: true,
				cycle: true,
				labels: true,
				assignees: true,
			},
		});

		// Revalidate paths after initial task creation
		revalidatePath(`/${organizationSlug}/projects/${taskData.projectId}/tasks`);
		revalidatePath(`/${organizationSlug}/projects/${taskData.projectId}`);
		revalidatePath(`/${organizationSlug}/projects`);

		return { data: null, error: null };
	} catch (error) {
		console.error(
			'Error creating task - Stack trace:',
			error instanceof Error ? error.stack : 'Unknown error'
		);
		return { data: null, error: 'Failed to create task' };
	}
};

export const updateTask = async (
	taskId: string,
	data: Partial<Task>,
	orgUrl: string,
	memberId: string,
	organizationId: string
) => {
	try {
		const task = await prisma.task.update({
			where: { id: taskId },
			data,
			include: {
				Phase: true,
				project: true,
			},
		});

		const activityFields = Object.keys(data).filter((field) =>
			['status', 'priority', 'phaseId', 'projectId'].includes(field)
		);

		let activity = null;
		if (activityFields.length > 0) {
			const activityDescription = activityFields
				.map((field) => {
					if (field === 'status') return `Status changed to ${data.status}`;
					if (field === 'priority') {
						return `Priority set to ${(
							data.priority as projectPriority
						).toLowerCase()}`;
					}
					if (field === 'phaseId') return 'Phase updated';
					if (field === 'projectId') return 'Moved to different project';
					return `${field} updated`;
				})
				.join(', ');

			const activityResult = await createActivity({
				type: 'task_updated',
				description: activityDescription,
				taskId,
				actorId: memberId,
				organizationId,
			});
			activity = activityResult.data;
		}

		revalidatePath(`/${orgUrl}/projects/${task.projectId}/tasks/${taskId}`);
		revalidatePath(`/${orgUrl}/projects/${task.projectId}/tasks`);

		return { data: { task, activity }, error: null };
	} catch (error) {
		console.error(
			'Error updating task - Stack trace:',
			error instanceof Error ? error.stack : 'Unknown error'
		);
		return {
			data: null,
			error: 'Failed to update task',
		};
	}
};

export const addComment = async (
	taskId: string,
	content: string,
	memberId: string,
	organizationId: string
) => {
	try {
		const comment = await prisma.comment.create({
			data: {
				content,
				taskId,
				authorId: memberId,
				organizationId,
			},
			include: {
				author: {
					include: {
						user: true,
					},
				},
			},
		});

		return { data: comment, error: null };
	} catch (error) {
		console.error(
			'Error adding comment - Stack trace:',
			error instanceof Error ? error.stack : 'Unknown error'
		);
		return {
			data: null,
			error: 'Failed to add comment',
		};
	}
};

export const getTaskComments = async (taskId: string) => {
	try {
		const comments = await prisma.comment.findMany({
			where: { taskId },
			include: {
				author: {
					include: {
						user: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return { data: comments, error: null };
	} catch (error) {
		console.error(
			'Error fetching comments - Stack trace:',
			error instanceof Error ? error.stack : 'Unknown error'
		);
		return {
			data: null,
			error: 'Failed to fetch comments',
		};
	}
};

export const getTaskActivities = async (taskId: string) => {
	try {
		const activities = await prisma.activity.findMany({
			where: { taskId },
			include: {
				actor: {
					include: {
						user: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return { data: activities, error: null };
	} catch (error) {
		console.error(
			'Error fetching activities - Stack trace:',
			error instanceof Error ? error.stack : 'Unknown error'
		);
		return {
			data: null,
			error: 'Failed to fetch activities',
		};
	}
};

const createActivity = async ({
	type,
	description,
	taskId,
	actorId,
	organizationId,
}: {
	type: string;
	description: string;
	taskId: string;
	actorId: string;
	organizationId: string;
}) => {
	try {
		const activity = await prisma.activity.create({
			data: {
				type,
				description,
				taskId,
				actorId,
				organizationId,
			},
			include: {
				actor: {
					include: {
						user: true,
					},
				},
			},
		});
		return { data: activity, error: null };
	} catch (error) {
		console.error(
			'Error creating activity - Stack trace:',
			error instanceof Error ? error.stack : 'Unknown error'
		);
		return { data: null, error: 'Failed to create activity' };
	}
};

export const updateTaskPriority = async (
	taskId: string,
	priority: projectPriority,
	orgUrl: string,
	projectId: string
) => {
	try {
		const updatedTask = await prisma.task.update({
			where: { id: taskId },
			data: { priority },
		});

		revalidatePath(`/${orgUrl}/projects/${projectId}/tasks`);
		return { success: true, data: updatedTask };
	} catch (error) {
		console.error('Error updating task priority:', error);
		return { success: false, error: 'Failed to update task priority' };
	}
};
