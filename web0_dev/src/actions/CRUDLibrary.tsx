'use server';

import { ExtendedLibrary, SortOptions } from '@/components/types/types';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function updateFilterLibrary({
	selectedCategories,
	id,
	isAscending,
	query,
	type,
	favorite,
	organizationId,
}: {
	selectedCategories: string[];
	id?: string;
	isAscending: boolean;
	query: string;
	type: SortOptions;
	favorite: boolean;
	organizationId: string;
}) {
	try {
		const orderBy: Prisma.LibraryOrderByWithRelationInput =
			type === 'date'
				? { createdAt: isAscending ? 'asc' : 'desc' }
				: type === 'title'
				? { title: isAscending ? 'asc' : 'desc' }
				: { createdAt: 'desc' };

		const where: Prisma.LibraryWhereInput = {
			organizationId,
		};

		if (id) {
			where.libraryTypeId = id;
		}

		if (favorite) {
			where.favorite = true;
		}

		if (selectedCategories?.length > 0) {
			where.Category = {
				name: {
					in: selectedCategories,
				},
			};
		}

		if (query) {
			where.title = {
				contains: query,
				mode: 'insensitive',
			};
		}

		const data = await prisma.library.findMany({
			where,
			orderBy,
			include: {
				Category: true,
			},
		});

		if (!data) {
			return { data: [], error: 'No data found' };
		}

		return { data: data as ExtendedLibrary[] };
	} catch (error) {
		console.error('Query error:', error);
		return {
			data: [],
			error: 'An error occurred while fetching data.',
		};
	}
}

const makeFavorite = async (id: string, favorite: boolean) => {
	try {
		await prisma.library.update({
			where: { id },
			data: { favorite: !favorite, updatedAt: undefined },
		});
	} catch (error) {
		console.error(error);
		return {
			data: [],
			error: 'An error occurred while updating data.',
		};
	}

	revalidatePath('/library/favorites');
};

export { updateFilterLibrary, makeFavorite };
