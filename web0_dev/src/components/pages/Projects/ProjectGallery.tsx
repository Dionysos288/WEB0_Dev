import Image from 'next/image';
import Spacing from '../../General/Spacing';
import styles from './ProjectGallery.module.scss';
import Link from 'next/link';
import Team from '../../general/ui/Team';
import prisma from '@/lib/db';
import AddProject from './addProject/AddProject';
import { getUser } from '@/actions/AccountActions';

const ProjectGallery = async () => {
	const { data: session } = await getUser();
	const organizationSlug = session?.session.organizationSlug;
	const projects = await prisma.project.findMany({
		include: {
			tasks: true,
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
								<Team team={project.team} />
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
							{project.status === 'rejected' && (
								<div className={`${styles.status} ${styles.rejected}`}>
									<div />
									<p>Rejected</p>
								</div>
							)}
							{project.status === 'pending' && (
								<div className={`${styles.status} ${styles.pending}`}>
									<div />
									<p>Pending</p>
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
						{project.status === 'rejected' && (
							<div className={`${styles.line} `}>
								<div
									className={styles.rejected}
									style={{
										width: `${((project.completed / allTasks) * 100).toFixed(
											2
										)}%`,
									}}
								/>
							</div>
						)}
						{project.status === 'pending' && (
							<div className={`${styles.line} `}>
								<div
									className={styles.pending}
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
								<p>{project.completed}</p>
								<span>/</span>
								<p>{allTasks}</p>
								<span>Total Tasks</span>
							</div>
							<p>
								{allTasks === 0
									? 0
									: (
											(Number(project.completed) / Number(allTasks)) *
											100
									  ).toFixed(0)}
								%
							</p>
						</div>
					</Link>
				);
			})}
		</div>
	);
};

export default ProjectGallery;
