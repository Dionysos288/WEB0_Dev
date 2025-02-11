import Image from 'next/image';
import styles from './Team.module.scss';

const Team = ({ team }: { team: string[] }) => {
	if (!team || team.length === 0) return null;
	return (
		<div className={styles.TeamWrapper}>
			{team.map((member, index) => {
				if (team.length > 3 && index === 2) {
					return (
						<div className={styles.extra} key={index}>
							<p>+{team.length - 2}</p>
						</div>
					);
				} else if (index < 2 || team.length <= 3) {
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
	);
};

export default Team;
