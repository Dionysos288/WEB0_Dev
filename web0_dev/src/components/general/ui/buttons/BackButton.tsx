'use client';

import ArrowLeft from '@/svgs/Arrow-Left';
import styles from './BackButton.module.scss';

const BackButton = () => {
	return (
		<button className={styles.button} onClick={() => window.history.back()}>
			<ArrowLeft fill="var(--whiteSpecial)" width="14" height="14" />
			<span>Go Back</span>
		</button>
	);
};

export default BackButton;
