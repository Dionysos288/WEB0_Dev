'use client';
import Image from 'next/image';
import styles from './ProjectMiddleLeft.module.scss';
import getCurrentWeekDates from '@/Utils/GetCurrentWeekDates';
import { useState } from 'react';
const ProjectMiddleLeft = () => {
	const weekDates = getCurrentWeekDates('en-US');
	const today = new Date();
	const formattedToday = today.toLocaleDateString('en-US', {
		day: 'numeric',
	});
	const [dateChosen, setDateChosen] = useState(formattedToday);
	const changeDate = (day: string) => {
		setDateChosen(day);
	};
	return (
		<div className={styles.TaskWrapper}>
			<h4>What&apos;s on the road?</h4>
			<div className={styles.dateWrapper}>
				{weekDates.map((date, index) => (
					<button
						key={index}
						onClick={
							dateChosen === date.day ? undefined : () => changeDate(date.day)
						}
						className={
							dateChosen === date.day
								? `${styles.day} ${styles.active}`
								: styles.day
						}
					>
						<p className={styles.top}>{date.weekday}</p>
						<p className={styles.bottom}>{date.day}</p>
					</button>
				))}
			</div>
			<div className={styles.activities}>
				<div className={styles.hor}>
					<div className={styles.line}></div>
					<div className={styles.imageWrapper}>
						<Image
							src="https://placehold.co/24"
							alt="UserProfilePic"
							width={24}
							height={24}
						/>
					</div>
					<div className={styles.vert}>
						<h5>Edited the details of Project X</h5>
						<p>Just now</p>
					</div>
				</div>
				<div className={styles.hor}>
					<div className={styles.line}></div>
					<div className={styles.imageWrapper}>
						<Image
							src="https://placehold.co/24"
							alt="UserProfilePic"
							width={24}
							height={24}
						/>
					</div>
					<div className={styles.vert}>
						<h5>Released a new version</h5>
						<p>59 minutes ago</p>
					</div>
				</div>
				<div className={styles.hor}>
					<div className={styles.line}></div>
					<div className={styles.imageWrapper}>
						<Image
							src="https://placehold.co/24"
							alt="UserProfilePic"
							width={24}
							height={24}
						/>
					</div>
					<div className={styles.vert}>
						<h5>Submitted a bug</h5>
						<p>12 hours ago</p>
					</div>
				</div>
				<div className={styles.hor}>
					<div className={styles.line}></div>

					<div className={styles.imageWrapper}>
						<Image
							src="https://placehold.co/24"
							alt="UserProfilePic"
							width={24}
							height={24}
						/>
					</div>
					<div className={styles.vert}>
						<h5>Modified A data in Page X</h5>
						<p>Today, 11:59 AM</p>
					</div>
				</div>
				<div className={styles.hor}>
					<div className={styles.line}></div>

					<div className={styles.imageWrapper}>
						<Image
							src="https://placehold.co/24"
							alt="UserProfilePic"
							width={24}
							height={24}
						/>
					</div>
					<div className={styles.vert}>
						<h5>Modified A data in Page X</h5>
						<p>Today, 11:59 AM</p>
					</div>
				</div>
				<div className={styles.hor}>
					<div className={styles.line}></div>

					<div className={styles.imageWrapper}>
						<Image
							src="https://placehold.co/24"
							alt="UserProfilePic"
							width={24}
							height={24}
						/>
					</div>
					<div className={styles.vert}>
						<h5>Modified A data in Page X</h5>
						<p>Today, 11:59 AM</p>
					</div>
				</div>
				<div className={styles.hor}>
					<div className={styles.imageWrapper}>
						<Image
							src="https://placehold.co/24"
							alt="UserProfilePic"
							width={24}
							height={24}
						/>
					</div>
					<div className={styles.vert}>
						<h5>Modified A data in Page X</h5>
						<p>Today, 11:59 AM</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectMiddleLeft;
