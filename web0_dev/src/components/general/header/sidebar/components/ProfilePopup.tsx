import styles from './ProfilePopup.module.scss';
import Image from 'next/image';
import { UserCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Spacing from '@/components/general/Spacing';
import Team from '@/svgs/Team';

interface QuickActionOption {
	label: string;
	value: string;
	icon: React.ComponentType<{
		fill?: string;
		color?: string;
		width?: string;
		height?: string;
	}>;
	iconV2?: React.ComponentType<{
		fill?: string;
		color?: string;
		width?: string;
		height?: string;
	}>;
	deal?: string;
	path?: string;
}
const ProfilePopup = ({
	profileOptions,
	helpOptions,
	accountOptions,
	setIsSwitchAccountOpen,
	isSwitchAccountOpen,
}: {
	profileOptions: QuickActionOption[];
	helpOptions: QuickActionOption[];
	accountOptions: QuickActionOption[];
	setIsSwitchAccountOpen: (isSwitchAccountOpen: boolean) => void;
	isSwitchAccountOpen: boolean;
}) => {
	return (
		<div className={styles.userMenu}>
			<div className={styles.userMenuHeader}>
				<div className={styles.userHeader}>
					<div className={styles.userProfile}>
						<Image
							src="https://placehold.co/40"
							alt="user"
							width={40}
							height={40}
							className={styles.profileImage}
						/>
						<div className={styles.userDetails}>
							<h3>Lisa Kim</h3>
							<p>lisa@boards.com</p>
						</div>
					</div>
					<div className={styles.userStatus}>
						<span className={styles.statusDot} />
						<span>Online</span>
					</div>
				</div>
				<Spacing space={8} />
				<button className={styles.menuItem}>
					<div className={styles.menuItemIcon}>
						<UserCircle color="var(--main-55)" width="16" height="16" />
						<span>Update status</span>
					</div>
					<ChevronRight size={16} />
				</button>
			</div>
			<div className={styles.menuItems}>
				{profileOptions.map((option) =>
					option.path ? (
						<Link
							href={option.path}
							className={styles.menuItem}
							key={option.value}
						>
							<div className={styles.menuItemIcon}>
								<option.icon color="var(--main-55)" width="16" height="16" />
								<span>{option.label}</span>
							</div>
							{option.deal && (
								<span className={styles.deal}>{option.deal}</span>
							)}
							{option.iconV2 && (
								<option.iconV2 color="var(--main-55)" width="16" height="16" />
							)}
						</Link>
					) : (
						<button className={styles.menuItem} key={option.value}>
							<div className={styles.menuItemIcon}>
								<option.icon color="var(--main-55)" width="16" height="16" />
								<span>{option.label}</span>
							</div>
							{option.deal && (
								<span className={styles.deal}>{option.deal}</span>
							)}
							{option.iconV2 && (
								<option.iconV2 color="var(--main-55)" width="16" height="16" />
							)}
						</button>
					)
				)}

				<div className={styles.menuItemSeparator} />
				{helpOptions.map((option) =>
					option.path ? (
						<Link
							href={option.path}
							className={styles.menuItem}
							key={option.value}
						>
							<div className={styles.menuItemIcon}>
								<option.icon color="var(--main-55)" width="16" height="16" />
								<span>{option.label}</span>
							</div>
							{option.deal && (
								<span className={styles.deal}>{option.deal}</span>
							)}
							{option.iconV2 && (
								<option.iconV2 color="var(--main-55)" width="16" height="16" />
							)}
						</Link>
					) : (
						<button className={styles.menuItem} key={option.value}>
							<div className={styles.menuItemIcon}>
								<option.icon color="var(--main-55)" width="16" height="16" />
								<span>{option.label}</span>
							</div>
							{option.deal && (
								<span className={styles.deal}>{option.deal}</span>
							)}
							{option.iconV2 && (
								<option.iconV2 color="var(--main-55)" width="16" height="16" />
							)}
						</button>
					)
				)}
				<div className={styles.menuItemSeparator} />

				<button
					className={`${styles.menuItem} ${styles.switchAccount}`}
					onClick={(e) => {
						e.stopPropagation();
						setIsSwitchAccountOpen(!isSwitchAccountOpen);
					}}
				>
					<div className={styles.menuItemIcon}>
						<Team fill="var(--main-55)" width="16" height="16" />
						<span>Switch account</span>
					</div>
				</button>
				{isSwitchAccountOpen && (
					<div className={styles.switchOptions}>
						{accountOptions.map((option) =>
							option.path ? (
								<Link
									href={option.path}
									className={styles.menuItem}
									key={option.value}
								>
									<div className={styles.menuItemIcon}>
										<option.icon
											color="var(--main-55)"
											width="16"
											height="16"
										/>
										<span>{option.label}</span>
									</div>
									{option.deal && (
										<span className={styles.deal}>{option.deal}</span>
									)}
									{option.iconV2 && (
										<option.iconV2
											color="var(--main-55)"
											width="16"
											height="16"
										/>
									)}
								</Link>
							) : (
								<button className={styles.menuItem} key={option.value}>
									<div className={styles.menuItemIcon}>
										<option.icon
											color="var(--main-55)"
											width="16"
											height="16"
										/>
										<span>{option.label}</span>
									</div>
									{option.deal && (
										<span className={styles.deal}>{option.deal}</span>
									)}
									{option.iconV2 && (
										<option.iconV2
											color="var(--main-55)"
											width="16"
											height="16"
										/>
									)}
								</button>
							)
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ProfilePopup;
