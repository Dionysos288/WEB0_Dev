import styles from './NoteHeader.module.scss';
const NoteHeader = ({
	title,
	description,
}: {
	title: string;
	description?: string;
}) => {
	return (
		<div className={styles.wrapper}>
			<h2>{title}</h2>
			<p>{description}</p>
		</div>
	);
};

export default NoteHeader;
