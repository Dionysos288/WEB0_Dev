import React from 'react';
import styles from './Toolbar.module.scss';
import SVG from '@/components/general/SVG';
import Dismiss from '@/svgs/Dismiss';

export interface ToolbarAction {
	label: string;
	icon: React.ComponentType<{
		width?: string;
		height?: string;
		fill?: string;
	}>;
	onClick: () => void;
	variant?: 'default' | 'danger';
}

interface ToolbarProps {
	selectedCount: number;
	onClearSelection: () => void;
	actions: ToolbarAction[];
	children?: React.ReactNode;
}

const Toolbar: React.FC<ToolbarProps> = ({
	selectedCount,
	onClearSelection,
	actions,
	children,
}) => {
	if (selectedCount === 0) return null;

	return (
		<div className={styles.toolbar}>
			{children}
			<div className={styles.toolbarContent}>
				<div className={styles.selectedCount}>
					{selectedCount} selected
					<SVG onClick={onClearSelection} style={{ marginLeft: '-4px' }}>
						<Dismiss width="14" height="14" fill="var(--main-75)" />
					</SVG>
				</div>
				<div className={styles.actions}>
					{actions.map((action, index) => (
						<button
							key={index}
							onClick={action.onClick}
							className={action.variant === 'danger' ? styles.dangerButton : ''}
						>
							<action.icon width="16" height="16" />
							<span>{action.label}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default Toolbar;
