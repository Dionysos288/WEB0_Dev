'use client';
import { Session } from 'better-auth';
import styles from './SecurityPage.module.scss';
import Spacing from '@/components/general/Spacing';
import { authClient } from '@/lib/auth-clients';
import { FaEdge, FaFirefox } from 'react-icons/fa';
import { FaChrome } from 'react-icons/fa';
import { FaSafari } from 'react-icons/fa';

const SecurityPage = ({ sessions }: { sessions: Session[] }) => {
	const revokeSessionUser = async (sessionId: string) => {
		await authClient.revokeSession({
			token: sessionId,
		});
	};
	return (
		<>
			<div className={styles.profilePageWrapper}>
				<h2>Sessions</h2>
				<Spacing space={2} />
				<p className={styles.subInfo}>Devices you have logged in to.</p>
				<Spacing space={28} />

				<div>
					{sessions.map((session) => {
						const userAgent = session.userAgent || '';
						let browserInfo = 'Unknown browser';
						let osInfo = 'Unknown OS';
						let icon = '';

						if (userAgent) {
							if (userAgent.includes('Firefox')) {
								browserInfo = 'Firefox';
								icon = (
									<FaFirefox fill="var(--main-80)" width="32" height="32" />
								);
							} else if (userAgent.includes('Chrome')) {
								browserInfo = 'Chrome';
								icon = (
									<FaChrome fill="var(--main-80)" width="32" height="32" />
								);
							} else if (userAgent.includes('Safari')) {
								browserInfo = 'Safari';
								icon = (
									<FaSafari fill="var(--main-80)" width="32" height="32" />
								);
							} else if (userAgent.includes('Edge')) {
								browserInfo = 'Edge';
								icon = <FaEdge fill="var(--main-80)" width="32" height="32" />;
							}

							if (userAgent.includes('Windows')) {
								osInfo = 'Windows';
							} else if (userAgent.includes('Mac')) {
								osInfo = 'macOS';
							} else if (userAgent.includes('Linux')) {
								osInfo = 'Linux';
							} else if (
								userAgent.includes('iPhone') ||
								userAgent.includes('iPad')
							) {
								osInfo = 'iOS';
							} else if (userAgent.includes('Android')) {
								osInfo = 'Android';
							}
						}

						return (
							<div key={session.id} className={styles.channelItem}>
								<div className={styles.leftSide}>
									<div className={styles.channelIcon}>{icon}</div>
									<div>
										<h3>
											{browserInfo} on {osInfo}
										</h3>
									</div>
								</div>

								<div className={styles.rightSide}>
									<button
										onClick={() => {
											revokeSessionUser(session.id);
										}}
									>
										Log Out
									</button>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			<Spacing space={28} />
			<div className={styles.profilePageWrapper}>
				<h2>Authorized Applications</h2>
				<Spacing space={2} />
				<p className={styles.subInfo}>
					OAuth applications you&apos;ve approved
				</p>
				<Spacing space={28} />
				<div>
					<p className={styles.noInfo}>
						No applications have been authorized to connect with your account
					</p>
				</div>
			</div>
		</>
	);
};

export default SecurityPage;
