import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import React, { useRef } from 'react';

interface CodeEditorProps {
	fileName: string;
	content: string;
	language: string;
	onChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
	fileName,
	content,
	language,
	onChange,
}) => {
	const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

	const handleEditorDidMount: OnMount = (editor) => {
		monacoRef.current = editor;
	};

	return (
		<Editor
			height={'calc(75vh - 52px)'}
			theme="vs-dark"
			path={fileName}
			defaultLanguage={language}
			value={content}
			onChange={onChange}
			onMount={handleEditorDidMount}
			options={{
				minimap: { enabled: false },
				automaticLayout: true,
				scrollBeyondLastLine: false,
				renderWhitespace: 'selection',
				fontLigatures: true,
				cursorBlinking: 'smooth',
				wordWrap: 'on',
				smoothScrolling: true,
				contextmenu: true,
				renderLineHighlight: 'all',
				lineHeight: 1.6,
				letterSpacing: 0.5,
				roundedSelection: true,
				scrollbar: {
					verticalScrollbarSize: 8,
					horizontalScrollbarSize: 8,
				},
			}}
		/>
	);
};

export default CodeEditor;
