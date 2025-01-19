import Spacing from '../../../General/Spacing';
import BarChartComponent from '../../../General/ui/charts/BarChartComponent';
import styles from './ContactSource.module.scss';
const data = [
	{ name: 'Mail', value: 125, color: 'rgba(105, 164, 111,1)' },
	{ name: 'Call', value: 100, color: 'rgba(137, 141, 205,1)' },
	{ name: 'Socials', value: 55, color: 'rgba(204, 105, 43,1)' },
	{ name: 'Events', value: 25, color: 'var(--pending)' },
	{ name: 'M2M', value: 5, color: 'var(--progress)' },
	{ name: 'Other', value: 12, color: 'var(--completed)' },
];

const ContactSource = () => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.topSide}>
				<h2>Contacts By Source</h2>
			</div>
			<Spacing space={24} />
			<div className={styles.helper}>
				<BarChartComponent data={data} height={300} />
			</div>
		</div>
	);
};

export default ContactSource;
