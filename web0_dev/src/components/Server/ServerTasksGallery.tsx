import prisma from '@/lib/db';
import TaskGallery from '../pages/Project/tasks/TaskGallery';

const ServerTasksGallery = async ({ phase }: { phase: string }) => {
	const tasks = await prisma.task.findMany({
		where: {
			phaseId: phase,
		},
	});
	return <TaskGallery TasksData={tasks} />;
};

export default ServerTasksGallery;
