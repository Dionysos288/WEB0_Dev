import type { Metadata } from 'next';

import Spacing from '@/components/General/Spacing';
import ClientProjectHeader from '@/components/project/client-portal/ClientProjectHeader';
import { phases } from '@/Data/phases';
import Files from '@/components/project/client-portal/Files';
import { projectFiles } from '@/Data/ProjectFiles';
import FilterBar from '@/components/General/FilterBar';
import TaskGallery from '@/components/project/tasks/TaskGallery';
export async function generateMetadata({
	params,
}: {
	params: { project: string; phase: string };
}): Promise<Metadata> {
	return {
		title: `${params} | Web0`,
		description: `View ${params} on Web0`,
	};
}
const page = ({ params }: { params: { project: string; phase: string } }) => {
	const phase = phases.find((phase) => phase.id === Number(params.phase));
	if (phase) {
		return (
			<>
				<ClientProjectHeader phase={phase} revisions={3} />
				<Spacing space={28} />

				<Files files={projectFiles} />
				<Spacing space={28} />
				<FilterBar title="Tasks" search={false} views={true} />
				<Spacing space={28} />

				<TaskGallery />
			</>
		);
	}
};

export default page;
