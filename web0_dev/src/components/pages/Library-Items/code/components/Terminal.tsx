import React, { useState } from 'react';
import styles from '../EditorScreen.module.scss';
import { CompilationResult } from '../types';

interface TerminalProps {
	output: { text: string; className?: string }[];
	setOutput: React.Dispatch<
		React.SetStateAction<{ text: string; className?: string }[]>
	>;
	isAwaitingInput: boolean;
	sendInput: (input: string) => void;
	prompt?: string;
	runPython?: (input: string) => Promise<void>;
	runCSharp?: (input: string) => Promise<CompilationResult>;
	inputs?: string[];
	setInputs?: (inputs: string[]) => void;
}

const Terminal: React.FC<TerminalProps> = ({
	output,
	setOutput,
	isAwaitingInput,

	inputs = [],
	setInputs = () => {},
}) => {
	const [currentInput, setCurrentInput] = useState('');

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && currentInput.trim()) {
			setInputs([...inputs, currentInput.trim()]);
			setCurrentInput('');
		}
	};

	const handleRemoveInput = (index: number) => {
		setInputs(inputs.filter((_, i) => i !== index));
	};

	const handleClearInputs = () => {
		setInputs([]);
	};

	const handleClear = () => {
		setOutput([]);
	};

	return (
		<div className={styles.terminal}>
			<div className={styles.header}>
				<div className={styles.title}>Terminal Output</div>
				<button onClick={handleClear} className={styles.clearButton}>
					Clear
				</button>
			</div>
			<div className={styles.content}>
				<pre>
					{output.length === 0 && !isAwaitingInput ? (
						<code className={styles.welcomeMessage}>
							Press &quot;Run&quot; to start...
						</code>
					) : (
						output.map((line, i) => {
							const cn = line.className;
							return (
								<code key={i} className={cn ? styles[cn] : undefined}>
									{line.text}
								</code>
							);
						})
					)}
				</pre>
			</div>
			<div className={styles.inputs}>
				<div className={styles.notesHeader}>
					<div className={styles.title}>Program Inputs</div>
					<button onClick={handleClearInputs} className={styles.clearButton}>
						Clear All
					</button>
				</div>
				<div className={styles.inputsList}>
					{inputs.map((input, index) => (
						<div key={index} className={styles.inputItem}>
							<span>{input}</span>
							<button
								onClick={() => handleRemoveInput(index)}
								className={styles.removeButton}
							>
								×
							</button>
						</div>
					))}
				</div>
				<div className={styles.inputWrapper}>
					<input
						type="text"
						value={currentInput}
						onChange={(e) => setCurrentInput(e.target.value)}
						onKeyDown={handleInputKeyDown}
						className={styles.input}
						placeholder="Add an input (press Enter)..."
					/>
				</div>
			</div>
		</div>
	);
};

export default Terminal;
