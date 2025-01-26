import prisma from '@/lib/db';
import {
	Category,
	Client,
	ClientStatus,
	File,
	Library,
	LibraryType,
	Task,
	TaskStatus,
} from '@prisma/client';
import { ReactNode } from 'react';

type TableHeader = [keyof File, string, (string | ReactNode)?];
type ModelNames = keyof typeof prisma;
type ExtendedLibrary = Library & { Category: Category | null };
type ExtendedCategory = Category & { subcategories: ExtendedCategory[] };
type fileType = Omit<File, 'size'>;
type DataType = fileType | Client;
type LibraryData = LibraryType & {
	categories: ExtendedCategory[];
	libraries: ExtendedLibrary[];
};
type SortOptions = 'date' | 'title' | 'name' | 'size' | 'priority';
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
};
