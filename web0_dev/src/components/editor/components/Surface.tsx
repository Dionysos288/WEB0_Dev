import { HTMLProps, forwardRef } from 'react';
import styles from './Surface.module.scss';

export type SurfaceProps = HTMLProps<HTMLDivElement> & {
	withShadow?: boolean;
	withBorder?: boolean;
};

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
	(
		{ children, className, withShadow = true, withBorder = true, ...props },
		ref
	) => {
		const surfaceClass = [
			styles.surface,
			withShadow && styles.withShadow,
			withBorder && styles.withBorder,
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<div className={surfaceClass} {...props} ref={ref}>
				{children}
			</div>
		);
	}
);

Surface.displayName = 'Surface';
