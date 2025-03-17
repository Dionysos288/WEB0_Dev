'use client';
import { useState } from 'react';
import Layout from './Layout';
import { usePathname } from 'next/navigation';
import { Session } from '@/lib/auth';

interface LayoutClientProps {
	children: React.ReactNode;
	initialLibraryItems: { slug: string }[];
	initialSession: Session;
}

export default function LayoutClient({
	children,
	initialLibraryItems,
	initialSession,
}: LayoutClientProps) {
	const pathname = usePathname();
	const isTaskDetailPage = !!pathname?.match(
		/\/projects\/[^/]+\/tasks\/[^/]+$/
	);

	const [isOpenLeftBar, setIsOpenLeftBar] = useState(true);
	const widthLeftbar = '212px';
	const widthRightbar = '280px';

	const [isOpenRightBarNotifications, setIsOpenRightBarNotifications] =
		useState(false);
	const [isOpenRightBarComments, setIsOpenRightBarComments] =
		useState(isTaskDetailPage);

	return (
		<Layout
			isTaskDetailPage={isTaskDetailPage}
			isOpenLeftBar={isOpenLeftBar}
			setIsOpenLeftBar={setIsOpenLeftBar}
			isOpenRightBarNotifications={isOpenRightBarNotifications}
			setIsOpenRightBarNotifications={setIsOpenRightBarNotifications}
			isOpenRightBarComments={isOpenRightBarComments}
			setIsOpenRightBarComments={setIsOpenRightBarComments}
			widthLeftbar={widthLeftbar}
			widthRightbar={widthRightbar}
			initialLibraryItems={initialLibraryItems}
			initialSession={initialSession}
		>
			{children}
		</Layout>
	);
}
