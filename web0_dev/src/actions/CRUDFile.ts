'use server';

import { SortOptions } from '@/components/types/types';
import prisma from '@/lib/db';
import { File, Prisma } from '@prisma/client';

const updateFilterFiles = async ({
	id,
	isAscending,
	query,
	type,
}: {
	id: string;
	isAscending: boolean;
	query: string;
	type: SortOptions;
}) => {
	try {
		console.log('id', type);
		const orderBy: Prisma.FileOrderByWithRelationInput =
			type === 'date'
				? { updatedAt: isAscending ? 'asc' : 'desc' }
				: type === 'name'
				? { name: isAscending ? 'asc' : 'desc' }
				: type === 'size'
				? { size: isAscending ? 'asc' : 'desc' }
				: { updatedAt: 'desc' };
		console.log('orderBy', orderBy);
		const where: Prisma.FileWhereInput = {};
		if (id) {
			where.projectId = id;
		}

		if (query) {
			where.name = { contains: query, mode: 'insensitive' };
		}

		const data = (await prisma.file.findMany({
			where,
			orderBy,
		})) as File[];

		return { data: data };
	} catch (error) {
		console.error(error);
		return {
			data: [],
			error: 'An error occurred while fetching data.',
		};
	}
};

export { updateFilterFiles };
