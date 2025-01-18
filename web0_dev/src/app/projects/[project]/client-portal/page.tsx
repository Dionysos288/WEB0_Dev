import projects from '@/Data/Projects';
import type { Metadata } from 'next';

import Spacing from '@/components/General/Spacing';
import Timeline from '@/components/project/components/Timeline';
import ClientProjectHeader from '@/components/project/client-portal/ClientProjectHeader';
import Phases from '@/components/project/client-portal/Phases';
import { phases } from '@/Data/phases';
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
const page = ({ params }: { params: { project: string } }) => {
	const project = projects.find((project) => project.id === params.project);
	if (project) {
		return (
			<>
				<ClientProjectHeader project={project} />
				<Spacing space={28} />
				<Phases phases={phases} />
				<Spacing space={28} />
				<Timeline />
			</>
		);
	}
};

export default page;
