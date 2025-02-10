import type { Metadata } from 'next';

import Spacing from '@/components/General/Spacing';
import TopMenu from '@/components/general/TopMenu';
import prisma from '@/lib/db';
import LibraryPage from '@/components/pages/library/LibraryPage';
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
	const WaitedProp = await params;
	const { data: session } = await getUser();
	const organizationSlug = session?.session.organizationSlug;
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
					foundLink="library"
				/>

				<Spacing space={28} />

				<LibraryPage
					projectPage={true}
					libraryData={libraryData}
					slug={organizationSlug}
				/>
			</>
		);
	}
};

export default page;
