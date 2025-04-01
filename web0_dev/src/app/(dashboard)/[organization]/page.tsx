import MonthlyRevenue from '@/components/pages/home/MonthlyRevenue';
import styles from './page.module.scss';
import QuadrantRevenue from '@/components/pages/home/QuadrantRevenue';
import Spacing from '@/components/general/Spacing';
import Calender from '@/components/pages/home/Calender';
import { notFound } from 'next/navigation';
import { setActiveOrganization, getUser } from '@/actions/AccountActions';
export default async function Home({
	params,
}: {
	params: { organization: string };
}) {
	const param = await params;

	const activeOrgResult = await setActiveOrganization(param.organization);
	if (activeOrgResult.error) {
		console.error('Failed to set active organization:', activeOrgResult.error);
		notFound();
	}

	const { data: session } = await getUser();
	console.log(session);

	return (
		<>
			<h2 className={styles.title}>Welcome {session?.user.name}!</h2>
			<Spacing space={28} />
			<div className={styles.charts}>
				<MonthlyRevenue /> <QuadrantRevenue />
			</div>
			<Spacing space={28} />
			<Calender />
		</>
	);
}
