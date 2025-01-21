import Spacing from '@/components/General/Spacing';
import styles from './Phases.module.scss';
import { Paint, Calender } from '@/svgs';
import Link from 'next/link';
import { Phase, PhaseStatus } from '@prisma/client';
const Phases = ({ phases }: { phases: Phase[] }) => {
	const getPhaseStyles = (status: PhaseStatus): React.CSSProperties => {
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
			<Spacing space={12} />
			<div className={styles.phases}>
				{phases.map((phase) => {
					const startDate = new Date(phase.startDate).toLocaleDateString(
						'en-US',
						{
							month: 'numeric',
							day: 'numeric',
							year: 'numeric',
						}
					);
					return (
						<Link
							href={`client-portal/${phase.id}`}
							key={phase.id}
							className={styles.phase}
						>
							<div className={styles.topSide}>
								<div className={styles.svg}>
									<Paint fill={'var(--main)'} />
								</div>
								<h3>{phase.title}</h3>
							</div>
							<div className={styles.underSide}>
								<div
									className={styles.status}
									style={getPhaseStyles(phase.status)}
								>
									<div />
									<p>
										{phase.status === 'Not_Started'
											? 'Not Started'
											: phase.status === 'Active'
											? phase.status
											: phase.status}
									</p>
								</div>
								<div className={styles.date}>
									<Calender fill={'var(--main)'} />
									<p>{startDate}</p>
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</>
	);
};

export default Phases;
