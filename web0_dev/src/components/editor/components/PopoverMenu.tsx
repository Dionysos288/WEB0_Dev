import * as Popover from '@radix-ui/react-popover';
import { icons } from 'lucide-react';
import { forwardRef } from 'react';
import { Surface } from './Surface';
import { Toolbar } from './Toolbar';
import styles from './PopoverMenu.module.scss';

export const Trigger = Popover.Trigger;
export const Portal = Popover.Portal;

export type MenuProps = {
	children: React.ReactNode;
	trigger: React.ReactNode;
	triggerClassName?: string;
	customTrigger?: boolean;
	isOpen?: boolean;
	onOpenChange?: (state: boolean) => void;
	withPortal?: boolean;
	tooltip?: string;
	isActive?: boolean;
};

export const Menu = ({
	customTrigger,
	trigger,
	triggerClassName,
	children,
	isOpen,
	withPortal,
	tooltip,
	onOpenChange,
}: MenuProps) => {
	return (
		<Popover.Root onOpenChange={onOpenChange}>
			{customTrigger ? (
				<Trigger asChild>{trigger}</Trigger>
			) : (
				<Trigger asChild>
					<Toolbar.Button
						className={triggerClassName}
						tooltip={!isOpen ? tooltip : ''}
					>
						{trigger}
					</Toolbar.Button>
				</Trigger>
			)}
			{withPortal ? (
				<Popover.Portal>
					<Popover.Content asChild sideOffset={8}>
						<Surface className={styles.menuContent}>{children}</Surface>
					</Popover.Content>
				</Popover.Portal>
			) : (
				<Popover.Content asChild sideOffset={8}>
					<Surface className={styles.menuContent}>{children}</Surface>
				</Popover.Content>
			)}
		</Popover.Root>
	);
};

Menu.displayName = 'Menu';

export const Item = ({
	label,
	close = true,
	icon,
	iconComponent,
	disabled,
	onClick,
	isActive,
}: {
	label: string | React.ReactNode;
	icon?: keyof typeof icons;
	iconComponent?: React.ReactNode;
	close?: boolean;
	disabled?: boolean;
	onClick: () => void;
	isActive?: boolean;
}) => {
	const className = [
		styles.item,
		isActive && styles.isActive,
		disabled && styles.disabled,
	]
		.filter(Boolean)
		.join(' ');

	const IconComponent = icon ? icons[icon] : null;
	const IconCustomComponent = iconComponent || null;

	const ItemComponent = close ? Popover.Close : 'button';

	return (
		<ItemComponent className={className} onClick={onClick} disabled={disabled}>
			{IconComponent && <IconComponent className={styles.icon} />}
			{IconCustomComponent}
			{label}
		</ItemComponent>
	);
};

export type CategoryTitle = {
	children: React.ReactNode;
};

export const CategoryTitle = ({ children }: CategoryTitle) => {
	return <div className={styles.categoryTitle}>{children}</div>;
};

export const Divider = forwardRef<HTMLHRElement>((props, ref) => {
	return <hr {...props} ref={ref} className={styles.divider} />;
});

Divider.displayName = 'Divider';
