import FilterBar from '@/components/general/filterBar/FilterBar';
import Spacing from '@/components/general/Spacing';
import { TableHeader } from '@/components/types/types';
import ContactStatus from '@/components/pages/clients/overview/ContactStatus';
import styles from './page.module.scss';
import ContactSource from '@/components/pages/clients/overview/ContactSource';
import TopMenu from '@/components/general/TopMenu';
import ServerTableData from '@/components/server/ServerTableData';
import { getUser } from '@/actions/AccountActions';

export default async function LibraryPage() {
	const tableHeaders: TableHeader[] = [
		['name', 'User', 'user'],
		['email', 'Email'],
		['source', 'Source'],
		['status', 'Status', 'status'],
	];
	const { data: session } = await getUser();
	const organizationSlug = session?.session.organizationSlug;
	return (
		<>
			<TopMenu
				menuItems={['Overview', 'Leads']}
				menuLinks={[
					`${organizationSlug}/clients`,
					`${organizationSlug}/clients/leads`,
				]}
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
			<ServerTableData tableHeaders={tableHeaders} session={session} />
		</>
	);
}
