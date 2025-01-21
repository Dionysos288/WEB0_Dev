import ProjectHeader from '@/components/pages/Project/overview/ProjectHeader';
import ProjectMiddleLeft from '@/components/pages/Project/overview/ProjectMiddleLeft';
import type { Metadata } from 'next';
import styles from './page.module.scss';
import Spacing from '@/components/General/Spacing';
import ProjectMiddleRight from '@/components/pages/Project/overview/ProjectMiddleRight';
import Timeline from '@/components/pages/Project/components/Timeline';
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
	const projectData = await prisma.project.findUnique({
		where: {
			id: params.project,
		},
		include: {
			tasks: true,
			phases: true,
			Files: true,
		},
	});
	if (projectData) {
		const plainProjectData = {
			...projectData,
			budget: projectData.budget.toNumber(),
			Files: projectData.Files.map((file) => ({
				...file,
				size: file.size.toNumber(),
			})),
		};
		return (
			<>
				<TopMenu
					mainLink={`projects/${plainProjectData.id}`}
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
				<ProjectHeader project={plainProjectData} />
				<Spacing space={28} />
				<div className={styles.middlePart}>
					<ProjectMiddleLeft />
					<ProjectMiddleRight project={plainProjectData} />
				</div>
				<Spacing space={28} />
				<Timeline project={plainProjectData} />
			</>
		);
	}
};

export default page;
