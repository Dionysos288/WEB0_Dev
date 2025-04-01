'use client';
import Spacing from '@/components/general/Spacing';
import styles from './EmailPage.module.scss';
import Switch from '@/components/general/ui/switch/Switch';
import { useState } from 'react';
const EmailPage = () => {
	const [showUpdatesInSidebar, setShowUpdatesInSidebar] = useState(false);
	const [showChangelogNewsletter, setShowChangelogNewsletter] = useState(false);
	const [showInviteAccepted, setShowInviteAccepted] = useState(false);
	const [showPrivacyLegalUpdates, setShowPrivacyLegalUpdates] = useState(false);
	const [showEmailNotifications, setShowEmailNotifications] = useState(false);
	const mainUpdate = [
		{
			title: 'Enable email notifications',
			description: 'Receive email notifications for your account',
			value: showEmailNotifications,
			setter: setShowEmailNotifications,
		},
	];
	const generalUpdates = [
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
	const featureUpdates = [
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
		<div className={styles.profilePageWrapper}>
			<h2>Email Notifications</h2>

			<Spacing space={4} />
			<div>
				{mainUpdate.map((update, index) => (
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

			<h3 className={styles.subHeader}>General Notifications</h3>
			<Spacing space={2} />
			<div>
				{generalUpdates.map((update, index) => (
					<div
						className={`${styles.notificationItem} ${
							!showEmailNotifications ? styles.disabled : ''
						}`}
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

			<h3 className={styles.subHeader}>Feature Notifications</h3>
			<Spacing space={2} />

			<div>
				{featureUpdates.map((update, index) => (
					<div
						className={`${styles.notificationItem} ${
							!showEmailNotifications ? styles.disabled : ''
						}`}
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
	);
};

export default EmailPage;
