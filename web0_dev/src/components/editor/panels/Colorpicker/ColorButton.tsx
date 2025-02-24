import { memo, useCallback } from 'react';
import styles from './ColorButton.module.scss';

export type ColorButtonProps = {
	color?: string;
	active?: boolean;
	onColorChange?: (color: string) => void;
};

export const ColorButton = memo(
	({ color, active, onColorChange }: ColorButtonProps) => {
		const wrapperClassName = [styles.wrapper, active && styles.active]
			.filter(Boolean)
			.join(' ');

		const bubbleClassName = [styles.bubble, active && styles.active]
			.filter(Boolean)
			.join(' ');

		const handleClick = useCallback(() => {
			if (onColorChange) {
				onColorChange(color || '');
			}
		}, [onColorChange, color]);

		return (
			<button onClick={handleClick} className={wrapperClassName}>
				<div
					style={{ backgroundColor: color, color: color }}
					className={bubbleClassName}
				></div>
			</button>
		);
	}
);

ColorButton.displayName = 'ColorButton';
