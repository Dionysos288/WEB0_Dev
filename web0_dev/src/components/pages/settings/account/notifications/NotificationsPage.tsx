'use client';
import Switch from '@/components/general/ui/switch/Switch';
import styles from './NotificationsPage.module.scss';
import Spacing from '@/components/general/Spacing';
import { useState } from 'react';
import Team from '@/svgs/Team';
import Link from 'next/link';
import ChevronDown from '@/svgs/ChevronDown';
const NotificationsPage = () => {
	const [showUpdatesInSidebar, setShowUpdatesInSidebar] = useState(false);
	const [showChangelogNewsletter, setShowChangelogNewsletter] = useState(false);
	const [showInviteAccepted, setShowInviteAccepted] = useState(false);
	const [showPrivacyLegalUpdates, setShowPrivacyLegalUpdates] = useState(false);
	const channels = [
		{
			title: 'Email',
			link: 'notifications/email',
			enabled: true,
			Icon: Team,
		},
		{
			title: 'Slack',
			link: 'notifications/slack',
			enabled: false,
			Icon: Team,
		},
	];
	const changelogUpdates = [
		{
			title: 'Show updates in sidebar',
			description: 'Highlight new features and updates in the sidebar',
			value: showUpdatesInSidebar,
			setter: setShowUpdatesInSidebar,
		},
		{
			title: 'Changelog Newsletter',
			description: 'Receive updates about new features and changes',
			value: showChangelogNewsletter,
			setter: setShowChangelogNewsletter,
		},
	];
	const otherUpdates = [
		{
			title: 'Invite Accepted',
			description: 'Email when invitees accept your invite',
			value: showInviteAccepted,
			setter: setShowInviteAccepted,
		},
		{
			title: 'Privacy and legal updates',
			description: 'Email when privacy and legal updates are made',
			value: showPrivacyLegalUpdates,
			setter: setShowPrivacyLegalUpdates,
		},
	];
	return (
		<>
			<div className={styles.profilePageWrapper}>
				<h2>Notifications Channels</h2>
				<Spacing space={2} />
				<p className={styles.subInfo}>
					Choose which channels you want to receive notifications from.
					Notifications will always go to your notifications box.
				</p>
				<Spacing space={28} />

				<div>
					{channels.map((channel, index) => (
						<>
							<Link
								href={channel.link}
								className={styles.channelItem}
								key={index}
							>
								<div className={styles.leftSide}>
									<div className={styles.channelIcon}>
										<channel.Icon
											fill="var(--main-80)"
											width="18"
											height="18"
										/>
									</div>
									<div>
										<h3>{channel.title}</h3>
										<div className={styles.status}>
											<div
												className={`${styles.statusIcon} ${
													channel.enabled ? styles.enabled : ''
												}`}
											/>
											<p>{channel.enabled ? 'Enabled' : 'Disabled'}</p>
										</div>
									</div>
								</div>
								<ChevronDown
									fill="var(--main-70)"
									width="16"
									height="16"
									style={{ transform: 'rotate(270deg)' }}
								/>
							</Link>
							{index !== channels.length - 1 && (
								<div className={styles.channelItemSeparator} />
							)}
						</>
					))}
				</div>
			</div>
			<Spacing space={28} />
			<div className={styles.profilePageWrapper}>
				<h2>Updates From WEB0</h2>
				<Spacing space={2} />
				<p className={styles.subInfo}>
					Get notified when new features are added, and stay updated with the
					latest changes.
				</p>
				<Spacing space={28} />

				<h3 className={styles.subHeader}>Changelog</h3>
				<Spacing space={2} />

				<div>
					{changelogUpdates.map((update, index) => (
						<div
							className={styles.notificationItem}
							key={index}
							onClick={() => update.setter(!update.value)}
						>
							<div className={styles.leftSide}>
								<h3>{update.title}</h3>
								<p>{update.description}</p>
							</div>

							<Switch isActive={update.value} />
						</div>
					))}
				</div>
				<Spacing space={28} />

				<h3 className={styles.subHeader}>Other Updates</h3>
				<Spacing space={2} />

				<div>
					{otherUpdates.map((update, index) => (
						<div
							className={styles.notificationItem}
							key={index}
							onClick={() => update.setter(!update.value)}
						>
							<div className={styles.leftSide}>
								<h3>{update.title}</h3>
								<p>{update.description}</p>
							</div>

							<Switch isActive={update.value} />
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default NotificationsPage;
