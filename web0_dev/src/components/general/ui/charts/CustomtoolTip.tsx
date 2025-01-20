import { TooltipProps } from 'recharts';
import styles from './CustomToolTip.module.scss';

interface CustomTooltipProps extends TooltipProps<number, string> {
	money?: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
	active,
	payload,

	money = false,
}) => {
	if (active && payload && payload.length) {
		return (
			<div className={styles.tooltip}>
				<div className={styles.leftSide}>
					<div
						className={styles.block}
						style={{
							backgroundColor: payload[0].payload.color
								? payload[0].payload.color
								: 'var(--orange)',
						}}
					/>

					<p className={styles.label}>{payload[0].payload.name}</p>
				</div>
				<p className={styles.amount}>
					{money ? `$${payload[0].value}` : payload[0].value}
				</p>
			</div>
		);
	}

	return null;
};

export default CustomTooltip;
