'use client';

import FilterBar from '@/components/General/filterBar/FilterBar';
import Spacing from '@/components/General/Spacing';
import { SortOptions } from '@/components/types/types';
import { useState } from 'react';
import TaskGallery from './TaskGallery';
import { Task } from '@prisma/client';

const ClientTasksPage = ({
	tasksData,
	phase,
}: {
	tasksData: Task[];
	phase: boolean;
}) => {
	const [tasks, setTasks] = useState<Task[]>(tasksData);
	const [options, setOptions] = useState<string[]>([]);
	const [query, setQuery] = useState('');
	const [sortType, setSortType] = useState<[SortOptions, boolean]>([
		'date',
		false,
	]);
	return (
		<>
			{phase && tasksData[0].phaseId ? (
				<FilterBar
					options={['date', 'title', 'priority']}
					data={tasks}
					setData={setTasks}
					model={'task'}
					phaseId={tasksData[0].phaseId}
					id={tasksData[0].projectId}
					setQuery={setQuery}
					query={query}
					filters={options}
					sortType={sortType}
					setSortType={setSortType}
				/>
			) : (
				<FilterBar
					options={['date', 'title', 'priority']}
					data={tasks}
					setData={setTasks}
					model={'task'}
					id={tasksData[0].projectId}
					setQuery={setQuery}
					query={query}
					filters={options}
					sortType={sortType}
					setSortType={setSortType}
				/>
			)}

			<Spacing space={28} />
			<TaskGallery tasks={tasks} setTasks={setTasks} />
		</>
	);
};

export default ClientTasksPage;
