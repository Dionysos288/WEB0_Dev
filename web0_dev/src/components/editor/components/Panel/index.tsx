import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Surface } from '../Surface';
import styles from './Panel.module.scss';

export type PanelProps = {
	spacing?: 'medium' | 'small';
	noShadow?: boolean;
	asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
	({ asChild, className, children, spacing, noShadow, ...rest }, ref) => {
		const panelClass = [
			styles.panel,
			spacing === 'small' && styles.small,
			className,
		]
			.filter(Boolean)
			.join(' ');

		const Comp = asChild ? Slot : 'div';

		return (
			<Comp ref={ref} {...rest}>
				<Surface className={panelClass} withShadow={!noShadow}>
					{children}
				</Surface>
			</Comp>
		);
	}
);

Panel.displayName = 'Panel';

export const PanelDivider = forwardRef<
	HTMLDivElement,
	{ asChild?: boolean } & React.HTMLAttributes<HTMLDivElement>
>(({ asChild, className, children, ...rest }, ref) => {
	const dividerClass = [styles.divider, className].filter(Boolean).join(' ');

	const Comp = asChild ? Slot : 'div';

	return (
		<Comp className={dividerClass} {...rest} ref={ref}>
			{children}
		</Comp>
	);
});

PanelDivider.displayName = 'PanelDivider';

export const PanelHeader = forwardRef<
	HTMLDivElement,
	{ asChild?: boolean } & React.HTMLAttributes<HTMLDivElement>
>(({ asChild, className, children, ...rest }, ref) => {
	const headerClass = [styles.header, className].filter(Boolean).join(' ');

	const Comp = asChild ? Slot : 'div';

	return (
		<Comp className={headerClass} {...rest} ref={ref}>
			{children}
		</Comp>
	);
});

PanelHeader.displayName = 'PanelHeader';

export const PanelSection = forwardRef<
	HTMLDivElement,
	{ asChild?: boolean } & React.HTMLAttributes<HTMLDivElement>
>(({ asChild, className, children, ...rest }, ref) => {
	const sectionClass = [styles.section, className].filter(Boolean).join(' ');

	const Comp = asChild ? Slot : 'div';

	return (
		<Comp className={sectionClass} {...rest} ref={ref}>
			{children}
		</Comp>
	);
});

PanelSection.displayName = 'PanelSection';

export const PanelHeadline = forwardRef<
	HTMLDivElement,
	{ asChild?: boolean } & React.HTMLAttributes<HTMLDivElement>
>(({ asChild, className, children, ...rest }, ref) => {
	const headlineClass = [styles.headline, className].filter(Boolean).join(' ');

	const Comp = asChild ? Slot : 'div';

	return (
		<Comp className={headlineClass} {...rest} ref={ref}>
			{children}
		</Comp>
	);
});

PanelHeadline.displayName = 'PanelHeadline';

export const PanelFooter = forwardRef<
	HTMLDivElement,
	{ asChild?: boolean } & React.HTMLAttributes<HTMLDivElement>
>(({ asChild, className, children, ...rest }, ref) => {
	const footerClass = [styles.footer, className].filter(Boolean).join(' ');

	const Comp = asChild ? Slot : 'div';

	return (
		<Comp className={footerClass} {...rest} ref={ref}>
			{children}
		</Comp>
	);
});

PanelFooter.displayName = 'PanelFooter';
