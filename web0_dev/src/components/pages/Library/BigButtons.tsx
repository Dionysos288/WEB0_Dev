import Layer from '@/svgs/Layer';
import styles from './BigButtons.module.scss';
import Code from '@/svgs/Code';
const BigButton = () => {
	return (
		<div className={styles.ButtonContainer}>
			<button className={styles.orange}>
				<h2>Design Assets</h2>
				<p>237</p>
				<div className={styles.icon}>
					<Layer fill="var(--whiteSpecial)" width="24" height="24" />
				</div>
			</button>
			<button className={styles.white}>
				<h2>Design Assets</h2>
				<p>237</p>
				<div className={styles.icon}>
					<Code fill="var(--main-main)" width="24" height="24" />
				</div>
			</button>
		</div>
	);
};

export default BigButton;
