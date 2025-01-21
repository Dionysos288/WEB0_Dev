'use client';

import { ArrowLeft } from '@/svgs';
import styles from './BackButton.module.scss';

const BackButton = () => {
	return (
		<button className={styles.button} onClick={() => window.history.back()}>
			<ArrowLeft style={{ fill: 'white' }} />
			<span>Go Back</span>
		</button>
	);
};

export default BackButton;
