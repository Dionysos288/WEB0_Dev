import Spacing from '@/components/General/Spacing';
import styles from './ProjectHeader.module.scss';
import Team from '@/components/General/ui/Team';
import Image from 'next/image';
import { projectType } from '../types/types';
const ProjectHeader = ({ project }: { project: projectType }) => {
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
			<h2>{project.title}</h2>
			<Spacing space={22} />
			<div className={styles.underSide}>
				<div className={styles.leftSide}>
					<div className={styles.status}>
						<h3>Status</h3>
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
						<h3>Total Tasks</h3>
						<Spacing space={4} />
						<p>
							{project.completed} <span>/</span> {project.Alltasks}
						</p>
					</div>
					<div className={styles.column}>
						<h3>Due Date</h3>
						<Spacing space={4} />
						<p>{project.due}</p>
					</div>
					<div className={styles.column}>
						<h3>Budget</h3>
						<Spacing space={4} />
						<p>$ {project.budget}</p>
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
