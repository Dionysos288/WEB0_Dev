import {
	Category,
	Client,
	ClientStatus,
	File,
	Library,
	LibraryType,
	Phase,
	Task,
	TaskStatus,
	TimeLog,
	Comment,
	Label,
	Member,
	PrismaClient,
} from '@prisma/client';
import { ReactNode } from 'react';

type TableHeader = [string, string, (string | ReactNode)?];
type ModelNames = keyof PrismaClient;
type ExtendedLibrary = Library & { category: Category | null };
type ExtendedCategory = Category & { subcategories: ExtendedCategory[] };
type fileType = Omit<File, 'size'>;
type DataType = fileType | Client;
type LibraryData = LibraryType & {
	categories: ExtendedCategory[];
	libraries: ExtendedLibrary[];
};
type SortOptions = string;
interface TaskColumnType {
	id: number;
	title: TaskStatus;
	displayTitle?: string;
	tasks: (Task & {
		Phase?: Phase;
		Comment?: Comment[];
		timeLogs?: TimeLog[];
		labels?: Label[];
		assignees?: Member[];
	})[];
}
type TeamData = {
	id: string;
	name: string;
	createdAt: Date;
	members: number;
	issues: number;
};
type ClientColumnType = {
	id: number;
	title: ClientStatus;
	tasks: Client[];
};

export type {
	TableHeader,
	TaskColumnType,
	ClientColumnType,
	SortOptions,
	ModelNames,
	ExtendedLibrary,
	ExtendedCategory,
	LibraryData,
	DataType,
	fileType,
	TeamData,
};
