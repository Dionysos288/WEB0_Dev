'use server';

import prisma from '@/lib/db';

export const getLabels = async (organizationId: string) => {
	try {
		const labels = await prisma.label.findMany({
			where: {
				organizationId,
			},
			select: {
				id: true,
				name: true,
				color: true,
			},
			orderBy: {
				createdAt: 'asc',
			},
		});

		return {
			data: labels.map((label) => ({
				id: label.id,
				title: label.name,
				color: label.color,
			})),
			error: null,
		};
	} catch (error) {
		console.error(
			'Error fetching labels - Stack trace:',
			error instanceof Error ? error.stack : 'Unknown error'
		);
		return { data: null, error: 'Failed to fetch labels' };
	}
};
