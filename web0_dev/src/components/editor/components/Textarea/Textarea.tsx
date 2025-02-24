import { forwardRef } from 'react';
import styles from './Textarea.module.scss';

export const Textarea = forwardRef<
	HTMLTextAreaElement,
	React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...rest }, ref) => {
	const textAreaClassName = [styles.textarea, className]
		.filter(Boolean)
		.join(' ');

	return <textarea className={textAreaClassName} ref={ref} {...rest} />;
});

Textarea.displayName = 'Textarea';
