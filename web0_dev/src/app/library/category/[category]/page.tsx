import LibraryPage from '@/components/pages/library/LibraryPage';
import prisma from '@/lib/db';
import type { Metadata } from 'next';

export async function generateMetadata({
	params,
}: {
	params: { category: string };
}): Promise<Metadata> {
	return {
		title: `${params} | Web0`,
		description: `View ${params} on Web0`,
	};
}
const page = async ({ params }: { params: { category: string } }) => {
	const { category } = await params;
	const libraryData = await prisma.libraryType.findUnique({
		where: {
			slug: category,
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
			'library/',
			...libraryTypes.map((item) => `library/category/${item.slug}`),
			'library/favorites',
		];

		return (
			<>
				<LibraryPage
					menuItems={menuItems}
					menuLinks={menuLinks}
					libraryData={libraryData}
				/>
			</>
		);
	}
};

export default page;
