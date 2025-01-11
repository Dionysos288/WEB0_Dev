import styles from './Spacing.module.scss';
type SpacingProps = {
	space: number;
	tablet?: number;
	mobile?: number;
};
export default function Spacing({
	space,
	tablet = space,
	mobile = space,
}: SpacingProps) {
	const style = {
		'--spacing-space': `${space}px`,
		'--spacing-tablet': `${tablet}px`,
		'--spacing-mobile': `${mobile}px`,
	} as React.CSSProperties;
	return <div className={styles.spacing} style={style}></div>;
}
