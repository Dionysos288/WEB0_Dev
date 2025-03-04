import type { Metadata } from 'next';

import Spacing from '@/components/general/Spacing';
import ClientProjectHeader from '@/components/pages/project/client-portal/ClientProjectHeader';
import Files from '@/components/pages/project/client-portal/Files';
// import FilterBar from '@/components/general/filterBar/FilterBar';

import EditHeader from '@/components/general/EditHeader';
import prisma from '@/lib/db';
import ClientTasksPage from '@/components/pages/project/tasks/ClientTasksPage';
import { getUser } from '@/actions/AccountActions';
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
	const { data: session } = await getUser();
	const organizationSlug = session?.session.organizationSlug;
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
		return (
			<>
				<EditHeader image={false} admin={true} />
				<Spacing space={28} />

				<ClientProjectHeader
					phase={phaseData}
					revisions={phaseData.revisions}
				/>
				<Spacing space={28} />

				<Files files={phaseData.files} />
				<Spacing space={28} />
				<ClientTasksPage
					tasksData={phaseData.tasks}
					orgUrl={organizationSlug}
					projectId={phaseData.projectId}
				/>
			</>
		);
	}
};

export default page;
