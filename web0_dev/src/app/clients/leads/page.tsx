import TopMenu from '@/components/General/TopMenu';

import ServerClientGallery from '@/components/server/ServerClientGallery';

export default function LibraryPage() {
	return (
		<>
			<TopMenu
				mainLink="clients"
				menuItems={['Overview', 'Leads']}
				AddItem="Add User"
				foundLink="leads"
			/>
			<ServerClientGallery />
		</>
	);
}
