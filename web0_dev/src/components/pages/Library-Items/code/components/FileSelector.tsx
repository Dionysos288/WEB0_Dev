import React from 'react';
import styles from '../EditorScreen.module.scss';

interface FileOption {
	name: string;
	type: string;
	description?: string;
}

interface FileGroup {
	[key: string]: FileOption[];
}

interface FileSelectorProps {
	fileGroups: FileGroup;
	currentFile: string;
	onFileSelect: (fileName: string) => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({
	fileGroups,
	currentFile,
	onFileSelect,
}) => {
	return (
		<div className={styles.fileSelectors}>
			{Object.entries(fileGroups).map(([groupName, groupFiles]) => (
				<div key={groupName} className={styles.fileGroup}>
					<h6 className={styles.groupTitle}>
						{groupName == 'cpp' ? 'C++' : groupName}
					</h6>
					{groupFiles.map((file: FileOption) => (
						<button
							key={file.name}
							onClick={() => onFileSelect(file.name)}
							className={
								currentFile === file.name
									? `${styles.selector} ${styles.active}`
									: styles.selector
							}
							title={file.description}
						>
							<h6>{file.name}</h6>
						</button>
					))}
				</div>
			))}
		</div>
	);
};

export default FileSelector;
