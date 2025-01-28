import prisma from '@/lib/db';
import LibraryPage from '@/components/pages/library/LibraryPage';

export default async function Page() {
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

				orderBy: {
					createdAt: 'desc',
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
			'/library',
			...libraryTypes.map((item) => `library/category/${item.slug}`),
			'library/favorites',
		];

		return (
			<>
				<LibraryPage
					homePage={true}
					menuItems={menuItems}
					menuLinks={menuLinks}
					libraryData={libraryData}
				/>
			</>
		);
	}
}
