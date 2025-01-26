import type { Metadata } from 'next';

import Spacing from '@/components/General/Spacing';
import Timeline from '@/components/pages/Project/components/Timeline';
import ClientProjectHeader from '@/components/pages/Project/client-portal/ClientProjectHeader';
import Phases from '@/components/pages/Project/client-portal/Phases';
import Files from '@/components/pages/Project/client-portal/Files';
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
	const ParamsWaited = await params;

	const project = await prisma.project.findUnique({
		where: {
			id: ParamsWaited.project,
		},
		include: {
			tasks: true,
			Files: true,
			phases: true,
		},
	});
	if (project) {
		const plainProjectData = {
			...project,
			budget: project.budget.toNumber(),
			Files: project.Files.map((file) => ({
				...file,
				size: file.size.toNumber(),
			})),
		};
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
					foundLink="client-portal"
				/>
				<ClientProjectHeader project={plainProjectData} />
				<Spacing space={28} />
				<Phases phases={plainProjectData.phases} />
				<Spacing space={28} />
				<Files files={plainProjectData.Files} />
				<Spacing space={28} />

				<Timeline project={plainProjectData} />
			</>
		);
	}
};

export default page;
