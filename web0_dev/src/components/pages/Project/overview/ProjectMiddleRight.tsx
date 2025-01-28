import styles from './ProjectMiddleRight.module.scss';
import { File, Project } from '@prisma/client';
import GetFileSize from '@/utils/GetFileSize';
import Spacing from '@/components/General/Spacing';
import { getTimeAgo } from '@/utils/DateHooks';
import FilePdf from '@/svgs/FilePdf';
type projectWithFile = Omit<Project, 'budget'> & {
	budget: number;
	Files: (Omit<File, 'size'> & { size: number })[];
};
const ProjectMiddleRight = ({ project }: { project: projectWithFile }) => {
	return (
		<div className={styles.FilesWrapper}>
			<div>
				<h2>Latest Files</h2>
				<Spacing space={16} />
				{project.Files.length > 0 ? (
					<div className={styles.files}>
						{project.Files.map((file) => (
							<div className={styles.hor} key={file.id}>
								<div
									className={styles.block}
									style={{ backgroundColor: '#e8b594' }}
								>
									<FilePdf fill="var(--main)" width="16" height="16" />
								</div>
								<div className={styles.vert}>
									<h3>{file.name}</h3>
									<p>
										{GetFileSize(Number(file.size))} /{' '}
										{getTimeAgo(String(file.updatedAt))} / {file.uploader}
									</p>
								</div>
							</div>
						))}
					</div>
				) : (
					<></>
				)}
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
