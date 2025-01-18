import { Topfile } from '@/svgs';
import styles from './ProjectMiddleRight.module.scss';
const ProjectMiddleRight = () => {
	return (
		<div className={styles.FilesWrapper}>
			<h2>Latest Files</h2>
			<div className={styles.files}>
				<div className={styles.hor}>
					<div className={styles.block} style={{ backgroundColor: '#e8b594' }}>
						<Topfile
							style={{
								fill: '#484643',
							}}
						/>
					</div>
					<div className={styles.vert}>
						<h3>Project tech requirements.pdf</h3>
						<p>2.3 MB / 59 minutes ago / Marcus Blake</p>
					</div>
				</div>
				<div className={styles.hor}>
					<div className={styles.block} style={{ backgroundColor: '#EDE9DD' }}>
						<Topfile
							style={{
								fill: '#484643',
								margin: '4px ',
								position: 'absolute',
								transform: 'translatex(0.5px) ',
							}}
						/>
					</div>
					<div className={styles.vert}>
						<h3>Create Project Wireframes.xls</h3>
						<p>2.3 MB / 59 minutes ago / Marcus Blake</p>
					</div>
				</div>
				<div className={styles.hor}>
					<div className={styles.block} style={{ backgroundColor: '#e8b594' }}>
						<Topfile
							style={{
								fill: '#484643',
								margin: '4px ',
								position: 'absolute',
								transform: 'translatex(0.5px) ',
							}}
						/>
					</div>
					<div className={styles.vert}>
						<h3>Completed Project Stylings.pdf</h3>
						<p>2.3 MB / 59 minutes ago / Marcus Blakeo</p>
					</div>
				</div>
				<div className={styles.hor}>
					<div className={styles.block} style={{ backgroundColor: '#EDE9DD' }}>
						<Topfile
							style={{
								fill: '#484643',
								margin: '4px ',
								position: 'absolute',
								transform: 'translatex(0.5px) ',
							}}
						/>
					</div>
					<div className={styles.vert}>
						<h3>Create FureStibe branding proposal.zip</h3>
						<p>2.3 MB / 59 minutes ago / Marcus Blake</p>
					</div>
				</div>
				<div className={styles.hor}>
					<div className={styles.block} style={{ backgroundColor: '#EDE9DD' }}>
						<Topfile
							style={{
								fill: '#484643',
								margin: '4px ',
								position: 'absolute',
								transform: 'translatex(0.5px) ',
							}}
						/>
					</div>
					<div className={styles.vert}>
						<h3>Create FureStibe branding proposal.zip</h3>
						<p>2.3 MB / 59 minutes ago / Marcus Blake</p>
					</div>
				</div>
				<div className={styles.hor}>
					<div className={styles.block} style={{ backgroundColor: '#EDE9DD' }}>
						<Topfile
							style={{
								fill: '#484643',
								position: 'absolute',
								transform: 'translatex(0.5px) ',
							}}
						/>
					</div>
					<div className={styles.vert}>
						<h3>Create FureStibe branding proposal.zip</h3>
						<p>2.3 MB / 59 minutes ago / Marcus Blake</p>
					</div>
				</div>
			</div>
			<div className={styles.drop}>
				<div>
					<p>Drop files here or upload files</p>
					<button>
						<span>Upload</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProjectMiddleRight;
