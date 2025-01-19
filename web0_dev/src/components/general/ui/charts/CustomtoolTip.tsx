import { TooltipProps } from 'recharts';
import styles from './CustomToolTip.module.scss';

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
	if (active && payload && payload.length) {
		return (
			<div className={styles.tooltip}>
				<div className={styles.leftSide}>
					<div
						className={styles.block}
						style={{ backgroundColor: payload[0].payload.color }}
					/>

					<p className={styles.label}>{payload[0].payload.name}</p>
				</div>
				<p className={styles.amount}>{payload[0].payload.value}</p>
			</div>
		);
	}

	return null;
};

export default CustomTooltip;
