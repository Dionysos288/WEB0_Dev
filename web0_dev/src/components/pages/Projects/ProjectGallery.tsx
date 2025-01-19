import projects from '@/Data/Projects';
import Image from 'next/image';
import Spacing from '../../General/Spacing';
import styles from './ProjectGallery.module.scss';
import Link from 'next/link';
import Team from '../../General/ui/Team';
import { PlusSpecial } from '@/svgs';

const ProjectGallery = () => {
	return (
		<div className={styles.projectWrapper}>
			<button className={styles.addProject}>
				<div className={styles.flex}>
					<PlusSpecial fill={'var(--black)'} />
					<span>New Project</span>
				</div>
			</button>
			{projects.map((project, index) => (
				<Link href={'/'} key={index} className={styles.project}>
					<div className={styles.topPart}>
						<div className={styles.projectInfo}>
							<h2>{project.title}</h2>
							<Spacing space={4} />
							<p>{project.due}</p>
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
						{project.phase === 'completed' && (
							<div className={`${styles.status} ${styles.completed}`}>
								<div />
								<p>Complete</p>
							</div>
						)}
						{project.phase === 'progress' && (
							<div className={`${styles.status} ${styles.progress}`}>
								<div />
								<p>In Progress</p>
							</div>
						)}
						{project.phase === 'rejected' && (
							<div className={`${styles.status} ${styles.rejected}`}>
								<div />
								<p>Rejected</p>
							</div>
						)}
						{project.phase === 'pending' && (
							<div className={`${styles.status} ${styles.pending}`}>
								<div />
								<p>Pending</p>
							</div>
						)}
					</div>
					<Spacing space={12} />
					{project.phase === 'completed' && (
						<div className={`${styles.line} `}>
							<div
								className={styles.completed}
								style={{
									width: `${(
										(project.completed / project.Alltasks) *
										100
									).toFixed(2)}%`,
								}}
							/>
						</div>
					)}
					{project.phase === 'progress' && (
						<div className={`${styles.line} `}>
							<div
								className={styles.progress}
								style={{
									width: `${(
										(project.completed / project.Alltasks) *
										100
									).toFixed(2)}%`,
								}}
							/>
						</div>
					)}
					{project.phase === 'rejected' && (
						<div className={`${styles.line} `}>
							<div
								className={styles.rejected}
								style={{
									width: `${(
										(project.completed / project.Alltasks) *
										100
									).toFixed(2)}%`,
								}}
							/>
						</div>
					)}
					{project.phase === 'pending' && (
						<div className={`${styles.line} `}>
							<div
								className={styles.pending}
								style={{
									width: `${(
										(project.completed / project.Alltasks) *
										100
									).toFixed(2)}%`,
								}}
							/>
						</div>
					)}
					<Spacing space={8} />
					<div className={styles.bottomPart}>
						<div className={styles.leftSide}>
							<p>{project.completed}</p>
							<span>/</span>
							<p>{project.Alltasks}</p>
							<span>Total Tasks</span>
						</div>
						<p>
							{(
								(Number(project.completed) / Number(project.Alltasks)) *
								100
							).toFixed(0)}
							%
						</p>{' '}
					</div>
				</Link>
			))}
		</div>
	);
};

export default ProjectGallery;
