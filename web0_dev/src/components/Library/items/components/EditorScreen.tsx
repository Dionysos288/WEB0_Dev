'use client';
import styles from './EditorScreen.module.scss';
import { Palette, Clipboard } from '@/svgs';
import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
// import { transform } from '@babel/standalone';
import files from '@/Data/Files';
interface EditorScreenProps {
	fullscreen?: boolean;
}

const EditorScreen: React.FC<EditorScreenProps> = ({ fullscreen }) => {
	const editorRef = useRef<HTMLDivElement | null>(null);
	const [fileName, setFileName] = useState<string>('App.jsx');
	// @ts-expect-error error
	const file = files[fileName];
	//  const iframeRef = useRef<HTMLIFrameElement | null>(null);
	// const [Allfiles, setAllFiles] = useState(files);

	useEffect(() => {
		editorRef.current?.focus();
	}, [file.name]);

	// const handleChange = (value = '') => {
	// 	setAllFiles((prev) => ({
	// 		...prev,
	// 		[fileName]: { ...prev[fileName], value },
	// 	}));
	// };
	// const compileAndRun = () => {
	// 	const cssFiles = Object.values(files).filter((f) => f.language === 'css');
	// 	const jsFiles = Object.values(files).filter((f) => f.language !== 'css');

	// 	// Combine all CSS into one string
	// 	const combinedCSS = cssFiles.map((f) => f.value).join('\n');

	// 	// Transform each JS/JSX/TS/TSX file with Babel
	// 	let combinedCode = '';
	// 	jsFiles.forEach((file) => {
	// 		try {
	// 			const { code } = transform(file.value, {
	// 				presets: ['env', 'react', 'typescript'],
	// 			});
	// 			combinedCode += code + '\n';
	// 		} catch (err) {
	// 			combinedCode += `console.error(${JSON.stringify(String(err))});\n`;
	// 		}
	// 	});

	// 	// Create an HTML blob for iframe
	// 	const tailwindLink = jsFiles.some((f) => f.tailwind)
	// 		? '<link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.2/dist/tailwind.min.css" rel="stylesheet" />'
	// 		: '';

	// 	const html = `
	//   <!DOCTYPE html>
	//   <html>
	//     <head>
	//       ${tailwindLink}
	//       <style>${combinedCSS}</style>
	//     </head>
	//     <body>
	//       <div id="root"></div>
	//       <script>
	//         // Provide React & ReactDOM in global scope if needed
	//         window.React = {createElement: ()=>{}};
	//         window.ReactDOM = { render: ()=>{} };
	//       </script>
	//       <script>${combinedCode}</script>
	//     </body>
	//   </html>
	// `;

	// 	// Write to iframe
	// 	const iframe = iframeRef.current;
	// 	if (iframe) {
	// 		const doc = iframe.contentDocument;
	// 		if (doc) {
	// 			doc.open();
	// 			doc.write(html);
	// 			doc.close();
	// 		}
	// 	}
	// };

	return (
		<div>
			{/* <button onClick={compileAndRun}>Run</button> */}

			{fullscreen ? (
				<div className={styles.editorfull}>
					<div className={styles.backGround}>
						<button className={styles.abs}>
							<Clipboard />
						</button>
						<div className={styles.topSide}>
							<button
								onClick={() => setFileName('App.jsx')}
								className={
									fileName === 'App.jsx'
										? `${styles.selector} ${styles.active}`
										: styles.selector
								}
							>
								<h6>JSX</h6>
							</button>
							<button
								onClick={() => setFileName('styles.css')}
								className={
									fileName === 'styles.css'
										? `${styles.selector} ${styles.active}`
										: styles.selector
								}
							>
								<h6>CSS</h6>
							</button>
						</div>
						<Editor
							height={'calc(60vh - 36px)'}
							theme="vs-dark"
							path={file.name}
							defaultLanguage={file.language}
							defaultValue={file.value}
							onMount={(editor) => (editorRef.current = editor)}
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
					</div>
				</div>
			) : (
				<div className={styles.editor}>
					<div className={styles.leftSide}>
						{/* <iframe ref={iframeRef} style={{ width: '100%', height: '100%' }} /> */}

						<div className={styles.colorPicker}>
							<p>#F79F9B</p>
							<button>
								<Palette fill={'var(--orange-90)'} opacity={'0.9'} />
							</button>
						</div>
					</div>
					<div className={styles.rightSide}>
						<button className={styles.abs}>
							<Clipboard />
						</button>
						<div className={styles.topSide}>
							<button
								onClick={() => setFileName('App.jsx')}
								className={
									fileName === 'App.jsx'
										? `${styles.selector} ${styles.active}`
										: styles.selector
								}
							>
								<h6>JSX</h6>
							</button>
							<button
								onClick={() => setFileName('styles.css')}
								className={
									fileName === 'styles.css'
										? `${styles.selector} ${styles.active}`
										: styles.selector
								}
							>
								<h6>CSS</h6>
							</button>
						</div>

						<Editor
							height={'calc(60vh - 36px)'}
							theme="vs-dark"
							path={file.name}
							defaultLanguage={file.language}
							defaultValue={file.value}
							onMount={(editor) => (editorRef.current = editor)}
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
					</div>
				</div>
			)}
		</div>
	);
};

export default EditorScreen;
