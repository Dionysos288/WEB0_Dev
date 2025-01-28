import LibraryPage from '@/components/pages/library/LibraryPage';
import prisma from '@/lib/db';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Library',
	description: '',
};
const page = async () => {
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
					favorite: true,
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
			'library/',
			...libraryTypes.map((item) => `library/category/${item.slug}`),
			'library/favorites',
		];

		return (
			<>
				<LibraryPage
					favorite={true}
					menuItems={menuItems}
					menuLinks={menuLinks}
					libraryData={libraryData}
				/>
			</>
		);
	}
};

export default page;
