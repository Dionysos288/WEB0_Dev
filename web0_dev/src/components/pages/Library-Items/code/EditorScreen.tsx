'use client';
import styles from './EditorScreen.module.scss';
import React, { useState, useEffect, useRef } from 'react';
import files from '@/data/Files';
import { ProjectType, FileContent } from './types';
import CodeEditor from './components/CodeEditor';
import Terminal from './components/Terminal';
import FileSelector from './components/FileSelector';
import Toolbar from './components/Toolbar';
import Color from '@/svgs/Color';
import { runCode, LANGUAGE_IDS } from '@/actions/compiler';

interface EditorScreenProps {
	fullscreen?: boolean;
}

// Set this to 'html' or 'react' or 'python' or 'csharp' or 'java' or 'javascript' or 'php' or 'go'
// or 'c' or 'cpp' (C++) or 'rust' or 'ruby' to switch between project types
const PROJECT_TYPE = 'react' as ProjectType;

const TerminalOutput: React.FC<{
	projectType: ProjectType;
	output: { text: string; className?: string }[];
	setOutput: React.Dispatch<
		React.SetStateAction<{ text: string; className?: string }[]>
	>;
	inputs: string[];
	setInputs: (inputs: string[]) => void;
}> = ({ projectType, output, setOutput, inputs, setInputs }) => {
	// Show terminal for all languages except HTML and React
	if (projectType === 'html' || projectType === 'react') {
		return null;
	}

	return (
		<Terminal
			output={output}
			setOutput={setOutput}
			isAwaitingInput={false}
			sendInput={() => {}}
			inputs={inputs}
			setInputs={setInputs}
		/>
	);
};

const EditorContent: React.FC<{
	fileName: string;
	editorContent: FileContent;
	onEditorChange: (value: string | undefined) => void;
	setOutput: React.Dispatch<
		React.SetStateAction<{ text: string; className?: string }[]>
	>;
	inputs: string[];
}> = ({ fileName, editorContent, onEditorChange, setOutput, inputs }) => {
	const [isCompiling, setIsCompiling] = useState(false);

	const handleRun = async () => {
		setIsCompiling(true);
		setOutput([]); // Clear previous output
		try {
			let languageId: number;
			switch (PROJECT_TYPE) {
				case 'python':
					languageId = LANGUAGE_IDS.PYTHON;
					break;
				case 'csharp':
					languageId = LANGUAGE_IDS.CSHARP;
					break;
				case 'java':
					languageId = LANGUAGE_IDS.JAVA;
					break;
				case 'javascript':
					languageId = LANGUAGE_IDS.JAVASCRIPT;
					break;
				case 'php':
					languageId = LANGUAGE_IDS.PHP;
					break;
				case 'go':
					languageId = LANGUAGE_IDS.GO;
					break;
				case 'c':
					languageId = LANGUAGE_IDS.C;
					break;
				case 'cpp':
					languageId = LANGUAGE_IDS.CPP;
					break;
				case 'rust':
					languageId = LANGUAGE_IDS.RUST;
					break;
				case 'ruby':
					languageId = LANGUAGE_IDS.RUBY;
					break;
				default:
					throw new Error('Unsupported language');
			}

			const result = await runCode(editorContent[fileName], languageId, inputs);

			// Handle compilation output first if it exists
			if (result.stderr) {
				setOutput((prev) => [
					...prev,
					{ text: result.stderr, className: 'errorMessage' },
				]);
			}

			// Then handle standard output
			if (result.stdout) {
				setOutput((prev) => [...prev, { text: result.stdout }]);
			}

			// If there's a status message and it's not "Accepted", show it
			if (result.status && result.status !== 'Accepted') {
				setOutput((prev) => [
					...prev,
					{ text: `Status: ${result.status}\n`, className: 'errorMessage' },
				]);
			}

			// Show execution details if available
			if (result.time || result.memory) {
				const details: string[] = [];
				if (result.time) details.push(`Time: ${result.time}s`);
				if (result.memory) details.push(`Memory: ${result.memory}KB`);
				if (details.length > 0) {
					setOutput((prev) => [
						...prev,
						{ text: `\n${details.join(' | ')}\n` },
					]);
				}
			}
		} catch (error) {
			console.error('Failed to run code:', error);
			setOutput((prev) => [
				...prev,
				{
					text: `Error: ${
						error instanceof Error ? error.message : 'Unknown error'
					}\n`,
					className: 'errorMessage',
				},
			]);
		} finally {
			setIsCompiling(false);
		}
	};

	return (
		<>
			<Toolbar
				isRunning={isCompiling}
				onRun={handleRun}
				showRunButton={PROJECT_TYPE !== 'html' && PROJECT_TYPE !== 'react'}
			/>
			<CodeEditor
				fileName={fileName}
				content={editorContent[fileName]}
				language={files[fileName]?.language || 'plaintext'}
				onChange={onEditorChange}
			/>
		</>
	);
};

