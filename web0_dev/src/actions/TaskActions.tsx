'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { Task, projectPriority } from '@prisma/client';

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

		const taskData = {
			...task,
			project: {
				...task.project,
				budget: task.project.budget.toNumber(),
			},
			Phase: task.Phase
				? {
						...task.Phase,
				  }
				: null,
		};

		return { data: { taskData, activity }, error: null };
	} catch (error) {
		console.error('Error updating task:', error);
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
		console.error('Error adding comment:', error);
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
		console.error('Error fetching comments:', error);
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
		console.error('Error fetching activities:', error);
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
		console.error('Error creating activity:', error);
		return { data: null, error: 'Failed to create activity' };
	}
};
