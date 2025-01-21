import Spacing from '@/components/General/Spacing';
import styles from './Files.module.scss';
import { Document } from '@/svgs';
import { PlusSpecial } from '@/svgs';
import { File } from '@prisma/client';
import Link from 'next/link';
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

							<Document fill={'var(--main)'} opacity={'0.9'} />
						</div>
						<p className={styles.description}>{file.description}</p>
					</Link>
				))}
				<button className={styles.fileAdd}>
					<PlusSpecial fill={'var(--main)'} opacity={'0.9'} />
					<span>New Item</span>
				</button>
			</div>
		</>
	);
};

export default Files;