const EditorScreen: React.FC<EditorScreenProps> = ({ fullscreen }) => {
	const [fileName, setFileName] = useState<string>(() => {
		switch (PROJECT_TYPE) {
			case 'html':
				return 'index.html';
			case 'react':
				return 'App.jsx';
			case 'python':
				return 'main.py';
			case 'csharp':
				return 'Program.cs';
			case 'java':
				return 'Main.java';
			case 'javascript':
				return 'index.js';
			case 'php':
				return 'index.php';
			case 'go':
				return 'main.go';
			case 'c':
				return 'main.c';
			case 'cpp':
				return 'main.cpp';
			case 'rust':
				return 'main.rs';
			case 'ruby':
				return 'main.rb';
			default:
				return 'main.py';
		}
	});

	const [editorContent, setEditorContent] = useState<FileContent>(() => {
		return Object.entries(files).reduce((acc, [key, file]) => {
			acc[key] = file.value;
			return acc;
		}, {} as FileContent);
	});

	const [previewHtml, setPreviewHtml] = useState<string>('');
	const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
	const [showColorInput, setShowColorInput] = useState(false);
	const colorInputRef = useRef<HTMLInputElement>(null);
	const [output, setOutput] = useState<{ text: string; className?: string }[]>(
		[]
	);
	const [inputs, setInputs] = useState<string[]>([]);

	useEffect(() => {
		if (PROJECT_TYPE === 'html') {
			const html = `
				<!DOCTYPE html>
				<html>
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<title>HTML Preview</title>
						<style>
							${editorContent['styles.css'] || ''}
						</style>
					</head>
					<body>
						${editorContent['index.html']}
						<script>
							${editorContent['script.js'] || ''}
						</script>
					</body>
				</html>
			`;
			setPreviewHtml(html);
		} else if (PROJECT_TYPE === 'react') {
			const html = `
				<!DOCTYPE html>
				<html>
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<title>React Preview</title>
						<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
						<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
						<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
						<style>
							${Object.entries(files)
								.filter(([, file]) => file.type === 'style')
								.map(([, file]) => file.value)
								.join('\n')}
						</style>
					</head>
					<body>
						<div id="root"></div>
						<script type="text/babel">
							${Object.entries(files)
								.filter(([, file]) => file.type === 'component')
								.map(([, file]) => file.value)
								.join('\n')}
							
							ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
						</script>
					</body>
				</html>
			`;
			setPreviewHtml(html);
		}
	}, [editorContent, PROJECT_TYPE]);

	const handleEditorChange = (value: string | undefined) => {
		if (value !== undefined) {
			setEditorContent((prev) => ({
				...prev,
				[fileName]: value,
			}));
		}
	};

	const handleColorClick = () => {
		setShowColorInput(true);
		setTimeout(() => {
			colorInputRef.current?.click();
		}, 0);
	};

	const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newColor = e.target.value;
		setBackgroundColor(newColor);
		setShowColorInput(false);
	};

	const getFileGroups = () => {
		const fileOptions = Object.entries(files).map(([key, file]) => ({
			name: key,
			type: file.type,
			description: file.description,
		}));

		const groups: Record<string, typeof fileOptions> = {};

		switch (PROJECT_TYPE) {
			case 'html':
				groups.html = fileOptions.filter((f) => f.type === 'html');
				groups.css = fileOptions.filter((f) => f.type === 'css');
				groups.javascript = fileOptions.filter((f) => f.type === 'javascript');
				break;
			case 'react':
				groups.components = fileOptions.filter((f) => f.type === 'component');
				groups.styles = fileOptions.filter((f) => f.type === 'style');
				groups.utils = fileOptions.filter((f) => f.type === 'util');
				break;
			case 'python':
				groups.python = fileOptions.filter((f) => f.type === 'python');
				break;
			case 'csharp':
				groups.csharp = fileOptions.filter((f) => f.type === 'csharp');
				break;
			case 'java':
				groups.java = fileOptions.filter((f) => f.type === 'java');
				break;
			case 'javascript':
				groups.javascript = fileOptions.filter((f) => f.type === 'javascript');
				break;
			case 'php':
				groups.php = fileOptions.filter((f) => f.type === 'php');
				break;
			case 'go':
				groups.go = fileOptions.filter((f) => f.type === 'go');
				break;
			case 'c':
				groups.c = fileOptions.filter((f) => f.type === 'c');
				break;
			case 'cpp':
				groups.cpp = fileOptions.filter((f) => f.type === 'cpp');
				break;
			case 'rust':
				groups.rust = fileOptions.filter((f) => f.type === 'rust');
				break;
			case 'ruby':
				groups.ruby = fileOptions.filter((f) => f.type === 'ruby');
				break;
		}

		return groups;
	};

	const renderContent = () => {
		const mainContent = (
			<EditorContent
				fileName={fileName}
				editorContent={editorContent}
				onEditorChange={handleEditorChange}
				setOutput={setOutput}
				inputs={inputs}
			/>
		);

		const outputContent = (
			<div className={styles.outputContent}>
				{PROJECT_TYPE === 'html' || PROJECT_TYPE === 'react' ? (
					<>
						<iframe
							srcDoc={previewHtml}
							style={{
								width: '100%',
								height: '100%',
								border: 'none',
								backgroundColor: backgroundColor,
							}}
							title="preview"
						/>
						<div className={styles.colorPicker}>
							<p>{backgroundColor}</p>
							<button onClick={handleColorClick}>
								<Color width="20" height="20" fill="var(--orange-90)" />
							</button>
							<input
								ref={colorInputRef}
								type="color"
								value={backgroundColor}
								onChange={handleColorChange}
								style={{
									position: 'absolute',
									opacity: 0,
									pointerEvents: showColorInput ? 'auto' : 'none',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
								}}
							/>
						</div>
					</>
				) : (
					<TerminalOutput
						projectType={PROJECT_TYPE}
						output={output}
						setOutput={setOutput}
						inputs={inputs}
						setInputs={setInputs}
					/>
				)}
			</div>
		);

		if (fullscreen) {
			return (
				<div className={styles.editorfull}>
					<div className={styles.backGround}>
						<div className={styles.editor}>
							<div className={styles.sidebar}>
								<h2 className={styles.sidebarTitle}>Files</h2>
								<FileSelector
									fileGroups={getFileGroups()}
									currentFile={fileName}
									onFileSelect={setFileName}
								/>
							</div>
							<div className={styles.mainContent}>{mainContent}</div>
							{outputContent}
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className={styles.editor}>
				<div className={styles.sidebar}>
					<FileSelector
						fileGroups={getFileGroups()}
						currentFile={fileName}
						onFileSelect={setFileName}
					/>
				</div>
				<div className={styles.mainContent}>{mainContent}</div>
				{outputContent}
			</div>
		);
	};

	return renderContent();
};

export default EditorScreen;
