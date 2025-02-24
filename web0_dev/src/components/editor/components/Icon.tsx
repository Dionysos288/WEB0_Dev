import { icons } from 'lucide-react';
import { memo } from 'react';
import styles from './Icon.module.scss';

export type IconProps = {
	name: keyof typeof icons;
	className?: string;
	strokeWidth?: number;
};

export const Icon = memo(({ name, className, strokeWidth }: IconProps) => {
	const IconComponent = icons[name];

	if (!IconComponent) {
		return null;
	}

	const iconClass = [styles.icon, className].filter(Boolean).join(' ');

	return (
		<IconComponent className={iconClass} strokeWidth={strokeWidth || 2.5} />
	);
});

Icon.displayName = 'Icon';
