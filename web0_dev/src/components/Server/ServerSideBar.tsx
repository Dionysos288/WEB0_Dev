import prisma from '@/lib/db';
import SideBar from '../general/header/SideBar';
import { getUser } from '@/actions/AccountActions';

export default async function ServerSideBar() {
	const libraryItems = await prisma.libraryType.findMany({
		select: { slug: true },
	});
	const { data: session } = await getUser()
	console.log(session)
	return <SideBar libraryItems={libraryItems} session={session} />;
}
