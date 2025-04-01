import styles from './Block.module.scss';

const Block = ({
	children,
	width,
}: {
	children: React.ReactNode;
	width?: string;
}) => {
	return (
		<div className={styles.block} style={{ width }}>
			{children}
		</div>
	);
};

export default Block;
