import Spacing from '@/components/General/Spacing';
import { fileType } from '../../../types/types';
import styles from './Files.module.scss';
import { Document } from '@/svgs';
import { PlusSpecial } from '@/svgs';
const Files = ({ files }: { files: fileType[] }) => {
	return (
		<>
			<h2 className={styles.title}>Files</h2>
			<Spacing space={12} />
			<div className={styles.files}>
				{files.map((file) => (
					<div key={file.id} className={styles.file}>
						<div className={styles.topSide}>
							<h3>{file.name}</h3>

							<Document fill={'var(--main)'} opacity={'0.9'} />
						</div>
						<p className={styles.description}>{file.description}</p>
					</div>
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
