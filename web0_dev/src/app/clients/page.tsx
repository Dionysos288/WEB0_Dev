import FilterBar from '@/components/General/FilterBar';
import Spacing from '@/components/General/Spacing';
import TableData from '@/components/General/ui/TableData';
import { TableHeader } from '@/components/types/types';
import { Clients } from '@/Data/Clients';
import ContactStatus from '@/components/pages/clients/overview/ContactStatus';
import styles from './page.module.scss';
import ContactSource from '@/components/pages/clients/overview/ContactSource';
import TopMenu from '@/components/General/TopMenu';

export default function LibraryPage() {
	const tableHeaders: TableHeader[] = [
		['name', 'User', 'user'],
		['email', 'Email'],
		['source', 'Source'],
		['type', 'Status', 'status'],
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

			<TableData
				type="clients"
				tableHeaders={tableHeaders}
				tableData={Clients}
			/>
		</>
	);
}
