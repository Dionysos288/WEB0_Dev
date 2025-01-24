import type { Metadata } from 'next';

import TaskGallery from '@/components/pages/Project/tasks/TaskGallery';
import FilterBar from '@/components/General/FilterBar';
import Spacing from '@/components/General/Spacing';
import TopMenu from '@/components/General/TopMenu';
import prisma from '@/lib/db';
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
	const project = await prisma.project.findUnique({
		where: {
			id: params.project,
		},
		include: {
			tasks: true,
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
				<FilterBar views={true} search={false} />
				<Spacing space={28} />
				<TaskGallery TasksData={project.tasks} />
			</>
		);
	}
};

export default page;
