import { Clients, columnsData } from '@/Data/Clients';

import ClientGallery from '@/components/pages/clients/leads/ClientGallery';

export default function LibraryPage() {
	return (
		<>
			<ClientGallery TasksData={Clients} columnsData={columnsData} />
		</>
	);
}
