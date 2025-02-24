import React, { ButtonHTMLAttributes, HTMLProps, forwardRef } from 'react';
import { Surface } from './Surface';
import { Button, ButtonProps } from './Button/Button';
import Tooltip from './Tooltip';
import styles from './Toolbar.module.scss';

export type ToolbarWrapperProps = {
	shouldShowContent?: boolean;
	isVertical?: boolean;
} & HTMLProps<HTMLDivElement>;

const ToolbarWrapper = forwardRef<HTMLDivElement, ToolbarWrapperProps>(
	(
		{
			shouldShowContent = true,
			children,
			isVertical = false,
			className,
			...rest
		},
		ref
	) => {
		const toolbarClassName = [
			styles.toolbar,
			isVertical ? styles.vertical : styles.horizontal,
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			shouldShowContent && (
				<Surface className={toolbarClassName} {...rest} ref={ref}>
					{children}
				</Surface>
			)
		);
	}
);

ToolbarWrapper.displayName = 'Toolbar';

export type ToolbarDividerProps = {
	horizontal?: boolean;
} & HTMLProps<HTMLDivElement>;

const ToolbarDivider = forwardRef<HTMLDivElement, ToolbarDividerProps>(
	({ horizontal, className, ...rest }, ref) => {
		const dividerClassName = [
			styles.divider,
			horizontal ? styles.horizontal : styles.vertical,
			className,
		]
			.filter(Boolean)
			.join(' ');

		return <div className={dividerClassName} ref={ref} {...rest} />;
	}
);

ToolbarDivider.displayName = 'Toolbar.Divider';

export type ToolbarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	active?: boolean;
	activeClassname?: string;
	tooltip?: string;
	tooltipShortcut?: string[];
	buttonSize?: ButtonProps['buttonSize'];
	variant?: ButtonProps['variant'];
};

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
	(
		{
			children,
			buttonSize = 'icon',
			variant = 'ghost',
			className,
			tooltip,
			tooltipShortcut,
			activeClassname,
			...rest
		},
		ref
	) => {
		const buttonClass = [styles.button, className].filter(Boolean).join(' ');

		const content = (
			<Button
				activeClassname={activeClassname}
				className={buttonClass}
				variant={variant}
				buttonSize={buttonSize}
				ref={ref}
				{...rest}
			>
				{children}
			</Button>
		);

		if (tooltip) {
			return (
				<Tooltip title={tooltip} shortcut={tooltipShortcut}>
					{content}
				</Tooltip>
			);
		}

		return content;
	}
);

ToolbarButton.displayName = 'ToolbarButton';

export const Toolbar = {
	Wrapper: ToolbarWrapper,
	Divider: ToolbarDivider,
	Button: ToolbarButton,
};
