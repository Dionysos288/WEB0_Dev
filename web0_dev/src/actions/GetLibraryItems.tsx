'use server';

import prisma from '@/lib/db';

export async function updateDataFiltered({
	selectedCategories,
	id,
}: {
	selectedCategories: string[];
	id: string;
}) {
	try {
		if (!selectedCategories.length) {
			const data = await prisma.library.findMany({
				where: {
					libraryTypeId: id,
				},
			});
			return {
				data,
			};
		} else {
			const data = await prisma.library.findMany({
				where: {
					libraryTypeId: id,
					Category: {
						name: { in: selectedCategories },
					},
				},
			});

			return {
				data,
			};
		}
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			data: [],
			error: 'An error occurred while fetching data.',
		};
	}
}
