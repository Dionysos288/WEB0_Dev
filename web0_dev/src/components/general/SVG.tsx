import React from 'react';
import styles from './SVG.module.scss';

const SVG = ({
	children,
	...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) => {
	return (
		<button className={styles.button} {...props}>
			{children}
		</button>
	);
};

export default SVG;
