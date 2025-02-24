import { createPortal } from 'react-dom';

import { LoaderProps, LoadingWrapperProps } from './types';
import styles from './Loader.module.scss';

const LoadingWrapper = ({ label }: LoadingWrapperProps) => {
	return (
		<div className={styles.wrapper}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={styles.spinner}
			>
				<path d="M21 12a9 9 0 1 1-6.219-8.56" />
			</svg>
			{label && <p className={styles.label}>{label}</p>}
		</div>
	);
};

export const Loader = ({ hasOverlay = true, label }: LoaderProps) => {
	return hasOverlay ? (
		createPortal(
			<div className={styles.overlay}>
				<LoadingWrapper label={label} />
			</div>,
			document.body
		)
	) : (
		<LoadingWrapper label={label} />
	);
};

export default Loader;
