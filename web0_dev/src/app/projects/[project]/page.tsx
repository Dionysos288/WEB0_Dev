import ProjectHeader from '@/components/pages/Project/overview/ProjectHeader';
import ProjectMiddleLeft from '@/components/pages/Project/overview/ProjectMiddleLeft';
import projects from '@/Data/Projects';
import type { Metadata } from 'next';
import styles from './page.module.scss';
import Spacing from '@/components/General/Spacing';
import ProjectMiddleRight from '@/components/pages/Project/overview/ProjectMiddleRight';
import Timeline from '@/components/pages/Project/components/Timeline';
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
					foundLink="overview"
				/>
				<ProjectHeader project={project} />
				<Spacing space={28} />
				<div className={styles.middlePart}>
					<ProjectMiddleLeft />
					<ProjectMiddleRight />
				</div>
				<Spacing space={28} />
				<Timeline />
			</>
		);
	}
};

export default page;
