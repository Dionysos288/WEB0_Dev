import React, { useState } from 'react';
import styles from './Toolbar.module.scss';
import Dismiss from '@/svgs/Dismiss';
import DeleteConfirmPopup from '@/components/general/DeleteConfirmPopup/DeleteConfirmPopup';

export interface ToolbarAction {
	label: string;
	icon: React.ComponentType<{
		width?: string;
		height?: string;
		fill?: string;
	}>;
	onClick: () => void;
	variant?: 'default' | 'danger';
	dropdown?: React.ReactNode;
	isOpen?: boolean;
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
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [actionToConfirm, setActionToConfirm] = useState<ToolbarAction | null>(
		null
	);

	if (selectedCount === 0) return null;

	const handleActionClick = (action: ToolbarAction) => {
		if (action.variant === 'danger') {
			setActionToConfirm(action);
			setShowDeleteConfirm(true);
		} else {
			action.onClick();
		}
	};

	const handleConfirmDelete = () => {
		if (actionToConfirm) {
			actionToConfirm.onClick();
			onClearSelection();
		}
		setShowDeleteConfirm(false);
		setActionToConfirm(null);
	};

	const handleCancelDelete = () => {
		setShowDeleteConfirm(false);
		setActionToConfirm(null);
	};

	return (
		<div className={styles.toolbar}>
			{children}
			<div className={styles.toolbarContent}>
				<div className={styles.selectedCount}>
					{selectedCount} selected
					<div onClick={onClearSelection} style={{ marginLeft: '-4px' }}>
						<Dismiss width="14" height="14" fill="var(--main-75)" />
					</div>
				</div>
				<div className={styles.actions}>
					{actions.map((action, index) => (
						<div key={index} className={styles.actionWrapper}>
							<button
								onClick={() => handleActionClick(action)}
								className={
									action.variant === 'danger' ? styles.dangerButton : ''
								}
							>
								<action.icon width="16" height="16" />
								<span>{action.label}</span>
							</button>
							{action.isOpen && action.dropdown && (
								<div className={styles.dropdown}>{action.dropdown}</div>
							)}
						</div>
					))}
				</div>
				{showDeleteConfirm && (
					<DeleteConfirmPopup
						onConfirm={handleConfirmDelete}
						onCancel={handleCancelDelete}
					/>
				)}
			</div>
		</div>
	);
};

export default Toolbar;
