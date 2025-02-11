'use client';

import FilterBar from '@/components/general/filterBar/FilterBar';
import Spacing from '@/components/general/Spacing';
import { SortOptions } from '@/components/types/types';
import { useState } from 'react';
import TaskGallery from './TaskGallery';
import { Phase, Task } from '@prisma/client';

const ClientTasksPage = ({
	tasksData,
	phase,
	orgUrl,
}: {
	tasksData: (Task & { phase?: Phase })[];
	phase: boolean;
	orgUrl: string;
}) => {
	const [tasks, setTasks] = useState<(Task & { phase?: Phase })[]>(tasksData);
	const [options, setOptions] = useState<string[]>([]);
	const [query, setQuery] = useState('');
	const [sortType, setSortType] = useState<[SortOptions, boolean]>([
		'date',
		false,
	]);
	return (
		<>
			{phase ? (
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
			<TaskGallery tasks={tasks} setTasks={setTasks} orgUrl={orgUrl} />
		</>
	);
};

export default ClientTasksPage;
