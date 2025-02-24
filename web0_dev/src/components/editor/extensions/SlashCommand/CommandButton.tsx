import { forwardRef } from 'react';
import { icons } from 'lucide-react';
import { Icon } from '@/components/editor/components/Icon';
import styles from './CommandButton.module.css';

export type CommandButtonProps = {
	active?: boolean;
	description: string;
	icon: keyof typeof icons;
	onClick: () => void;
	title: string;
};

export const CommandButton = forwardRef<HTMLButtonElement, CommandButtonProps>(
	({ active, icon, onClick, title }, ref) => {
		const wrapperClassName = `${styles.wrapper} ${active ? styles.active : ''}`;

		return (
			<button ref={ref} onClick={onClick} className={wrapperClassName}>
				<Icon name={icon} className={styles.icon} />
				<div className={styles.content}>
					<div className={styles.title}>{title}</div>
				</div>
			</button>
		);
	}
);

CommandButton.displayName = 'CommandButton';
