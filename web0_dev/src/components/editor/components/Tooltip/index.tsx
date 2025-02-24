'use client';

import Tippy from '@tippyjs/react/headless';
import React, { useCallback, JSX } from 'react';
import { TippyProps, TooltipProps } from './types';
import styles from './Tooltip.module.scss';

const isMac =
	typeof window !== 'undefined'
		? navigator.platform.toUpperCase().indexOf('MAC') >= 0
		: false;

const ShortcutKey = ({ children }: { children: string }): JSX.Element => {
	if (children === 'Mod') {
		return <kbd className={styles.shortcutKey}>{isMac ? '⌘' : 'Ctrl'}</kbd>; // ⌃
	}

	if (children === 'Shift') {
		return <kbd className={styles.shortcutKey}>⇧</kbd>;
	}

	if (children === 'Alt') {
		return <kbd className={styles.shortcutKey}>{isMac ? '⌥' : 'Alt'}</kbd>;
	}

	return <kbd className={styles.shortcutKey}>{children}</kbd>;
};

export const Tooltip = ({
	children,
	enabled = true,
	title,
	shortcut,
	tippyOptions = {},
}: TooltipProps): JSX.Element => {
	const renderTooltip = useCallback(
		(attrs: TippyProps) => (
			<span
				className={styles.tooltip}
				tabIndex={-1}
				data-placement={attrs['data-placement']}
				data-reference-hidden={attrs['data-reference-hidden']}
				data-escaped={attrs['data-escaped']}
			>
				{title && <span className={styles.title}>{title}</span>}
				{shortcut && (
					<span className={styles.shortcutWrapper}>
						{shortcut.map((shortcutKey) => (
							<ShortcutKey key={shortcutKey}>{shortcutKey}</ShortcutKey>
						))}
					</span>
				)}
			</span>
		),
		[shortcut, title]
	);

	if (enabled) {
		return (
			<Tippy
				delay={500}
				offset={[0, 8]}
				touch={false}
				zIndex={99999}
				appendTo={document.body}
				{...tippyOptions}
				render={renderTooltip}
			>
				<span>{children}</span>
			</Tippy>
		);
	}

	return <>{children}</>;
};

export default Tooltip;
