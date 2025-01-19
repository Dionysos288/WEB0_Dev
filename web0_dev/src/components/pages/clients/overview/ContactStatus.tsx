import Spacing from '../../../General/Spacing';
import styles from './ContactStatus.module.scss';
import DoughnutChart from '../../../General/ui/charts/DoughnutChart';
const data = [
	{ name: 'Leads', value: 50, color: 'var(--leads-90)' },
	{ name: 'Contacted', value: 60, color: 'var(--contacted-90)' },
	{ name: 'oppurtunity', value: 25, color: 'var(--oppurtunity-90)' },
	{ name: 'Client', value: 18, color: 'var(--client-90)' },
];
const ContactStatus = () => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.topSide}>
				<h2>Contact Status</h2>
			</div>
			<Spacing space={16} />
			<div className={styles.underSide}>
				<DoughnutChart data={data} height={300} width={300} />
				<div className={styles.legend}>
					{data.map((item, index) => (
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
