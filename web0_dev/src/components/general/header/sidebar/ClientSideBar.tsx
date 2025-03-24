'use client';

import { Session } from '@/lib/auth';
import SideBar from './SideBar';

interface FavoriteItem {
	id: string;
	title: string;
	pathname: string;
	type: 'project' | 'task' | 'note' | 'library' | 'files' | 'phase';
}

interface ClientSideBarProps {
	libraryItems: { slug: string }[];
	session: Session;
	favorites?: FavoriteItem[];
}

const ClientSideBar = ({
	libraryItems,
	session,
	favorites = [],
}: ClientSideBarProps) => {
	return (
		<SideBar
			libraryItems={libraryItems}
			session={session}
			favorites={favorites}
		/>
	);
};

export default ClientSideBar;
