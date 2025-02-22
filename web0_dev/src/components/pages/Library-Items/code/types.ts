export type ProjectType =
	| 'html'
	| 'react'
	| 'python'
	| 'csharp'
	| 'java'
	| 'javascript'
	| 'php'
	| 'go'
	| 'c'
	| 'cpp'
	| 'rust'
	| 'ruby';

export interface CompilationResult {
	stdout: string;
	stderr: string;
	isError?: boolean;
	status?: string;
	memory?: number;
	time?: number;
}

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
		| 'csharp'
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

export interface Language {
	id: number;
	name: string;
	extension: string;
	defaultFile: string;
	defaultContent: string;
}

export const SUPPORTED_LANGUAGES: { [key in ProjectType]?: Language } = {
	python: {
		id: 71,
		name: 'Python',
		extension: '.py',
		defaultFile: 'main.py',
		defaultContent: 'print("Hello, World!")',
	},
	csharp: {
		id: 51,
		name: 'C#',
		extension: '.cs',
		defaultFile: 'Program.cs',
		defaultContent: `using System;

class Program {
    static void Main(string[] args) {
        Console.WriteLine("Hello, World!");
    }
}`,
	},
	cpp: {
		id: 54,
		name: 'C++',
		extension: '.cpp',
		defaultFile: 'main.cpp',
		defaultContent: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
	},
	java: {
		id: 62,
		name: 'Java',
		extension: '.java',
		defaultFile: 'Main.java',
		defaultContent: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
	},
	javascript: {
		id: 63,
		name: 'JavaScript',
		extension: '.js',
		defaultFile: 'index.js',
		defaultContent: 'console.log("Hello, World!");',
	},
};
