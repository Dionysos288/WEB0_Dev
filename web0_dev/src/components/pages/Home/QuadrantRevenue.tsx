import Spacing from '@/components/general/Spacing';
import styles from './QuadrantRevenue.module.scss';
import BarChartComponentVertical from '@/components/general/ui/charts/BarChartComponentVertical';
const data = [
	{ name: 'Q1', value: 125, color: 'rgba(105, 164, 111,1)' },
	{ name: 'Q2', value: 100, color: 'rgba(137, 141, 205,1)' },
	{ name: 'Q3', value: 55, color: 'rgba(204, 105, 43,1)' },
	{ name: 'Q4', value: 25, color: 'var(--pending)' },
];
const QuadrantRevenue = () => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.topSide}>
				<h2>Quadrant Revenue</h2>
			</div>
			<Spacing space={24} />
			<div className={styles.helper}>
				<BarChartComponentVertical data={data} height={300} money={true} />
			</div>
		</div>
	);
};

export default QuadrantRevenue;
