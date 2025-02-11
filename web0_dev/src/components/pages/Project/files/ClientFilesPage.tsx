'use client';
import FilterBar from '@/components/general/filterBar/FilterBar';
import Spacing from '@/components/general/Spacing';
import TableData from '@/components/general/ui/TableData';
import { fileType, SortOptions, TableHeader } from '@/components/types/types';
import { useState } from 'react';

const ClientFilesPage = ({
	fileData,
	tableHeaders,
}: {
	fileData: fileType[];
	tableHeaders: TableHeader[];
}) => {
	const [filesData, setFilesData] = useState<fileType[]>(fileData);
	const [options, setOptions] = useState<string[]>([]);
	const [query, setQuery] = useState('');
	const [sortType, setSortType] = useState<[SortOptions, boolean]>([
		'date',
		false,
	]);
	console.log('fileData', fileData);
	console.log('tableHeaders', filesData);
	return (
		<>
			<FilterBar
				options={['date', 'name', 'size']}
				data={filesData}
				setData={setFilesData}
				model={'file'}
				id={fileData[0].projectId}
				setQuery={setQuery}
				query={query}
				filters={options}
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
