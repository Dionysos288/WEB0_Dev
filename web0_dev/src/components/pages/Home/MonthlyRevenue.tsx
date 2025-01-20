import Spacing from '@/components/General/Spacing';
import styles from './MonthlyRevenue.module.scss';
import LineChartComponent from '@/components/General/ui/charts/LineChartComponent';
const data = [
	{ name: 'Jan', value: 100 },
	{ name: 'Feb', value: 120 },
	{ name: 'Mar', value: 150 },
	{ name: 'Apr', value: 90 },
	{ name: 'May', value: 180 },
	{ name: 'Jun', value: 120 },
	{ name: 'Jul', value: 260 },
	{ name: 'Aug', value: 210 },
	{ name: 'Sep', value: 340 },
	{ name: 'Oct', value: 360 },
	{ name: 'Nov', value: 400 },
	{ name: 'Dec', value: 360 },
];
const MonthlyRevenue = () => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.topSide}>
				<h2>Monthly Revenue</h2>
			</div>
			<Spacing space={24} />
			<div className={styles.helper}>
				<LineChartComponent data={data} height={300} money={true} />
			</div>
		</div>
	);
};

export default MonthlyRevenue;
