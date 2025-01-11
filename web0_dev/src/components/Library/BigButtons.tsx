import styles from './BigButtons.module.scss';
import { Design, Code } from '@/svgs';
const BigButton = () => {
	return (
		<div className={styles.ButtonContainer}>
			<button className={styles.orange}>
				<h3>Design Assets</h3>
				<h4>237</h4>
				<div className={styles.icon}>
					<Design style={{ fill: '#EDE9DD' }} />
				</div>
			</button>
			<button className={styles.white}>
				<h3>Design Assets</h3>
				<h4>237</h4>
				<div className={styles.icon}>
					<Code style={{ fill: '#484643' }} />
				</div>
			</button>
		</div>
	);
};

export default BigButton;
