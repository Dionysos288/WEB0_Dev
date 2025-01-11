import projects from '@/Data/Projects';
import Image from 'next/image';
import Spacing from '../general/Spacing';
import styles from './ProjectGallery.module.scss';
import Link from 'next/link';
import { Plus, PlusSpecial } from '@/svgs';
const ProjectGallery = () => {
	return (
		<div className={styles.projectWrapper}>
			<button className={styles.addProject}>
				<div className={styles.flex}>
					<PlusSpecial />
					<h5>New Project</h5>
				</div>
			</button>
			{projects.map((project, index) => (
				<Link href={'/'} key={index} className={styles.project}>
					<div className={styles.topPart}>
						<div className={styles.projectInfo}>
							<h5>{project.title}</h5>
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
							{project.team.map((member, index) => {
								if (project.team.length > 3 && index === 2) {
									return (
										<div className={styles.extra} key={index}>
											<p>+{project.team.length - 2}</p>
										</div>
									);
								} else if (index < 2 || project.team.length <= 3) {
									return (
										<div key={index} className={styles.member}>
											<Image
												src={'https://placehold.co/24x24'}
												alt={member}
												width={26}
												height={26}
											/>
										</div>
									);
								} else {
									return null;
								}
							})}
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
						<p>{(project.completed / project.Alltasks).toFixed(2) * 100}%</p>
					</div>
				</Link>
			))}
		</div>
	);
};

export default ProjectGallery;
