import type { Metadata } from 'next';

import FilterBar from '@/components/General/FilterBar';
import Spacing from '@/components/General/Spacing';
import TableData from '@/components/General/ui/TableData';
import { DatePicker } from '@/svgs';
import { TableHeader } from '@/components/types/types';
import TopMenu from '@/components/General/TopMenu';
import prisma from '@/lib/db';
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
		'updatedAt',
		'Upload Date',
		<DatePicker key={Math.random().toString(36).substr(2, 9)} />,
	],
];
const page = async ({ params }: { params: { project: string } }) => {
	const project = await prisma.project.findUnique({
		where: {
			id: params.project,
		},
		include: {
			Files: true,
		},
	});
	if (project) {
		const plainProjectData = {
			...project,
			Files: project.Files.map((file) => ({
				...file,
				size: file.size.toNumber(),
			})),
		};
		return (
			<>
				<TopMenu
					mainLink={`projects/${project.id}`}
					menuItems={[
						'Overview',
						'Tasks',
						'Client Portal',
						'Files',
						'Library',
						'Settings',
					]}
					AddItem="Add Task"
					foundLink="files"
				/>
				<FilterBar views={false} search={true} />
				<Spacing space={28} />
				<TableData
					type="files"
					tableHeaders={tableHeaders}
					tableData={plainProjectData.Files}
				/>
			</>
		);
	}
};

export default page;
