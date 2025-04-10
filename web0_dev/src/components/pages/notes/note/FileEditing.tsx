import styles from './FileEditing.module.scss';
import Spacing from '@/components/general/Spacing';
import Document from '@/svgs/Document';
import Figma from '@/svgs/Figma';
import { Note } from '@prisma/client';
const FileEditing = ({ note }: { note: Note }) => {
	console.log(note);
	return (
		<>
			<div className={styles.wrapper}>
				<p>Start To Write Drag from bottom to integrate things</p>
			</div>
			<Spacing space={28} />
			<div className={styles.toolbarWrapper}>
				<div className={styles.leftSide}>
					<button className={styles.groupSvg}>
						<span>H1</span>
					</button>
					<button className={styles.groupSvg}>
						<span>H2</span>
					</button>
					<button className={styles.groupSvg}>
						<span>H3</span>
					</button>
					<button className={styles.groupSvg}>
						<span>H4</span>
					</button>
					<button className={styles.groupSvg}>
						<span>H5</span>
					</button>
					<button className={styles.groupSvg}>
						<span>H6</span>
					</button>
					<button className={styles.groupSvg}>
						<span>P</span>
					</button>

					<div className={styles.line} />

					<button className={styles.groupSvg}>
						<Figma fill="var(--main)" width="25" height="25" />
						<span>Figma</span>
					</button>

					<button className={styles.groupSvg}>
						<Document fill="var(--main)" width="25" height="25" />
						<span>File</span>
					</button>
				</div>
				<button className={styles.addButton}>
					<span>Save Note</span>
				</button>
			</div>
		</>
	);
};

export default FileEditing;
