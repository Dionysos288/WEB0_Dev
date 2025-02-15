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
import { PythonProvider, usePython } from 'react-py';

interface EditorScreenProps {
	fullscreen?: boolean;
}

// Set this to 'html' or 'react' or 'python' to switch between project types
const PROJECT_TYPE = 'python' as ProjectType;

const EditorContent: React.FC<{
	fileName: string;
	editorContent: FileContent;
	onEditorChange: (value: string | undefined) => void;
	onPythonOutput: (stdout: string, stderr: string, clear?: boolean) => void;
}> = ({ fileName, editorContent, onEditorChange, onPythonOutput }) => {
	const { runPython, stdout, stderr, isRunning } = usePython();
	const [lastStdout, setLastStdout] = useState<string>('');
	const [lastStderr, setLastStderr] = useState<string>('');

	useEffect(() => {
		if (stdout !== lastStdout) {
			setLastStdout(stdout);
			onPythonOutput(stdout, '');
		}
		if (stderr !== lastStderr) {
			setLastStderr(stderr);
			onPythonOutput('', stderr);
		}
	}, [stdout, stderr, lastStdout, lastStderr, onPythonOutput]);

	const handleRunPython = async () => {
		if (PROJECT_TYPE !== 'python') return;
		setLastStdout('');
		setLastStderr('');
		onPythonOutput('', '', true); // Clear output
		runPython(editorContent[fileName]);
	};

	return (
		<>
			<Toolbar
				isRunning={isRunning}
				onRun={handleRunPython}
				showRunButton={PROJECT_TYPE === 'python'}
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

	const [output, setOutput] = useState<string>('');
	const [inputs, setInputs] = useState<string[]>([]);
	const [previewHtml, setPreviewHtml] = useState<string>('');
	const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
	const [showColorInput, setShowColorInput] = useState(false);
	const colorInputRef = useRef<HTMLInputElement>(null);

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

	const handleClearTerminal = () => {
		setInputs([]);
		setOutput('');
	};

	const handleAddNote = (note: string) => {
		setInputs((prev) => [...prev, note]);
	};

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

	const handlePythonOutput = (
		stdout: string,
		stderr: string,
		clear?: boolean
	) => {
		if (clear) {
			setOutput('');
			return;
		}
		if (stdout || stderr) {
			setOutput((prev) => prev + stdout + (stderr ? `\nError: ${stderr}` : ''));
		}
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
		}

		return groups;
	};

	const renderContent = () => {
		const mainContent = (
			<PythonProvider>
				<EditorContent
					fileName={fileName}
					editorContent={editorContent}
					onEditorChange={handleEditorChange}
					onPythonOutput={handlePythonOutput}
				/>
			</PythonProvider>
		);

		const outputContent = (
			<div className={styles.outputContent}>
				{PROJECT_TYPE === 'python' ? (
					<Terminal
						output={output}
						inputs={inputs}
						onInputSubmit={(input) => {
							setOutput((prev) => prev + input + '\n');
						}}
						onClear={handleClearTerminal}
						onClearHistory={() => setInputs([])}
						onAddNote={handleAddNote}
						waitingForInput={false}
					/>
				) : (
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

	return <div>{renderContent()}</div>;
};

export default EditorScreen;
