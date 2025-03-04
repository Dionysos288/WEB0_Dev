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
	const organizationId = session?.session.activeOrganizationId;

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
				where: {
					organizationId,
				},
			},
			libraries: {
				include: {
					category: true,
					projects: true,
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
					projects={projects}
					menuItems={menuItems}
					menuLinks={menuLinks}
					libraryData={libraryData}
					slug={organizationSlug}
					orgId={organizationId}
				/>
			</>
		);
	}
};

export default page;
