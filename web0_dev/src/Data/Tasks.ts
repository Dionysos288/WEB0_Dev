import { TaskColumnType, TaskType } from '@/components/types/types';

const TasksData: TaskType[] = [
	{ id: 1, columnId: 123, title: 'ik' },
	{ id: 2, columnId: 123, title: 'ben' },
	{ id: 3, columnId: 123, title: 'dion' },
	{ id: 4, columnId: 234, title: 'ik' },
	{ id: 5, columnId: 234, title: 'ben' },
	{ id: 6, columnId: 234, title: 'dion' },
	{ id: 7, columnId: 345, title: 'ik' },
	{ id: 8, columnId: 345, title: 'ben' },
	{ id: 9, columnId: 345, title: 'dion' },
];

const columnsData: TaskColumnType[] = [
	{
		id: 123,
		title: 'Backlog',
		tasks: TasksData.filter((task) => task.columnId === 123),
	},
	{
		id: 234,
		title: 'In Progress',
		tasks: TasksData.filter((task) => task.columnId === 234),
	},
	{
		id: 345,
		title: 'Completed',
		tasks: TasksData.filter((task) => task.columnId === 345),
	},
];

export { TasksData, columnsData };
