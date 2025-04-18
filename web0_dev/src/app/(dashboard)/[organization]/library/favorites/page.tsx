import LibraryPage from '@/components/pages/library/LibraryPage';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import { getUser } from '@/actions/AccountActions';
export const metadata: Metadata = {
	title: 'Library',
	description: '',
};

const page = async () => {
	const { data: session } = await getUser();
	const organizationSlug = session?.session.organizationSlug;
	const organizationId = session?.session.activeOrganizationId;

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
				where: {
					organizationId,
				},
			},
			libraries: {
				include: {
					category: true,
				},
				where: {
					favorite: true,
					organizationId,
				},
				orderBy: {
					createdAt: 'desc',
				},
			},
		},
	});
	const projects = await prisma.project.findMany({
		where: {
			organizationId,
		},
	});
	if (libraryData) {
		const libraryTypes = await prisma.libraryType.findMany({
			select: { name: true, slug: true },
		});
		const menuItems = [
			'Overview',
			...libraryTypes.map((item) => item.name),
			'Favorites',
		];
		const menuLinks = [
			`${organizationSlug}/library`,
			...libraryTypes.map(
				(item) => `${organizationSlug}/library/category/${item.slug}`
			),
			`${organizationSlug}/library/favorites`,
		];

		return (
			<>
				<LibraryPage
					favorite={true}
					menuItems={menuItems}
					menuLinks={menuLinks}
					libraryData={libraryData}
					slug={organizationSlug}
					orgId={organizationId}
					projects={projects}
				/>
			</>
		);
	}
};

export default page;
