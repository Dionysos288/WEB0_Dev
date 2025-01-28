import type { Metadata } from 'next';

import TopMenu from '@/components/General/TopMenu';
import prisma from '@/lib/db';
import ClientTasksPage from '@/components/pages/project/tasks/ClientTasksPage';
export async function generateMetadata({
	params,
}: {
	params: { project: string };
}): Promise<Metadata> {
	return {
		title: `${params} | Web0`,
		description: `View ${params} on Web0`,
	};
}
const page = async ({ params }: { params: { project: string } }) => {
	const props = await params;
	const project = await prisma.project.findUnique({
		where: {
			id: props.project,
		},
		select: {
			id: true,
			tasks: {
				orderBy: {
					createdAt: 'desc',
				},
			},
		},
	});

	if (project) {
		return (
			<>
				<TopMenu
					mainLink={`projects/${project.id}`}
					menuItems={[
						'Overview',
						'Tasks',
						'Client Portal',
						'Files',
						'Library',
						'Settings',
					]}
					AddItem="Add Task"
					foundLink="tasks"
				/>
				<ClientTasksPage tasksData={project.tasks} />
			</>
		);
	}
};

export default page;
