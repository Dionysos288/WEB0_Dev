import Spacing from '../../General/Spacing';
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
					<p>237</p>
					<div className={styles.icon}>
						<Folder style={{ fill: 'var(--whiteSpecial)' }} />
					</div>
				</div>
				<div className={`${styles.button} ${styles.white}`}>
					<h3>Project Finance</h3>
					<p>$3,290</p>
					<div className={styles.icon}>
						<Money style={{ fill: 'var(--main)' }} />
					</div>
				</div>
				<div className={`${styles.button} ${styles.orange}`}>
					<h3>Our Clients</h3>
					<p>49</p>
					<div className={styles.icon}>
						<Team style={{ fill: 'var(--whiteSpecial)' }} />
					</div>
				</div>
			</div>
		</>
	);
};

export default BigButtons;
