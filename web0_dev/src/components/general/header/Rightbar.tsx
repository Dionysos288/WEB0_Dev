import Image from 'next/image';
import styles from './RightBar.module.scss';
import { Bug, User, Broadcast } from '@/svgs';
const RightBar = () => {
	return (
		<div className={styles.rightBarWrapper}>
			<div className={styles.rightBar}>
				<div className={styles.notifications}>
					<h2>Notifications</h2>
					<div className={styles.hor}>
						<div
							className={styles.block}
							style={{ backgroundColor: '#e8b594' }}
						>
							<Bug
								style={{
									fill: '#484643',
									margin: '4px ',
									position: 'absolute',
									transform: 'translatex(0.5px) ',
								}}
							/>
						</div>
						<div className={styles.vert}>
							<p>You have A bug that needs...</p>
							<p className={styles.special}>Just now</p>
						</div>
					</div>
					<div className={styles.hor}>
						<div
							className={styles.block}
							style={{ backgroundColor: '#EDE9DD' }}
						>
							<User
								style={{
									fill: '#484643',
									margin: '4px ',
									position: 'absolute',
									transform: 'translatex(0.5px) ',
								}}
							/>
						</div>
						<div className={styles.vert}>
							<p>New User Registered</p>
							<p className={styles.special}>59 minutes ago</p>
						</div>
					</div>
					<div className={styles.hor}>
						<div
							className={styles.block}
							style={{ backgroundColor: '#e8b594' }}
						>
							<Bug
								style={{
									fill: '#484643',
									margin: '4px ',
									position: 'absolute',
									transform: 'translatex(0.5px) ',
								}}
							/>
						</div>
						<div className={styles.vert}>
							<p>You have a bug that needs...</p>
							<p className={styles.special}>12 hours ago</p>
						</div>
					</div>
					<div className={styles.hor}>
						<div
							className={styles.block}
							style={{ backgroundColor: '#EDE9DD' }}
						>
							<Broadcast
								style={{
									fill: '#484643',
									margin: '4px ',
									position: 'absolute',
									transform: 'translatex(0.5px) ',
								}}
							/>
						</div>
						<div className={styles.vert}>
							<p>Andi Lane subscribed to you</p>
							<p className={styles.special}>Today, 11:59 AM</p>
						</div>
					</div>
				</div>
				<div className={styles.activities}>
					<h2>Activities</h2>
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
							<p>Edited the details of Project X</p>
							<p className={styles.special}>Just now</p>
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
							<p>Released a new version</p>
							<p className={styles.special}>59 minutes ago</p>
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
							<p>Submitted a bug</p>
							<p className={styles.special}>12 hours ago</p>
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
							<p>Modified A data in Page X</p>
							<p className={styles.special}>Today, 11:59 AM</p>
						</div>
					</div>
				</div>
				<div className={styles.Contacts}>
					<h2>Contacts</h2>
					<div className={`${styles.hor} ${styles.horSpec}`}>
						<div className={styles.imageWrapper}>
							<Image
								src="https://placehold.co/24"
								alt="UserProfilePic"
								width={24}
								height={24}
							/>
						</div>
						<div className={styles.vert}>
							<p>Dion Zeneli</p>
						</div>
					</div>
					<div className={`${styles.hor} ${styles.horSpec}`}>
						<div className={styles.imageWrapper}>
							<Image
								src="https://placehold.co/24"
								alt="UserProfilePic"
								width={24}
								height={24}
							/>
						</div>
						<div className={styles.vert}>
							<p>Dren Zeneli</p>
						</div>
					</div>
					<div className={`${styles.hor} ${styles.horSpec}`}>
						<div className={styles.imageWrapper}>
							<Image
								src="https://placehold.co/24"
								alt="UserProfilePic"
								width={24}
								height={24}
							/>
						</div>
						<div className={styles.vert}>
							<p>Berkay alkan</p>
						</div>
					</div>
					<div className={`${styles.hor} ${styles.horSpec}`}>
						<div className={styles.imageWrapper}>
							<Image
								src="https://placehold.co/24"
								alt="UserProfilePic"
								width={24}
								height={24}
							/>
						</div>
						<div className={styles.vert}>
							<p>Serkan Celik</p>
						</div>
					</div>
					<div className={`${styles.hor} ${styles.horSpec}`}>
						<div className={styles.imageWrapper}>
							<Image
								src="https://placehold.co/24"
								alt="UserProfilePic"
								width={24}
								height={24}
							/>
						</div>
						<div className={styles.vert}>
							<p>Haktan Dongel</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RightBar;
