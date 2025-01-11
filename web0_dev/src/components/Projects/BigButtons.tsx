import Spacing from '../general/Spacing';
import styles from './BigButtons.module.scss';
import { Team, Folder, Money } from '@/svgs';
const BigButtons = () => {
	return (
		<>
			<h2 className={styles.header}>My Projects</h2>
			<Spacing space={20} />
			<div className={styles.buttonWrapper}>
				<div className={`${styles.button} ${styles.orange}`}>
					<h3>Current Projects</h3>
					<h4>237</h4>
					<div className={styles.icon}>
						<Folder style={{ fill: 'var(--whiteSpecial)' }} />
					</div>
				</div>
				<div className={`${styles.button} ${styles.white}`}>
					<h3>Project Finance</h3>
					<h4>$3,290</h4>
					<div className={styles.icon}>
						<Money style={{ fill: 'var(--main)' }} />
					</div>
				</div>
				<div className={`${styles.button} ${styles.orange}`}>
					<h3>Our Clients</h3>
					<h4>49</h4>
					<div className={styles.icon}>
						<Team style={{ fill: 'var(--whiteSpecial)' }} />
					</div>
				</div>
			</div>
		</>
	);
};

export default BigButtons;
