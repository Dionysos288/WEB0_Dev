import prisma from '@/lib/db';
import LibraryPage from '@/components/pages/library/LibraryPage';
import { getUser } from '@/actions/AccountActions';

export default async function Page() {
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
					Category: true,
				},

				orderBy: {
					createdAt: 'desc',
				},
				where: {
					organizationId,
				},
			},
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
					homePage={true}
					menuItems={menuItems}
					menuLinks={menuLinks}
					libraryData={libraryData}
					slug={organizationSlug}
					orgId={organizationId}
				/>
			</>
		);
	}
}
