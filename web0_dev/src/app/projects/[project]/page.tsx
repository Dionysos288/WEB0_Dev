import ProjectHeader from '@/components/Projects/project/ProjectHeader';
import ProjectMiddleLeft from '@/components/Projects/project/ProjectMiddleLeft';
import projects from '@/Data/Projects';
import type { Metadata } from 'next';
import styles from './page.module.scss';
import Spacing from '@/components/general/Spacing';
import ProjectMiddleRight from '@/components/Projects/project/ProjectMiddleRight';
import Timeline from '@/components/Projects/project/Timeline';
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
