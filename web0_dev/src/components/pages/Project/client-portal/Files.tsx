import Spacing from '@/components/General/Spacing';
import styles from './Files.module.scss';
import { File } from '@prisma/client';
import Link from 'next/link';
import PlusFilled from '@/svgs/Plus-Filled';
import Document from '@/svgs/Document';
type fileType = Omit<File, 'size'> & { size: number };
const Files = ({ files }: { files: fileType[] }) => {
	return (
		<>
			<h2 className={styles.title}>Files</h2>
			<Spacing space={12} />
			<div className={styles.files}>
				{files.map((file) => (
					<Link
						href={file.url}
						key={file.id}
						className={styles.file}
						target="_blank"
						rel="noopener noreferrer"
					>
						<div className={styles.topSide}>
							<h3>{file.name}</h3>

							<Document fill={'var(--main-90)'} width="22" height="22" />
						</div>
						<p className={styles.description}>{file.description}</p>
					</Link>
				))}
				<button className={styles.fileAdd}>
					<PlusFilled fill={'var(--main-80)'} width="16" height="16" />
					<span>New Item</span>
				</button>
			</div>
		</>
	);
};

export default Files;
