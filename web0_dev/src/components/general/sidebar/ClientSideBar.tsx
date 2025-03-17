'use client';

import { Session } from '@/lib/auth';
import SideBar from '../header/SideBar';

interface ClientSideBarProps {
	libraryItems: { slug: string }[];
	session: Session;
}

export default function ClientSideBar({
	libraryItems,
	session,
}: ClientSideBarProps) {
	return <SideBar libraryItems={libraryItems} session={session} />;
}
