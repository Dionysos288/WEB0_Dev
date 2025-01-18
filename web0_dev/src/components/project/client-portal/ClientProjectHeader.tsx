import styles from './ClientProjectHeader.module.scss';
import Spacing from '@/components/General/Spacing';
import Team from '@/components/General/ui/Team';
import Image from 'next/image';
import { PhaseStatus, phaseType, projectType } from '../types/types';
const ClientProjectHeader = ({
	project,
	phase,
	revisions,
}: {
	project?: projectType;
	phase?: phaseType;
	revisions?: number;
}) => {
	const getPhaseStyles = (status: PhaseStatus): React.CSSProperties => {
		return {
			'--background':
				status === 'Completed'
					? 'var(--completed-bg)'
					: status === 'Active'
					? 'var(--active-bg)'
					: 'var(--notStarted-bg)',
			'--background2':
				status === 'Completed'
					? 'var(--completed-ball)'
					: status === 'Active'
					? 'var(--active-ball)'
					: 'var(--notStarted-ball)',
			'--background3':
				status === 'Completed'
					? 'var(--completed-text)'
					: status === 'Active'
					? 'var(--active-text)'
					: 'var(--notStarted-text)',
		} as React.CSSProperties;
	};
	return (
		<div className={styles.headerWrapper}>
			{project && (
				<div className={styles.imgWrapper}>
					<Image
						src={'https://placehold.co/40x40'}
						alt={project.title}
						width={40}
						height={40}
					/>
				</div>
			)}
			{project && (
				<>
					<h2>WEB0 | {project.title}</h2>
					<Spacing space={8} />

					<p className={styles.subheader}>
						Project Phoenix aims to revolutionize the way we interact with
						technology by creating an intuitive platform that seamlessly
						integrates artificial intelligence into everyday tasks. Our goal is
						to enhance productivity and creativity, making advanced tools
						accessible to everyone, from students to professionals. Join us on
						this journey to empower users and transform their digital
						experiences.
					</p>
				</>
			)}
			{phase && (
				<>
					<h2>Phase: {phase.name}</h2>
					<Spacing space={8} />

					<p className={styles.subheader}>
						Project Phoenix aims to revolutionize the way we interact with
						technology by creating an intuitive platform that seamlessly
						integrates artificial intelligence into everyday tasks. Our goal is
						to enhance productivity and creativity, making advanced tools
						accessible to everyone, from students to professionals. Join us on
						this journey to empower users and transform their digital
						experiences.
					</p>
				</>
			)}
			<Spacing space={22} />
			<div className={styles.underSide}>
				<div className={styles.leftSide}>
					<div className={styles.status}>
						<h3>Status</h3>
						<Spacing space={4} />
						{project && (
							<div className={styles.progress}>
								{project.phase === 'completed' && (
									<>
										<div
											style={{
												width: `${(
													(project.completed / project.Alltasks) *
													100
												).toFixed(2)}%`,
											}}
											className={styles.completed}
										/>
										<p>Completed</p>
									</>
								)}

								{project.phase === 'progress' && (
									<>
										<div
											style={{
												width: `${(
													(project.completed / project.Alltasks) *
													100
												).toFixed(2)}%`,
											}}
											className={styles.progress}
										/>
										<p>
											In Progress <span>/</span>{' '}
											{(
												(Number(project.completed) / Number(project.Alltasks)) *
												100
											).toFixed(0)}
											%
										</p>
									</>
								)}
								{project.phase === 'rejected' && (
									<>
										<div
											style={{
												width: `${(
													(project.completed / project.Alltasks) *
													100
												).toFixed(2)}%`,
											}}
											className={styles.rejected}
										/>
										<p>
											Rejected <span>/</span>{' '}
											{(
												(Number(project.completed) / Number(project.Alltasks)) *
												100
											).toFixed(0)}
											%
										</p>
									</>
								)}
								{project.phase === 'pending' && (
									<>
										<div
											style={{
												width: `${(
													(project.completed / project.Alltasks) *
													100
												).toFixed(2)}%`,
											}}
											className={styles.pending}
										/>
										<p>
											Pending <span>/</span>{' '}
											{(
												(Number(project.completed) / Number(project.Alltasks)) *
												100
											).toFixed(0)}
											%
										</p>
									</>
								)}
							</div>
						)}
						{phase && (
							<div
								className={styles.progressSpecial}
								style={getPhaseStyles(phase.status)}
							>
								<p>{phase.status}</p>
							</div>
						)}
					</div>
					<div className={styles.column}>
						<h3>Start Date</h3>
						<Spacing space={4} />
						<p>{project?.start || phase?.startDate}</p>
					</div>
					<div className={styles.column}>
						<h3>Due Date</h3>
						<Spacing space={4} />
						<p>{project?.due || phase?.endDate}</p>
					</div>
					{(revisions && phase) || project ? (
						<div className={styles.column}>
							{project ? (
								<>
									<h3>Budget</h3>
									<Spacing space={4} />
									<p>$ {project.budget}</p>
								</>
							) : (
								<button className={styles.revision}>
									<span>Ask Revision 0/{revisions}</span>
								</button>
							)}
						</div>
					) : null}
				</div>
				{project && (
					<div className={styles.rightSide}>
						<Team team={project.team} />
					</div>
				)}
			</div>
		</div>
	);
};

export default ClientProjectHeader;
