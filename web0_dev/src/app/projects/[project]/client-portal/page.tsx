import projects from '@/Data/Projects';
import type { Metadata } from 'next';

import Spacing from '@/components/General/Spacing';
import Timeline from '@/components/pages/Project/components/Timeline';
import ClientProjectHeader from '@/components/pages/Project/client-portal/ClientProjectHeader';
import Phases from '@/components/pages/Project/client-portal/Phases';
import { phases } from '@/Data/phases';
import Files from '@/components/pages/Project/client-portal/Files';
import { projectFiles } from '@/Data/ProjectFiles';
import TopMenu from '@/components/General/TopMenu';
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
	const project = projects.find((project) => project.id === params.project);
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
					foundLink="client-portal"
				/>
				<ClientProjectHeader project={project} />
				<Spacing space={28} />
				<Phases phases={phases} />
				<Spacing space={28} />
				<Files files={projectFiles} />
				<Spacing space={28} />

				<Timeline />
			</>
		);
	}
};

export default page;
