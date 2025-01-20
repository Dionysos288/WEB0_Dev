import MonthlyRevenue from '@/components/pages/Home/MonthlyRevenue';
import styles from './page.module.scss';
import QuadrantRevenue from '@/components/pages/Home/QuadrantRevenue';
import Spacing from '@/components/General/Spacing';
import Calender from '@/components/pages/Home/Calender';

export default function Home() {
	return (
		<>
			<h2 className={styles.title}>Welcome Back Dion!</h2>
			<Spacing space={28} />
			<div className={styles.charts}>
				<MonthlyRevenue /> <QuadrantRevenue />
			</div>
			<Spacing space={28} />
			<Calender />
		</>
	);
}
