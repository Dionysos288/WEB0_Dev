import ProjectHeader from '@/components/pages/project/overview/ProjectHeader';
import ProjectMiddleLeft from '@/components/pages/project/overview/ProjectMiddleLeft';
import type { Metadata } from 'next';
import styles from './page.module.scss';
import Spacing from '@/components/general/Spacing';
import ProjectMiddleRight from '@/components/pages/project/overview/ProjectMiddleRight';
import Timeline from '@/components/pages/project/components/Timeline';
import TopMenu from '@/components/general/TopMenu';
import prisma from '@/lib/db';
import { getUser } from '@/actions/AccountActions';

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
	const { project } = await params;
	const { data: session } = await getUser();
	const organizationSlug = session?.session.organizationSlug;
	const projectData = await prisma.project.findUnique({
		where: {
			id: project,
		},
		include: {
			tasks: true,
			phases: true,
			files: true,
		},
	});
	if (projectData) {
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
						`${organizationSlug}/projects/${project}`,
						`${organizationSlug}/projects/${project}/tasks`,
						`${organizationSlug}/projects/${project}/client-portal`,
						`${organizationSlug}/projects/${project}/files`,
						`${organizationSlug}/projects/${project}/library`,
						`${organizationSlug}/projects/${project}/settings`,
					]}
					AddItem="Add Task"
					foundLink="overview"
				/>
				<ProjectHeader project={projectData} />
				<Spacing space={28} />
				<div className={styles.middlePart}>
					<ProjectMiddleLeft />
					<ProjectMiddleRight project={projectData} />
				</div>
				<Spacing space={28} />
				<Timeline project={projectData} />
			</>
		);
	}
};

export default page;
