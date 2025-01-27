'use client';
import { PlusSpecial } from '@/svgs';
import styles from './AddProject.module.scss';
import { useState } from 'react';
import AddProjectPopUp from './AddProjectPopup';
const AddProject = () => {
	const [isOpen, setIsopen] = useState(false);
	return (
		<>
			<button className={styles.addProject} onClick={() => setIsopen(!isOpen)}>
				<PlusSpecial fill={'var(--black)'} />
				<span>New Project</span>
			</button>
			<AddProjectPopUp isOpen={isOpen} setIsopen={setIsopen} />
		</>
	);
};

export default AddProject;
