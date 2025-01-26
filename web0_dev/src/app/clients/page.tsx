import FilterBar from '@/components/General/filterBar/FilterBar';
import Spacing from '@/components/General/Spacing';
import { TableHeader } from '@/components/types/types';
import ContactStatus from '@/components/pages/clients/overview/ContactStatus';
import styles from './page.module.scss';
import ContactSource from '@/components/pages/clients/overview/ContactSource';
import TopMenu from '@/components/General/TopMenu';
import ServerTableData from '@/components/Server/ServerTableData';

export default function LibraryPage() {
	const tableHeaders: TableHeader[] = [
		['name', 'User', 'user'],
		['email', 'Email'],
		['source', 'Source'],
		['status', 'Status', 'status'],
	];
	return (
		<>
			<TopMenu
				mainLink="clients"
				menuItems={['Overview', 'Leads']}
				AddItem="Add User"
				foundLink="overview"
			/>
			<div className={styles.TopSide}>
				<ContactSource />
				<ContactStatus />
			</div>
			<Spacing space={28} />
			<FilterBar title="Clients" />
			<Spacing space={28} />
			<ServerTableData tableHeaders={tableHeaders} />
		</>
	);
}
