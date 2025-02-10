import LibraryPage from '@/components/pages/library/LibraryPage';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import { getUser } from '@/actions/AccountActions';

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
	const { data: session } = await getUser();
	const organizationSlug = session?.session.organizationSlug;
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
			`${organizationSlug}/library`,
			...libraryTypes.map(
				(item) => `${organizationSlug}/library/category/${item.slug}`
			),
			`${organizationSlug}/library/favorites`,
		];

		return (
			<>
				<LibraryPage
					menuItems={menuItems}
					menuLinks={menuLinks}
					libraryData={libraryData}
					slug={organizationSlug}
				/>
			</>
		);
	}
};

export default page;
