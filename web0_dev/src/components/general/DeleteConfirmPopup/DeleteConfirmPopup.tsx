import React from 'react';
import styles from './DeleteConfirmPopup.module.scss';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';
import Spacing from '../Spacing';

interface DeleteConfirmPopupProps {
	onConfirm: () => void;
	onCancel: () => void;
	title?: string;
	message?: string;
}

const DeleteConfirmPopup: React.FC<DeleteConfirmPopupProps> = ({
	onConfirm,
	onCancel,
	title = 'Are you sure?',
	message = 'This action cannot be undone.',
}) => {
	return (
		<div className={styles.deleteConfirmWrapper}>
			<ClickOutsideWrapper onClose={onCancel}>
				<div className={styles.deleteConfirm}>
					<h3>{title}</h3>
					<Spacing space={4} />
					<p>{message}</p>
					<Spacing space={16} />
					<div className={styles.deleteActions}>
						<button className={styles.cancelButton} onClick={onCancel}>
							Cancel
						</button>
						<button className={styles.confirmButton} onClick={onConfirm}>
							Delete
						</button>
					</div>
				</div>
			</ClickOutsideWrapper>
		</div>
	);
};

export default DeleteConfirmPopup;
