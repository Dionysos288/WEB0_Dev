import Spacing from '../../../general/Spacing';
import styles from './ContactStatus.module.scss';
import DoughnutChart from '../../../general/ui/charts/DoughnutChart';
import { ClientStatus } from '@prisma/client';
import prisma from '@/lib/db';
import { getUser } from '@/actions/AccountActions';

const ContactStatus = async () => {
	const { data: session } = await getUser();
	const colors = [
		'var(--leads-90)',
		'var(--contacted-90)',
		'var(--oppurtunity-90)',
		'var(--client-90)',
	];
	const sources = [
		ClientStatus.Leads,
		ClientStatus.Contacted,
		ClientStatus.Opportunity,
		ClientStatus.Client,
	];
	const data = await prisma.client.groupBy({
		by: ['status'],
		_count: {
			status: true,
		},
		where: {
			organizationId: session?.session.organizationId,
		},
	});
	const sourceCountMap = new Map(
		data.map((item) => [item.status, item._count.status])
	);

	const dataGraph = sources.map((item, index) => ({
		name: item,
		value: sourceCountMap.get(item) || 0,
		color: colors[index],
	}));
	return (
		<div className={styles.wrapper}>
			<div className={styles.topSide}>
				<h2>Contact Status</h2>
			</div>
			<Spacing space={16} />
			<div className={styles.underSide}>
				<DoughnutChart data={dataGraph} height={300} width={300} />
				<div className={styles.legend}>
					{dataGraph.map((item, index) => (
						<div key={index} className={styles.legendItem}>
							<div className={styles.leftSide}>
								<div
									style={{
										backgroundColor: item.color,
									}}
									className={styles.ball}
								/>
								<h3>{item.name}</h3>
							</div>
							<p>{item.value}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ContactStatus;
