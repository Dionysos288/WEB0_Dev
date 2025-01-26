import type { Metadata } from 'next';

import Spacing from '@/components/General/Spacing';
import TopMenu from '@/components/General/TopMenu';
import prisma from '@/lib/db';
import LibraryPage from '@/components/pages/Library/LibraryPage';
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
	const WaitedProp = await params;
	console.log(WaitedProp);
	const project = await prisma.project.findFirst({
		where: {
			id: WaitedProp.project,
		},
	});

	const libraryData = await prisma.libraryType.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			categories: {
				include: {
					subcategories: {
						include: {
							subcategories: true,
						},
					},
				},
			},
			libraries: {
				include: {
					Category: true,
				},
				where: {
					projectId: WaitedProp.project,
				},

				orderBy: {
					createdAt: 'desc',
				},
			},
		},
	});
	if (project) {
		console.log(libraryData);
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
				<Spacing space={28} />

				<LibraryPage projectPage={true} libraryData={libraryData} />
			</>
		);
	}
};

export default page;
