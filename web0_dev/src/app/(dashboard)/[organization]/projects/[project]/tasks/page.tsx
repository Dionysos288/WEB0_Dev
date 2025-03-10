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
	const props = await params;
	return {
		title: `${props.project} | Web0`,
		description: `View ${props.project} on Web0`,
	};
}
const page = async ({ params }: { params: { project: string } }) => {
	const props = await params;
	const { data: session } = await getUser();
	const organizationSlug = session?.session.organizationSlug;
	const organizationId = session?.session.organizationId;
	const project = await prisma.project.findUnique({
		where: {
			id: props.project,
		},

		select: {
			id: true,
			tasks: {
				include: {
					Phase: true,
					Comment: true,
					timeLogs: true,
					labels: true,
					assignees: true,
				},

				orderBy: {
					createdAt: 'desc',
				},
			},
		},
	});
	const phases = await prisma.phase.findMany({
		where: {
			projectId: props.project,
		},
	});
	const availableLabels = await prisma.label.findMany({
		where: {
			organizationId: organizationId,
		},
	});
	const availableMembers = await prisma.member.findMany({
		where: {
			organizationId: organizationId,
		},
		include: {
			user: {
				select: {
					email: true,
				},
			},
		},
	});

	if (project) {
		const transformedTasks = project.tasks.map((task) => ({
			...task,
			Phase: task.Phase || undefined,
			Comment: task.Comment || undefined,
			timeLogs: task.timeLogs || undefined,
			labels: task.labels || undefined,
			assignees: task.assignees || undefined,
		}));
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
					tasksData={transformedTasks}
					orgUrl={organizationSlug}
					projectId={project.id}
					phases={phases}
					availableLabels={availableLabels}
					availableMembers={availableMembers}
				/>
			</>
		);
	}
};

export default page;
