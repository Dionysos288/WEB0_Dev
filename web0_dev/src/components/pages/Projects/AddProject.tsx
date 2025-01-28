'use client';
import styles from './AddProject.module.scss';
import { useState } from 'react';
import AddProjectPopUp from './AddProjectPopup';
import PlusFilled from '@/svgs/Plus-Filled';
const AddProject = () => {
	const [isOpen, setIsopen] = useState(false);
	return (
		<>
			<button className={styles.addProject} onClick={() => setIsopen(!isOpen)}>
				<PlusFilled fill={'var(--main)'} width="16" height="16" />
				<span>New Project</span>
			</button>
			<AddProjectPopUp isOpen={isOpen} setIsopen={setIsopen} />
		</>
	);
};

export default AddProject;
