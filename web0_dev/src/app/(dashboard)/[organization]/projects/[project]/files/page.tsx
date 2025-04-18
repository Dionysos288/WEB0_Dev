import type { Metadata } from 'next';
import { getUser } from '@/actions/AccountActions';
import prisma from '@/lib/db';
import TopMenu from '@/components/general/TopMenu';
import ClientFilesPage from '@/components/pages/project/files/ClientFilesPage';
import { TableHeader } from '@/components/types/types';
import DatePickerV2 from '@/svgs/DatePickerV2';

export async function generateMetadata({
	params,
}: {
	params: { project: string };
}): Promise<Metadata> {
	const project = await prisma.project.findUnique({
		where: { id: params.project },
	});

	return {
		title: `${project?.title || 'Project'} Files | Web0`,
		description: 'Manage project files on Web0',
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
			key="date-picker"
		/>,
	],
];

const page = async ({ params }: { params: { project: string } }) => {
	const props = await params;
	const { data: session } = await getUser();
	const organizationSlug = session?.session.organizationSlug;

	const project = await prisma.project.findUnique({
		where: {
			id: props.project,
		},
		select: {
			id: true,
			files: {
				orderBy: {
					updatedAt: 'desc',
				},
			},
		},
	});

	if (project) {
		return (
			<>
				<TopMenu
					menuItems={[
						'Overview',
						'Tasks',
						'Client Portal',
						'Files',
						'Library',
						'Settings',
					]}
					menuLinks={[
						`${organizationSlug}/projects/${project.id}`,
						`${organizationSlug}/projects/${project.id}/tasks`,
						`${organizationSlug}/projects/${project.id}/client-portal`,
						`${organizationSlug}/projects/${project.id}/files`,
						`${organizationSlug}/projects/${project.id}/library`,
						`${organizationSlug}/projects/${project.id}/settings`,
					]}
					AddItem="Add Task"
					foundLink="files"
				/>
				<ClientFilesPage fileData={project.files} tableHeaders={tableHeaders} />
			</>
		);
	}

	return null;
};

export default page;
