'use client';
import FilterBar from '@/components/general/filterBar/FilterBar';
import Spacing from '@/components/general/Spacing';
import TableData from '@/components/general/ui/TableData';
import { SortOptions, TableHeader, TeamData } from '@/components/types/types';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ClientMembersPage = ({
	teamsData,
	tableHeaders,
}: {
	teamsData: TeamData[];
	tableHeaders: TableHeader[];
}) => {
	const pathname = usePathname();
	const [teams, setTeams] = useState<TeamData[]>(teamsData);
	const [options] = useState<SortOptions[]>([
		'date',
		'name',
		'members',
		'issues',
	]);
	const [query, setQuery] = useState('');
	const [sortType, setSortType] = useState<[SortOptions, boolean]>([
		'date',
		false,
	]);

	useEffect(() => {
		const pageInfoEvent = new CustomEvent('pageinfo', {
			detail: {
				title: `Teams`,
				type: 'teams',
				pathname: pathname,
			},
		});
		window.dispatchEvent(pageInfoEvent);
	}, [pathname]);

	return (
		<>
			<FilterBar
				options={options}
				data={teams}
				setData={setTeams as any}
				model={'team'}
				setQuery={setQuery}
				query={query}
				filters={[]}
				sortType={sortType}
				setSortType={setSortType}
				isNoFilter={true}
			/>
			<Spacing space={28} />
			<TableData
				type="members"
				tableHeaders={tableHeaders}
				tableData={teams}
				isCheckboxes={false}
			/>
		</>
	);
};

export default ClientMembersPage;
