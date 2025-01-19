import projects from '@/Data/Projects';
import type { Metadata } from 'next';

import FilterBar from '@/components/General/FilterBar';
import Spacing from '@/components/General/Spacing';
import TableData from '@/components/General/ui/TableData';
import { projectFiles } from '@/Data/ProjectFiles';
import { DatePicker } from '@/svgs';
import { TableHeader } from '@/components/types/types';
export async function generateMetadata({
	params,
}: {
	params: { project: string };
}): Promise<Metadata> {
	return {
		title: `${params} | Web0`,
		description: `View ${params} on Web0`,
	};
}

const tableHeaders: TableHeader[] = [
	['name', 'File Name', 'file'],
	['size', 'File Size'],
	['uploader', 'Uploader'],
	[
		'date',
		'Upload Date',
		<DatePicker key={Math.random().toString(36).substr(2, 9)} />,
	],
];
const page = ({ params }: { params: { project: string } }) => {
	const project = projects.find((project) => project.id === params.project);
	if (project) {
		return (
			<>
				<FilterBar views={false} search={true} />
				<Spacing space={28} />
				<TableData
					type="files"
					tableHeaders={tableHeaders}
					tableData={projectFiles}
				/>
			</>
		);
	}
};

export default page;
