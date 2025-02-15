export type ProjectType = 'html' | 'react' | 'python';

export interface FileOption {
	name: string;
	type:
		| 'html'
		| 'css'
		| 'javascript'
		| 'component'
		| 'style'
		| 'util'
		| 'python'
		| 'text';
	language: string;
	value: string;
	description?: string;
}

export interface FileContent {
	[key: string]: string;
}

export interface FileGroup {
	[key: string]: {
		name: string;
		type: FileOption['type'];
		description?: string;
	}[];
}

export interface EditorFile {
	name: string;
	language: string;
	type: FileOption['type'];
	value: string;
	description?: string;
}
