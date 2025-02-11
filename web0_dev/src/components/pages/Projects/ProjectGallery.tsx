import Image from 'next/image';
import Spacing from '../../general/Spacing';
import styles from './ProjectGallery.module.scss';
import Link from 'next/link';
import Team from '../../general/ui/Team';
import prisma from '@/lib/db';
import AddProject from './addProject/AddProject';
import { getUser } from '@/actions/AccountActions';
import NoPriority from '@/svgs/NoPriority';
import LowPriority from '@/svgs/LowPriority';
import HighPriority from '@/svgs/HighPriority';
import UrgentPriority from '@/svgs/UrgentPriority';
import MediumPriority from '@/svgs/MediumPriority';

const ProjectGallery = async () => {
	const { data: session } = await getUser();
	const organizationSlug = session?.session.organizationSlug;
	const projects = await prisma.project.findMany({
		include: {
			tasks: true,
			lead: true,
			members: true,
		},
		where: {
			organizationId: session?.session.organizationId,
		},
	});
	return (
		<div className={styles.projectWrapper}>
			<AddProject />
			{projects.map((project, index) => {
				const endDate = new Date(project.due).toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					year: 'numeric',
				});
				const allTasks = project.tasks.length;
				const team = [
					project.lead?.id,
					...project.members.map((member) => member.id),
				].filter((id): id is string => id !== undefined);

				return (
					<Link
						href={`/${organizationSlug}/projects/${project.id}`}
						key={index}
						className={styles.project}
					>
						<div className={styles.topPart}>
							<div className={styles.projectInfo}>
								<h2>{project.title}</h2>
								<Spacing space={4} />
								<p>Due Date: {endDate}</p>
							</div>
							<Image
								src={'https://placehold.co/40x40'}
								alt={project.title}
								width={40}
								height={40}
							/>
						</div>
						<Spacing space={16} />
						<div className={styles.middlePart}>
							<div className={styles.leftSide}>
								<Team team={team} />
							</div>
							{project.status === 'completed' && (
								<div className={`${styles.status} ${styles.completed}`}>
									<div />
									<p>Complete</p>
								</div>
							)}
							{project.status === 'progress' && (
								<div className={`${styles.status} ${styles.progress}`}>
									<div />
									<p>In Progress</p>
								</div>
							)}
							{project.status === 'canceled' && (
								<div className={`${styles.status} ${styles.canceled}`}>
									<div />
									<p>Canceled</p>
								</div>
							)}
							{project.status === 'planned' && (
								<div className={`${styles.status} ${styles.planned}`}>
									<div />
									<p>planned</p>
								</div>
							)}
							{project.status === 'backlog' && (
								<div className={`${styles.status} ${styles.planned}`}>
									<div />
									<p>Backlog</p>
								</div>
							)}
						</div>
						<Spacing space={12} />
						{project.status === 'completed' && (
							<div className={`${styles.line} `}>
								<div
									className={styles.completed}
									style={{
										width: `${((project.completed / allTasks) * 100).toFixed(
											2
										)}%`,
									}}
								/>
							</div>
						)}
						{project.status === 'progress' && (
							<div className={`${styles.line} `}>
								<div
									className={styles.progress}
									style={{
										width: `${((project.completed / allTasks) * 100).toFixed(
											2
										)}%`,
									}}
								/>
							</div>
						)}
						{project.status === 'canceled' && (
							<div className={`${styles.line} `}>
								<div
									className={styles.canceled}
									style={{
										width: `${((project.completed / allTasks) * 100).toFixed(
											2
										)}%`,
									}}
								/>
							</div>
						)}
						{project.status === 'planned' && (
							<div className={`${styles.line} `}>
								<div
									className={styles.planned}
									style={{
										width: `${((project.completed / allTasks) * 100).toFixed(
											2
										)}%`,
									}}
								/>
							</div>
						)}
						{project.status === 'backlog' && (
							<div className={`${styles.line} `}>
								<div
									className={styles.backlog}
									style={{
										width: `${((project.completed / allTasks) * 100).toFixed(
											2
										)}%`,
									}}
								/>
							</div>
						)}
						<Spacing space={8} />
						<div className={styles.bottomPart}>
							<div className={styles.leftSide}>
								{project.priority === 'noPriority' && <></>}
								{project.priority === 'low' && (
									<LowPriority width="14" height="14" fill={'var(--main-80)'} />
								)}
								{project.priority === 'medium' && (
									<MediumPriority
										width="14"
										height="14"
										fill={'var(--main-80)'}
									/>
								)}
								{project.priority === 'high' && (
									<HighPriority
										width="14"
										height="14"
										fill={'var(--main-80)'}
									/>
								)}
								{project.priority === 'urgent' && (
									<UrgentPriority
										width="14"
										height="14"
										fill={'var(--main-75)'}
									/>
								)}
								{project.status === 'backlog' ||
								project.status === 'planned' ? (
									<>
										<p className={styles.spaceLeft}>{allTasks}</p>
										<span>Scheduled Tasks</span>
									</>
								) : (
									<>
										<p className={styles.spaceLeft}>{project.completed}</p>
										<span>/</span>
										<p>{allTasks}</p>
										<span>Total Tasks</span>

										<p className={styles.rightSide}>
											{allTasks === 0
												? 0
												: (
														(Number(project.completed) / Number(allTasks)) *
														100
												  ).toFixed(0)}
											%
										</p>
									</>
								)}
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
};

export default ProjectGallery;
