import styles from './Switch.module.scss';
const Switch = ({ isActive }: { isActive: boolean }) => {
	return (
		<div className={`${styles.toggle} ${isActive ? styles.active : ''}`}>
			<div className={styles.circle} />
		</div>
	);
};

export default Switch;
