import { Client, ClientStatus, File, Task, TaskStatus } from '@prisma/client';
import { ReactNode } from 'react';

type TableHeader = [keyof File, string, (string | ReactNode)?];

interface TaskColumnType {
	id: number;
	title: TaskStatus;
	tasks: Task[];
}

type ClientColumnType = {
	id: number;
	title: ClientStatus;
	tasks: Client[];
};

export type { TableHeader, TaskColumnType, ClientColumnType };
