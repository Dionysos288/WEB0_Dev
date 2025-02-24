import React from 'react';
import styles from './Dropdown.module.scss';

export const DropdownCategoryTitle = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return <div className={styles.categoryTitle}>{children}</div>;
};

export const DropdownButton = React.forwardRef<
	HTMLButtonElement,
	{
		children: React.ReactNode;
		isActive?: boolean;
		onClick?: () => void;
		disabled?: boolean;
		className?: string;
	}
>(function DropdownButtonInner(
	{ children, isActive, onClick, disabled, className },
	ref
) {
	const buttonClass = [styles.button, isActive && styles.active, className]
		.filter(Boolean)
		.join(' ');

	return (
		<button
			className={buttonClass}
			disabled={disabled}
			onClick={onClick}
			ref={ref}
		>
			{children}
		</button>
	);
});
