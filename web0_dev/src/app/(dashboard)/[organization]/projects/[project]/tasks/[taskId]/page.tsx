import type { Metadata } from 'next';
import { getUser } from '@/actions/AccountActions';
import prisma from '@/lib/db';
import TaskDetails from '@/components/pages/project/taskDetail/TaskDetails';

export async function generateMetadata({
	params,
}: {
	params: { project: string; taskId: string };
}): Promise<Metadata> {
	const param = await params;
	const task = await prisma.task.findUnique({
		where: { id: param.taskId },
		select: { title: true },
	});

	return {
		title: `${task?.title || 'Task'} | Web0`,
		description: `View task details on Web0`,
	};
}

const page = async ({
	params,
}: {
	params: { project: string; taskId: string; organization: string };
}) => {
	const param = await params;
	const { data: session } = await getUser();
	const organizationSlug = session?.session.organizationSlug;
	const organizationId = session?.session.activeOrganizationId;

	const member = await prisma.member.findFirst({
		where: {
			userId: session?.user.id,
			organizationId: organizationId,
		},
		select: {
			id: true,
			user: {
				select: {
					name: true,
					image: true,
				},
			},
		},
	});

	const task = await prisma.task.findUnique({
		where: {
			id: param.taskId,
		},
		include: {
			Phase: true,
			project: true,
		},
	});

	if (task && member) {
		const taskData = {
			...task,
			project: {
				...task.project,
				budget: task.project.budget.toNumber(),
			},
			Phase: task.Phase
				? {
						...task.Phase,
				  }
				: null,
		};

		return (
			<>
				<TaskDetails
					task={taskData}
					orgUrl={organizationSlug || ''}
					memberId={member.id}
					organizationId={organizationId || ''}
					userName={member.user.name}
					userImage={member.user.image}
				/>
			</>
		);
	}
};

export default page;
