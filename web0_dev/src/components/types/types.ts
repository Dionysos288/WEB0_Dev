import { ReactNode } from 'react';

type ProjectStatus = 'progress' | 'rejected' | 'pending' | 'completed';
type PhaseStatus = 'Completed' | 'Active' | 'Not Started';
type ClientStatus = 'Leads' | 'Contacted' | 'Opportunity' | 'Client';
type TaskStatus = 'Backlog' | 'In Progress' | 'Completed';
type TableHeader = [keyof fileType, string, (string | ReactNode)?];

interface TaskType {
	id: number;
	columnId: number;
	title: string;
}
interface TaskColumnType {
	id: number;
	title: TaskStatus;
	tasks: TaskType[];
}
interface projectType {
	id: string;
	title: string;
	start: string;
	due: string;
	team: string[];
	phase: ProjectStatus;
	budget: string;
	Alltasks: number;
	completed: number;
}
interface phaseType {
	id: number;
	name: string;
	description: string;
	startDate: string;
	endDate: string;
	status: PhaseStatus;
}
interface fileType {
	id: number;
	name: string;
	description: string;
	size: number;
	uploader: string;
	date: string;
	[key: string]: string | number;
}
interface clientType {
	id: number;
	name: string;
	type: ClientStatus;
	category: string;
	email: string;
	company: string;
	source: string;
	columnId: number;
	[key: string]: string | number;
}
interface ClientColumnType {
	id: number;
	title: ClientStatus;
	tasks: clientType[];
}
export type {
	projectType,
	phaseType,
	fileType,
	clientType,
	ProjectStatus,
	ClientStatus,
	PhaseStatus,
	TableHeader,
	TaskType,
	TaskColumnType,
	ClientColumnType,
	TaskStatus,
};
