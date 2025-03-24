'use client';
import FilterBar from '@/components/general/filterBar/FilterBar';
import Spacing from '@/components/general/Spacing';
import TableData from '@/components/general/ui/TableData';
import {
	fileType,
	SortOptions,
	TableHeader,
	ExtendedLibrary,
} from '@/components/types/types';
import { Task, Phase } from '@prisma/client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ClientFilesPage = ({
	fileData,
	tableHeaders,
}: {
	fileData: fileType[];
	tableHeaders: TableHeader[];
}) => {
	const pathname = usePathname();
	const [filesData, setFilesData] = useState<fileType[]>(fileData);
	const [options] = useState<SortOptions[]>(['date', 'name', 'size']);
	const [query, setQuery] = useState('');
	const [sortType, setSortType] = useState<[SortOptions, boolean]>([
		'date',
		false,
	]);

	useEffect(() => {
		const projectId = pathname.split('/').slice(-2)[0];
		const pageInfoEvent = new CustomEvent('pageinfo', {
			detail: {
				id: projectId,
				title: `Project Files`,
				type: 'files',
				pathname: pathname,
			},
		});
		window.dispatchEvent(pageInfoEvent);
	}, [pathname]);

	return (
		<>
			<FilterBar
				options={options}
				data={filesData}
				setData={
					setFilesData as React.Dispatch<
						React.SetStateAction<
							fileType[] | ExtendedLibrary[] | (Task & { phase?: Phase })[]
						>
					>
				}
				model={'file'}
				id={fileData[0]?.projectId || ''}
				setQuery={setQuery}
				query={query}
				filters={[]}
				sortType={sortType}
				setSortType={setSortType}
			/>
			<Spacing space={28} />
			<TableData
				type="files"
				tableHeaders={tableHeaders}
				tableData={filesData}
			/>
		</>
	);
};

export default ClientFilesPage;
