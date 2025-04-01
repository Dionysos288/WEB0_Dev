import styles from './CommentPopup.module.scss';
import Spacing from '../../Spacing';

const CommentPopup = ({
	setOpen,
	title,
	description,
	buttonCancelText = 'Cancel',
	buttonText,
	buttonAction,
}: {
	setOpen: (open: boolean) => void;
	title: string;
	description: string;
	buttonCancelText?: string;
	buttonText: string;
	buttonAction: () => void;
}) => {
	return (
		<div className={styles.leaveWorkspaceModal}>
			<div className={styles.popup}>
				<h2>{title}</h2>
				<Spacing space={14} />
				<p>{description}</p>
				<Spacing space={22} />
				<div className={styles.popupButtons}>
					<button
						className={styles.cancelButton}
						onClick={() => setOpen(false)}
					>
						{buttonCancelText}
					</button>
					<button className={styles.createButton} onClick={buttonAction}>
						{buttonText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CommentPopup;
