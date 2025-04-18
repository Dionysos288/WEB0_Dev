'use client';
import styles from './ClientProjectHeader.module.scss';
import Spacing from '@/components/general/Spacing';
import Team from '@/components/general/ui/Team';
import Image from 'next/image';
import { Phase, PhaseStatus, Project, Task } from '@prisma/client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type ProjectAndTasks = Omit<Project, 'budget'> & {
	budget: number;
	tasks: Task[];
};
const ClientProjectHeader = ({
	project,
	phase,
	revisions,
}: {
	project?: ProjectAndTasks;
	phase?: Phase;
	revisions?: number | null;
}) => {
	const pathname = usePathname();

	useEffect(() => {
		if (project) {
			const pageInfoEvent = new CustomEvent('pageinfo', {
				detail: {
					id: project.id,
					title: `Client Portal: ${project.title}`,
					type: 'project',
					pathname: pathname,
				},
			});
			window.dispatchEvent(pageInfoEvent);
		} else if (phase) {
			const pageInfoEvent = new CustomEvent('pageinfo', {
				detail: {
					id: phase.id,
					title: `Phase: ${phase.title}`,
					type: 'phase',
					pathname: pathname,
				},
			});
			window.dispatchEvent(pageInfoEvent);
		}
	}, [project, phase, pathname]);

	let startDate;
	let endDate;
	let allTasks = 0;
	if (project) {
		startDate = new Date(project.start).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
		endDate = new Date(project.due).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
		allTasks = project.tasks.length || 0;
	} else if (phase) {
		startDate = new Date(phase.startDate).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
		endDate = new Date(phase.endDate).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	}

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

					<p className={styles.subheader}>{/* {project.description} */}</p>
				</>
			)}
			{phase && (
				<>
					<h2>Phase: {phase.title}</h2>
					<Spacing space={8} />

					<p className={styles.subheader}>{phase.description}</p>
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
								{project.status === 'completed' && (
									<>
										<div
											style={{
												width: `100%`,
											}}
											className={styles.completed}
										/>
										<p>Completed</p>
									</>
								)}

								{project.status === 'progress' && (
									<>
										<div
											style={{
												width: `${(
													(project.completed / allTasks) *
													100
												).toFixed(2)}%`,
											}}
											className={styles.progress}
										/>
										<p>
											In Progress <span>/</span>{' '}
											{(
												(Number(project.completed) / Number(allTasks)) *
												100
											).toFixed(0)}
											%
										</p>
									</>
								)}
								{project.status === 'canceled' && (
									<>
										<div
											style={{
												width: `${(
													(project.completed / allTasks) *
													100
												).toFixed(2)}%`,
											}}
											className={styles.rejected}
										/>
										<p>
											Canceled <span>/</span>{' '}
											{(
												(Number(project.completed) / Number(allTasks)) *
												100
											).toFixed(0)}
											%
										</p>
									</>
								)}
								{(project.status === 'backlog' ||
									project.status === 'planned') && (
									<>
										<div
											style={{
												width: `${(
													(project.completed / allTasks) *
													100
												).toFixed(2)}%`,
											}}
											className={styles.pending}
										/>
										<p>
											{project.status === 'backlog' ? 'Backlog' : 'Planned'}{' '}
											<span>/</span>{' '}
											{(
												(Number(project.completed) / Number(allTasks)) *
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
								<p>
									{phase.status === 'Not_Started'
										? 'Not Started'
										: phase.status === 'Active'
										? phase.status
										: phase.status}
								</p>
							</div>
						)}
					</div>
					<div className={styles.column}>
						<h3>Start Date</h3>
						<Spacing space={4} />
						<p>{startDate}</p>
					</div>
					<div className={styles.column}>
						<h3>Due Date</h3>
						<Spacing space={4} />
						<p>{endDate}</p>
					</div>
					{(revisions && phase) || project ? (
						<div className={styles.column}>
							{project ? (
								<>
									<h3>Budget</h3>
									<Spacing space={4} />
									<p>${project.budget.toFixed(2)}</p>
								</>
							) : (
								revisions && (
									<button className={styles.revision}>
										<span>Ask Revision 0/{revisions}</span>
									</button>
								)
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
