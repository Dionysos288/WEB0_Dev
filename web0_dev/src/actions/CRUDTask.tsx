'use server';

import { SortOptions } from '@/components/types/types';
import prisma from '@/lib/db';
import { Prisma, Task } from '@prisma/client';

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
		})) as Task[];

		return { data };
	} catch (error) {
		console.error(error);
		return {
			data: [],
			error: 'An error occurred while fetching data.',
		};
	}
};

export { updateFilterTasks };
