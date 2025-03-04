'use server';

import prisma from '@/lib/db';

export const getPhases = async (projectId: string) => {
	try {
		const phases = await prisma.phase.findMany({
			where: {
				projectId,
			},
			select: {
				id: true,
				title: true,
			},
			orderBy: {
				createdAt: 'asc',
			},
		});

		return {
			data: phases.map((phase) => ({
				...phase,
				name: phase.title, // Map title to name for consistency
			})),
			error: null,
		};
	} catch (error) {
		console.error(
			'Error fetching phases - Stack trace:',
			error instanceof Error ? error.stack : 'Unknown error'
		);
		return { data: null, error: 'Failed to fetch phases' };
	}
};
