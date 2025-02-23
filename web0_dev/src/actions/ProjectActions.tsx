'use server';

import prisma from '@/lib/db';

export const getProjectsAndPhases = async (organizationId: string) => {
	try {
		const projects = await prisma.project.findMany({
			where: {
				organizationId,
			},
			select: {
				id: true,
				title: true,
				phases: {
					select: {
						id: true,
						title: true,
					},
					orderBy: {
						createdAt: 'asc',
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return {
			data: {
				projects: projects.map((project) => ({
					id: project.id,
					title: project.title,
					name: project.title,
					phases: project.phases.map((phase) => ({
						id: phase.id,
						title: phase.title,
						name: phase.title,
					})),
				})),
			},
			error: null,
		};
	} catch (error) {
		console.error(
			'Error fetching projects - Stack trace:',
			error instanceof Error ? error.stack : 'Unknown error'
		);
		return { data: null, error: 'Failed to fetch projects' };
	}
};
