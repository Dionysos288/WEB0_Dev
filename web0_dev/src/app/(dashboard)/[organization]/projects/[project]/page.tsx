import Spacing from '@/components/general/Spacing';
import Timeline from '@/components/pages/project/components/Timeline';
import ProjectHeader from '@/components/pages/project/overview/ProjectHeader';
import ProjectMiddleLeft from '@/components/pages/project/overview/ProjectMiddleLeft';
import ProjectMiddleRight from '@/components/pages/project/overview/ProjectMiddleRight';
import styles from './page.module.scss';
import prisma from '@/lib/db';
import TopMenu from '@/components/general/TopMenu';
import { getUser } from '@/actions/AccountActions';

export default async function projectPage({
	params,
}: {
	params: { project: string };
}) {
	const param = await params;
	const { data: session } = await getUser();
	const organizationSlug = session?.session.organizationSlug;
	const project = await prisma.project.findUnique({
		where: {
			id: param.project,
		},
		include: {
			phases: true,
			tasks: true,
			files: true,
		},
	});

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
					`${organizationSlug}/projects/${project?.id}`,
					`${organizationSlug}/projects/${project?.id}/tasks`,
					`${organizationSlug}/projects/${project?.id}/client-portal`,
					`${organizationSlug}/projects/${project?.id}/files`,
					`${organizationSlug}/projects/${project?.id}/library`,
					`${organizationSlug}/projects/${project?.id}/settings`,
				]}
				AddItem="Add Task"
				foundLink="tasks"
			/>
			<ProjectHeader project={project} />
			<Spacing space={28} />
			<div className={styles.projectWrapper}>
				<ProjectMiddleLeft />
				<ProjectMiddleRight project={project} />
			</div>
			<Spacing space={28} />

			<Timeline project={project} />
		</>
	);
}
