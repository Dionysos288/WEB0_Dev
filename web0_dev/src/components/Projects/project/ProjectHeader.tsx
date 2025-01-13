import Spacing from '@/components/general/Spacing';
import styles from './ProjectHeader.module.scss';
import Team from '@/components/general/ui/Team';
import Image from 'next/image';
const ProjectHeader = ({ project }) => {
	return (
		<div className={styles.headerWrapper}>
			<div className={styles.imgWrapper}>
				<Image
					src={'https://placehold.co/40x40'}
					alt={project.title}
					width={40}
					height={40}
				/>
			</div>
			<h3>{project.title}</h3>
			<Spacing space={22} />
			<div className={styles.underSide}>
				<div className={styles.leftSide}>
					<div className={styles.status}>
						<p>Status</p>
						<Spacing space={4} />

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
					</div>
					<div className={styles.column}>
						<p>Total Tasks</p>
						<Spacing space={4} />
						<h4>
							{project.completed} <span>/</span> {project.Alltasks}
						</h4>
					</div>
					<div className={styles.column}>
						<p>Due Date</p>
						<Spacing space={4} />
						<h4>{project.due}</h4>
					</div>
					<div className={styles.column}>
						<p>Budget</p>
						<Spacing space={4} />
						<h4>$ {project.budget}</h4>
					</div>
				</div>
				<div className={styles.rightSide}>
					<Team team={project.team} />
				</div>
			</div>
		</div>
	);
};

export default ProjectHeader;
