import prisma from '@/lib/db';
import Spacing from '../../General/Spacing';
import styles from './BigButtons.module.scss';
import Folder from '@/svgs/Folder';
import CurrencyCircleDollar from '@/svgs/CurrencyCircleDollar';
import Team from '@/svgs/Team';
import { getUser } from '@/actions/AccountActions';
const BigButtons = async () => {
	const { data: session } = await getUser();
	const allProjects = await prisma.project.count({
		where: { organizationId: 'session?.session.organizationId' },
	});
	const budget = await prisma.project.aggregate({
		_sum: {
			budget: true,
		},
		where: {
			organizationId: session?.session.organizationId,
		},
	});
	const clients = await prisma.client.count({
		where: { organizationId: session?.session.organizationId },
	});
	return (
		<>
			<h2 className={styles.header}>My Projects</h2>
			<Spacing space={20} />
			<div className={styles.buttonWrapper}>
				<div className={`${styles.button} ${styles.orange}`}>
					<h3>Current Projects</h3>
					<p>{allProjects || 0}</p>
					<div className={styles.icon}>
						<Folder fill="var(--whiteSpecial)" width="24" height="24" />
					</div>
				</div>
				<div className={`${styles.button} ${styles.white}`}>
					<h3>Project Finance</h3>
					<p>${(budget._sum.budget || 0).toFixed(2)}</p>{' '}
					<div className={styles.icon}>
						<CurrencyCircleDollar
							fill="var(--main-main)"
							width="24"
							height="24"
						/>
					</div>
				</div>
				<div className={`${styles.button} ${styles.orange}`}>
					<h3>Our Clients</h3>
					<p>{clients || 0}</p>
					<div className={styles.icon}>
						<Team fill="var(--whiteSpecial)" width="24" height="24" />
					</div>
				</div>
			</div>
		</>
	);
};

export default BigButtons;
