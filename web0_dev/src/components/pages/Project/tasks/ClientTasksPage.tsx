'use client';

import FilterBar from '@/components/general/filterBar/FilterBar';
import Spacing from '@/components/general/Spacing';
import { SortOptions } from '@/components/types/types';
import { useState, useEffect } from 'react';
import TaskGallery from './TaskGallery';
import { Phase, Task, TimeLog, Comment, Label, Member } from '@prisma/client';

const ClientTasksPage = ({
	tasksData,

	orgUrl,
	projectId,
}: {
	tasksData: (Task & {
		phase?: Phase;
		comments?: Comment[];
		timeLogs?: TimeLog[];
		labels?: Label[];
		assignees?: Member[];
	})[];
	orgUrl: string;
	projectId: string;
}) => {
	const [tasks, setTasks] = useState<
		(Task & {
			phase?: Phase;
			comments?: Comment[];
			timeLogs?: TimeLog[];
			labels?: Label[];
			assignees?: Member[];
		})[]
	>(tasksData);
	const [options, setOptions] = useState<string[]>([]);
	const [query, setQuery] = useState('');
	const [sortType, setSortType] = useState<[SortOptions, boolean]>([
		'date',
		false,
	]);

	useEffect(() => {
		setTasks(tasksData);
	}, [tasksData]);

	return (
		<>
			<FilterBar
				options={['date', 'title', 'priority']}
				data={tasks}
				setData={setTasks}
				model={'task'}
				id={tasksData[0]?.projectId}
				setQuery={setQuery}
				query={query}
				filters={options}
				sortType={sortType}
				setSortType={setSortType}
			/>

			<Spacing space={28} />
			<TaskGallery
				tasks={tasks}
				setTasks={setTasks}
				orgUrl={orgUrl}
				projectId={projectId}
			/>
		</>
	);
};

export default ClientTasksPage;
