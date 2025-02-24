import { HTMLProps, forwardRef } from 'react';
import styles from './Spinner.module.scss';

export const Spinner = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
	({ className, ...rest }, ref) => {
		const spinnerClass = [styles.spinner, className].filter(Boolean).join(' ');

		return <div className={spinnerClass} ref={ref} {...rest} />;
	}
);

Spinner.displayName = 'Spinner';
