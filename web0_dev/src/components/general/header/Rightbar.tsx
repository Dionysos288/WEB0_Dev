import Image from 'next/image';
import styles from './RightBar.module.scss';
import { Bug, User, Broadcast } from '@/svgs';
const RightBar = () => {
	return (
		<div className={styles.rightBar}>
			<div className={styles.notifications}>
				<h4>Notifications</h4>
				<div className={styles.hor}>
					<div className={styles.block} style={{ backgroundColor: '#e8b594' }}>
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
						<h5>You have A bug that needs...</h5>
						<p>Just now</p>
					</div>
				</div>
				<div className={styles.hor}>
					<div className={styles.block} style={{ backgroundColor: '#EDE9DD' }}>
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
						<h5>New User Registered</h5>
						<p>59 minutes ago</p>
					</div>
				</div>
				<div className={styles.hor}>
					<div className={styles.block} style={{ backgroundColor: '#e8b594' }}>
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
						<h5>You have a bug that needs...</h5>
						<p>12 hours ago</p>
					</div>
				</div>
				<div className={styles.hor}>
					<div className={styles.block} style={{ backgroundColor: '#EDE9DD' }}>
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
						<h5>Andi Lane subscribed to you</h5>
						<p>Today, 11:59 AM</p>
					</div>
				</div>
			</div>
			<div className={styles.activities}>
				<h4>Activities</h4>
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
			<div className={styles.Contacts}>
				<h4>Contacts</h4>
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
						<h5>Dion Zeneli</h5>
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
						<h5>Dren Zeneli</h5>
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
						<h5>Berkay alkan</h5>
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
						<h5>Serkan Celik</h5>
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
						<h5>Haktan Dongel</h5>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RightBar;
