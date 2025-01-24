import prisma from '@/lib/db';
import SideBar from '../General/header/SideBar';

export default async function ServerSideBar() {
	const libraryItems = await prisma.libraryType.findMany({
		select: { slug: true },
	});

	return <SideBar libraryItems={libraryItems} />;
}
