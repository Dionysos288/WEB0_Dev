import Spacing from '@/components/General/Spacing';
import { phaseType } from '../types/types';
import styles from './Phases.module.scss';
import { Paint, Calender } from '@/svgs';
const Phases = ({ phases }: { phases: phaseType[] }) => {
	const getPhaseStyles = (status: string): React.CSSProperties => {
		return {
			'--colorBG':
				status === 'Completed'
					? 'var(--completed-bg)'
					: status === 'Active'
					? 'var(--active-bg)'
					: 'var(--notStarted-bg)',
			'--colorBall':
				status === 'Completed'
					? 'var(--completed-ball)'
					: status === 'Active'
					? 'var(--active-ball)'
					: 'var(--notStarted-ball)',
			'--colorText':
				status === 'Completed'
					? 'var(--completed-text)'
					: status === 'Active'
					? 'var(--active-text)'
					: 'var(--notStarted-text)',
		} as React.CSSProperties;
	};
	return (
		<>
			<h2 className={styles.title}>Phases</h2>
			<Spacing space={10} />
			<div className={styles.phases}>
				{phases.map((phase) => (
					<div key={phase.id} className={styles.phase}>
						<div className={styles.topSide}>
							<div className={styles.svg}>
								<Paint fill={'var(--main)'} />
							</div>
							<h3>{phase.name}</h3>
						</div>
						<div className={styles.underSide}>
							<div
								className={styles.status}
								style={getPhaseStyles(phase.status)}
							>
								<div />
								<p>{phase.status}</p>
							</div>
							<div className={styles.date}>
								<Calender fill={'var(--main)'} />
								<p>{phase.startDate}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default Phases;
