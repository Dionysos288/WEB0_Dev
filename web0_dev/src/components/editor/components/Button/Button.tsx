import React from 'react';
import styles from './Button.module.scss';

export type ButtonVariant =
	| 'primary'
	| 'secondary'
	| 'tertiary'
	| 'quaternary'
	| 'ghost';
export type ButtonSize = 'medium' | 'small' | 'icon' | 'iconSmall';

export type ButtonProps = {
	variant?: ButtonVariant;
	active?: boolean;
	activeClassname?: string;
	buttonSize?: ButtonSize;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			active,
			buttonSize = 'medium',
			children,
			disabled,
			variant = 'primary',
			className,
			activeClassname,
			...rest
		},
		ref
	) => {
		const buttonClassName = [
			styles.button,
			styles[buttonSize],
			styles[variant],
			active && styles.active,
			active && activeClassname,
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<button
				ref={ref}
				disabled={disabled}
				className={buttonClassName}
				{...rest}
			>
				{children}
			</button>
		);
	}
);

Button.displayName = 'Button';
