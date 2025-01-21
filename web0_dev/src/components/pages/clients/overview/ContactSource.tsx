import prisma from '@/lib/db';
import Spacing from '../../../General/Spacing';
import BarChartComponent from '../../../General/ui/charts/BarChartComponent';
import styles from './ContactSource.module.scss';
import { ClientSource } from '@prisma/client';

const ContactSource = async () => {
	const colors = [
		'rgba(105, 164, 111,1)',
		'rgba(137, 141, 205,1)',
		'rgba(204, 105, 43,1)',
		'var(--pending)',
		'var(--progress)',
		'var(--completed)',
		'rgba(105, 164, 111,1)',
	];
	const sources = [
		ClientSource.Mail,
		ClientSource.Call,
		ClientSource.Socials,
		ClientSource.Events,
		ClientSource.Referral,
		ClientSource.Website,
		ClientSource.Other,
	];
	const data = await prisma.client.groupBy({
		by: ['source'],
		_count: {
			source: true,
		},
	});
	const sourceCountMap = new Map(
		data.map((item) => [item.source, item._count.source])
	);

	const dataGraph = sources.map((item, index) => ({
		name: item,
		value: sourceCountMap.get(item) || 0,
		color: colors[index],
	}));
	return (
		<div className={styles.wrapper}>
			<div className={styles.topSide}>
				<h2>Contacts By Source</h2>
			</div>
			<Spacing space={24} />
			<div className={styles.helper}>
				<BarChartComponent data={dataGraph} height={300} />
			</div>
		</div>
	);
};

export default ContactSource;
