import type { Metadata } from 'next';

import { TableHeader } from '@/components/types/types';
import TopMenu from '@/components/General/TopMenu';
import prisma from '@/lib/db';
import ClientFilesPage from '@/components/pages/project/files/ClientFilesPage';
import DatePickerV2 from '@/svgs/DatePickerV2';
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
	['size', 'File Size', 'size'],
	['uploader', 'Uploader'],
	[
		'updatedAt',
		'Upload Date',
		<DatePickerV2
			fill="var(--main)"
			width="16"
			height="16"
			key={Math.random().toString(36).substr(2, 9)}
		/>,
	],
];
const page = async ({ params }: { params: { project: string } }) => {
	const props = await params;
	const project = await prisma.project.findUnique({
		where: {
			id: props.project,
		},
		select: {
			id: true,
			Files: {
				orderBy: {
					updatedAt: 'desc',
				},
			},
		},
	});
	if (project) {
		const plainProjectData = {
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
				<ClientFilesPage
					fileData={plainProjectData.Files}
					tableHeaders={tableHeaders}
				/>
			</>
		);
	}
};

export default page;
