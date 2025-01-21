import prisma from '@/lib/db';
import Spacing from '../../General/Spacing';
import styles from './BigButtons.module.scss';
import { Team, Folder, Money } from '@/svgs';
const BigButtons = async () => {
	const allProjects = await prisma.project.count();
	const budget = await prisma.project.aggregate({
		_sum: {
			budget: true,
		},
	});
	const clients = await prisma.client.count();
	return (
		<>
			<h2 className={styles.header}>My Projects</h2>
			<Spacing space={20} />
			<div className={styles.buttonWrapper}>
				<div className={`${styles.button} ${styles.orange}`}>
					<h3>Current Projects</h3>
					<p>{allProjects || 0}</p>
					<div className={styles.icon}>
						<Folder style={{ fill: 'var(--whiteSpecial)' }} />
					</div>
				</div>
				<div className={`${styles.button} ${styles.white}`}>
					<h3>Project Finance</h3>
					<p>${(budget._sum.budget || 0).toFixed(2)}</p>{' '}
					<div className={styles.icon}>
						<Money style={{ fill: 'var(--main)' }} />
					</div>
				</div>
				<div className={`${styles.button} ${styles.orange}`}>
					<h3>Our Clients</h3>
					<p>{clients || 0}</p>
					<div className={styles.icon}>
						<Team style={{ fill: 'var(--whiteSpecial)' }} />
					</div>
				</div>
			</div>
		</>
	);
};

export default BigButtons;
