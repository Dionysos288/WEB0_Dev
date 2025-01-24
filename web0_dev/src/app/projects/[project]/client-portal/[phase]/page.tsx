import type { Metadata } from 'next';

import Spacing from '@/components/General/Spacing';
import ClientProjectHeader from '@/components/pages/Project/client-portal/ClientProjectHeader';
import Files from '@/components/pages/Project/client-portal/Files';
import FilterBar from '@/components/General/FilterBar';

import EditHeader from '@/components/General/EditHeader';
import prisma from '@/lib/db';
import ServerTasksGallery from '@/components/Server/ServerTasksGallery';
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
const page = async ({ params }: { params: { phase: string } }) => {
	const { phase } = await params;
	const phaseData = await prisma.phase.findUnique({
		where: {
			id: phase,
		},
		include: {
			files: true,
			tasks: true,
		},
	});
	if (phaseData) {
		const plainPhases = {
			...phaseData,
			files: phaseData.files.map((file) => ({
				...file,
				size: file.size.toNumber(),
			})),
		};
		return (
			<>
				<EditHeader image={false} admin={true} />
				<Spacing space={28} />

				<ClientProjectHeader
					phase={plainPhases}
					revisions={plainPhases.revisions}
				/>
				<Spacing space={28} />

				<Files files={plainPhases.files} />
				<Spacing space={28} />
				<FilterBar title="Tasks" search={false} views={true} />
				<Spacing space={28} />
				<ServerTasksGallery phase={phase} />
			</>
		);
	}
};

export default page;
