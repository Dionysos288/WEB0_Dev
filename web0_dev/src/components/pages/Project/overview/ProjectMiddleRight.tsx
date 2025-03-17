'use client';

import styles from './ProjectMiddleRight.module.scss';
import { File, Project } from '@prisma/client';
import GetFileSize from '@/utils/GetFileSize';
import Spacing from '@/components/general/Spacing';
import { getTimeAgo } from '@/utils/DateHooks';
import FilePdf from '@/svgs/FilePdf';
import { downloadFile } from '@/utils/fileUtils';

type projectWithFile = Project & {
	files: File[];
};

const ProjectMiddleRight = ({ project }: { project: projectWithFile }) => {
	const handleFileClick = (file: File) => {
		downloadFile(file.url, file.name);
	};

	return (
		<div className={styles.FilesWrapper}>
			<div>
				<h2>Latest Files</h2>
				<Spacing space={16} />
				{project.files.length > 0 ? (
					<div className={styles.files}>
						{project.files.map((file) => (
							<div
								className={styles.hor}
								key={file.id}
								onClick={() => handleFileClick(file)}
								style={{ cursor: 'pointer' }}
							>
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
