import React, { useRef, useEffect, useState } from 'react';
import styles from '../EditorScreen.module.scss';

interface TerminalProps {
	output: string;
	inputs: string[];
	onInputSubmit: (input: string) => void;
	onClear: () => void;
	onClearHistory: () => void;
	onAddNote: (note: string) => void;
	waitingForInput: boolean;
}

const Terminal: React.FC<TerminalProps> = ({
	output,
	inputs,
	onInputSubmit,
	onClear,
	onClearHistory,
	onAddNote,
	waitingForInput,
}) => {
	const [noteInput, setNoteInput] = useState('');
	const [terminalInput, setTerminalInput] = useState('');
	const terminalRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [output, inputs]);

	useEffect(() => {
		if (waitingForInput && inputRef.current) {
			inputRef.current.focus();
		}
	}, [waitingForInput]);

	const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && terminalInput.trim()) {
			onInputSubmit(terminalInput);
			setTerminalInput('');
		}
	};

	const handleNoteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && noteInput.trim()) {
			onAddNote(noteInput);
			setNoteInput('');
		}
	};

	return (
		<div className={styles.terminal}>
			<div className={styles.header}>
				<div className={styles.title}>Terminal Output</div>
				<button onClick={onClear} className={styles.clearButton}>
					Clear
				</button>
			</div>
			<div className={styles.content} ref={terminalRef}>
				<pre>{output}</pre>
				{waitingForInput && (
					<div className={styles.inputWrapper}>
						<input
							ref={inputRef}
							type="text"
							value={terminalInput}
							onChange={(e) => setTerminalInput(e.target.value)}
							onKeyDown={handleTerminalKeyDown}
							className={styles.input}
							placeholder="Enter your input..."
						/>
					</div>
				)}
			</div>
			<div className={styles.notes}>
				<div className={styles.notesHeader}>
					<div className={styles.title}>Notes</div>
					<button onClick={onClearHistory} className={styles.clearButton}>
						Clear
					</button>
				</div>
				<div className={styles.notesList}>
					{inputs.map((input, index) => (
						<div key={index} className={styles.noteItem}>
							{input}
						</div>
					))}
				</div>
				<div className={styles.inputWrapper}>
					<input
						type="text"
						value={noteInput}
						onChange={(e) => setNoteInput(e.target.value)}
						onKeyDown={handleNoteKeyDown}
						className={styles.input}
						placeholder="Add a note..."
					/>
				</div>
			</div>
		</div>
	);
};

export default Terminal;
