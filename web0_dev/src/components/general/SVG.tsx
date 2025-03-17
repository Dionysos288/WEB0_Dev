import React from 'react';
import styles from './SVG.module.scss';

type SVGProps = {
	children: React.ReactNode;
	isButton?: boolean;
	onClick?: () => void;
} & (
	| React.ButtonHTMLAttributes<HTMLButtonElement>
	| React.HTMLAttributes<HTMLDivElement>
);

const SVG = ({ children, isButton = false, onClick, ...props }: SVGProps) => {
	if (isButton) {
		return (
			<button
				className={styles.button}
				onClick={onClick}
				{...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
			>
				{children}
			</button>
		);
	}

	return (
		<div
			className={styles.wrapper}
			{...(props as React.HTMLAttributes<HTMLDivElement>)}
		>
			{children}
		</div>
	);
};

export default SVG;
