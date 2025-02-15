import React from 'react';
import styles from '../EditorScreen.module.scss';
import ClipboardText from '@/svgs/ClipboardText';
import SVG from '@/components/general/SVG';

interface ToolbarProps {
	isRunning: boolean;
	onRun: () => void;
	showRunButton: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
	isRunning,
	onRun,
	showRunButton,
}) => {
	return (
		<div className={styles.toolbar}>
			<SVG>
				<ClipboardText width="20" height="20" fill="var(--whiteSpecial)" />
			</SVG>
			{showRunButton && (
				<button
					onClick={onRun}
					disabled={isRunning}
					className={styles.runButton}
				>
					{isRunning ? 'Running...' : 'Run'}
				</button>
			)}
		</div>
	);
};

export default Toolbar;
