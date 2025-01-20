import projects from '@/Data/Projects';
import type { Metadata } from 'next';

import FilterBar from '@/components/General/FilterBar';
import Spacing from '@/components/General/Spacing';
import Gallery from '@/components/pages/Library/Gallery';
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
					foundLink="library"
				/>
				<FilterBar views={true} />
				<Spacing space={28} />

				<Gallery />
			</>
		);
	}
};

export default page;
