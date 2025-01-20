import { Clients, columnsData } from '@/Data/Clients';
import TopMenu from '@/components/General/TopMenu';

import ClientGallery from '@/components/pages/clients/leads/ClientGallery';

export default function LibraryPage() {
	return (
		<>
			<TopMenu
				mainLink="clients"
				menuItems={['Overview', 'Leads']}
				AddItem="Add User"
				foundLink="leads"
			/>
			<ClientGallery TasksData={Clients} columnsData={columnsData} />
		</>
	);
}
