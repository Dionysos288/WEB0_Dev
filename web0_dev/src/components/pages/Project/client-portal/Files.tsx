'use client';
import Spacing from '@/components/general/Spacing';
import styles from './Files.module.scss';
import { File } from '@prisma/client';
import PlusFilled from '@/svgs/Plus-Filled';
import Document from '@/svgs/Document';
import { downloadFile } from '@/utils/fileUtils';

type fileType = Omit<File, 'size'> & { size: number };

const Files = ({ files }: { files: fileType[] }) => {
	const handleFileClick = (file: fileType, e: React.MouseEvent) => {
		e.preventDefault();
		downloadFile(file.url, file.name);
	};

	return (
		<>
			<h2 className={styles.title}>Files</h2>
			<Spacing space={12} />
			<div className={styles.files}>
				{files.map((file) => (
					<div
						key={file.id}
						className={styles.file}
						onClick={(e) => handleFileClick(file, e)}
						style={{ cursor: 'pointer' }}
					>
						<div className={styles.topSide}>
							<h3>{file.name}</h3>
							<Document fill={'var(--main-90)'} width="22" height="22" />
						</div>
						<p className={styles.description}>{file.description}</p>
					</div>
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
