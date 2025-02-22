import type { Metadata } from 'next';
import { getUser } from '@/actions/AccountActions';
import TopMenu from '@/components/general/TopMenu';
import prisma from '@/lib/db';
import ClientTasksPage from '@/components/pages/project/tasks/ClientTasksPage';
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
			tasks: {
				include: {
					Phase: true,
				},
				orderBy: {
					createdAt: 'desc',
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
					foundLink="tasks"
				/>

				<ClientTasksPage
					tasksData={project.tasks}
					phase={true}
					orgUrl={organizationSlug}
					projectId={project.id}
				/>
			</>
		);
	}
};

export default page;
