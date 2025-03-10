// import FilterBar from '@/components/general/filterBar/FilterBar';
import Spacing from '@/components/general/Spacing';
import { getUser } from '@/actions/AccountActions';
import ClientProjectHeader from '@/components/pages/project/client-portal/ClientProjectHeader';
import Phases from '@/components/pages/project/client-portal/Phases';
import Files from '@/components/pages/project/client-portal/Files';
import TopMenu from '@/components/general/TopMenu';
import prisma from '@/lib/db';
import Timeline from '@/components/pages/project/components/Timeline';
import { Metadata } from 'next';

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
	const { data: session } = await getUser();
	const organizationSlug = session?.session.organizationSlug;
	const project = await prisma.project.findUnique({
		where: {
			id: ParamsWaited.project,
		},
		include: {
			tasks: true,
			files: true,
			phases: true,
		},
	});
	if (project) {
		return (
			<>
				<TopMenu
					menuItems={[
						'Overview',
						'Tasks',
						'Client Portal',
						'Files',
						'Library',
						'Settings',
					]}
					menuLinks={[
						`${organizationSlug}/projects/${project.id}`,
						`${organizationSlug}/projects/${project.id}/tasks`,
						`${organizationSlug}/projects/${project.id}/client-portal`,
						`${organizationSlug}/projects/${project.id}/files`,
						`${organizationSlug}/projects/${project.id}/library`,
						`${organizationSlug}/projects/${project.id}/settings`,
					]}
					AddItem="Add Task"
					foundLink="client-portal"
				/>
				<ClientProjectHeader project={project} />
				<Spacing space={28} />
				<Phases phases={project.phases} />
				<Spacing space={28} />
				<Files files={project.files} />
				<Spacing space={28} />

				<Timeline project={project} />
			</>
		);
	}
};

export default page;
