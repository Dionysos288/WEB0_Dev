import styles from './BigButtons.module.scss';
import { Design, Code } from '@/svgs';
const BigButton = () => {
	return (
		<div className={styles.ButtonContainer}>
			<button className={styles.orange}>
				<h2>Design Assets</h2>
				<p>237</p>
				<div className={styles.icon}>
					<Design style={{ fill: '#EDE9DD' }} />
				</div>
			</button>
			<button className={styles.white}>
				<h2>Design Assets</h2>
				<p>237</p>
				<div className={styles.icon}>
					<Code style={{ fill: '#484643' }} />
				</div>
			</button>
		</div>
	);
};

export default BigButton;
