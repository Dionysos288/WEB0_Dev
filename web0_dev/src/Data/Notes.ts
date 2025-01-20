import { FolderType, NoteType } from '@/components/types/types';
const folders: FolderType[] = [
	{ id: 1, name: 'Work', emoji: 'Money' },
	{ id: 2, name: 'Personal', emoji: 'Money' },
	{ id: 3, name: 'Project X', emoji: 'Money' },
	{ id: 4, name: 'Project Y', emoji: 'Money' },
];

const notes: NoteType[] = [
	{
		id: 1,
		title: 'Meeting Notes',
		content: 'Discuss project timeline.',
		folderId: 1,
		emoji: 'Folder',
	},
	{
		id: 2,
		title: 'Grocery List',
		content: 'Milk, Bread, Eggs',
		folderId: 2,
		emoji: 'Folder',
	},
	{
		id: 3,
		title: 'Ideas',
		content: 'New app concept.',
		folderId: 1,
		emoji: 'Folder',
	},
	{
		id: 4,
		title: 'Random Thoughts',
		content: 'Need to read more books.',
		emoji: 'Folder',
		folderId: 3,
	},
	{
		id: 5,
		title: 'Random Thoughts',
		content: 'Need to read more books.',
		emoji: 'Folder',
		folderId: 4,
	},
	{
		id: 6,
		title: 'Random Thoughts',
		content: 'Need to read more books.',
		emoji: 'Folder',
		folderId: 4,
	},
	{
		id: 7,
		title: 'Random Thoughts',
		content: 'Need to read more books.',
		emoji: 'Folder',
	},
	{
		id: 8,
		title: 'Random Thoughts',
		content: 'Need to read more books.',
		emoji: 'Folder',
	},
	{
		id: 9,
		title: 'Random Thoughts',
		content: 'Need to read more books.',
		emoji: 'Folder',
	},
];

export { notes, folders };
