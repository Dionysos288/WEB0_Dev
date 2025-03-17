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
import { useState } from 'react';

const ClientFilesPage = ({
	fileData,
	tableHeaders,
}: {
	fileData: fileType[];
	tableHeaders: TableHeader[];
}) => {
	const [filesData, setFilesData] = useState<fileType[]>(fileData);
	const [options] = useState<SortOptions[]>(['date', 'name', 'size']);
	const [query, setQuery] = useState('');
	const [sortType, setSortType] = useState<[SortOptions, boolean]>([
		'date',
		false,
	]);

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
