'use client';
import Image from 'next/image';
import styles from './SideBar.module.scss';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import ArrowLineRight from '@/svgs/ArrowLineRight';
import ChartPieSlice from '@/svgs/ChartPieSlice';
import Team from '@/svgs/Team';
import ShoppingBagOpen from '@/svgs/ShoppingBagOpen';
import Notebook from '@/svgs/Notebook';
import FolderV2 from '@/svgs/FolderV2';
import { Session } from '@/lib/auth';
import {
	Plus,
	LogOut,
	User,
	Settings,
	Crown,
	Share,
	HelpCircle,
	ExternalLink,
	ChevronDown,
	Trash2,
	UserPlus2Icon,
} from 'lucide-react';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';
import Project from '@/svgs/Project';
import AddTaskPopup from '@/components/pages/project/tasks/AddTaskPopup';
import AddProjectPopUp from '@/components/pages/projects/addProject/AddProjectPopup';
import AddLibraryPopup from '@/components/pages/library/AddLibraryPopup';
import { createPortal } from 'react-dom';
import SVG from '../../SVG';
import ProfilePopup from './components/ProfilePopup';

interface FavoriteItem {
	id: string;
	title: string;
	pathname: string;
	type: 'project' | 'task' | 'note' | 'library' | 'files' | 'phase';
}

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

const SideBar = ({
	libraryItems,
	session,
	favorites = [],
}: {
	libraryItems: { slug: string }[];
	session: Session;
	favorites?: FavoriteItem[];
}) => {
	const [favState, setFavState] = useState(true);
	const [openClient, setOpenClient] = useState(false);
	const [recentItems, setRecentItems] = useState<FavoriteItem[]>([]);
	const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
	const [quickActionOptions] = useState<QuickActionOption[]>([
		{ label: 'Create Task', value: 'task', icon: Team },
		{ label: 'New Project', value: 'project', icon: Project },
		{ label: 'New Library Item', value: 'library', icon: ShoppingBagOpen },
		{ label: 'Invite Teammate', value: 'invite', icon: Team },
	]);
	const accountOptions: QuickActionOption[] = [
		{ label: 'Switch space', value: 'switch', icon: Team, iconV2: Team },
		{ label: 'Log out', value: 'logout', icon: LogOut },
	];
	const profileOptions: QuickActionOption[] = [
		{ label: 'Your profile', value: 'profile', icon: User },
		{
			label: 'Settings',
			value: 'settings',
			icon: Settings,
			path: `/${session.session.organizationSlug}/settings/account/profile`,
		},
		{ label: 'Upgrade to Pro', value: 'upgrade', icon: Crown, deal: '20% off' },
		{ label: 'Referrals', value: 'referrals', icon: Share },
	];
	const helpOptions: QuickActionOption[] = [
		{
			label: "What's new?",
			value: 'whats-new',
			icon: HelpCircle,
			iconV2: ExternalLink,
		},
		{
			label: 'Get help?',
			value: 'get-help',
			icon: HelpCircle,
			iconV2: ExternalLink,
		},
	];

	// Popup states
	const [isTaskPopupOpen, setIsTaskPopupOpen] = useState(false);
	const [isProjectPopupOpen, setIsProjectPopupOpen] = useState(false);
	const [isLibraryPopupOpen, setIsLibraryPopupOpen] = useState(false);

	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const [isSwitchAccountOpen, setIsSwitchAccountOpen] = useState(false);

	useEffect(() => {
		try {
			const storedRecents = localStorage.getItem('recentItems');
			if (storedRecents) {
				const parsedRecents = JSON.parse(storedRecents);

				// Convert any old format items (path → pathname)
				const recentItems = parsedRecents.map(
					(item: {
						id: string;
						title: string;
						path?: string;
						pathname?: string;
						type: string;
					}) => {
						if (item.path && !item.pathname) {
							return {
								...item,
								pathname: item.path,
								type: [
									'project',
									'task',
									'note',
									'library',
									'files',
									'phase',
								].includes(item.type)
									? item.type
									: 'note',
							};
						}
						return item;
					}
				);

				setRecentItems(recentItems);

				// Save the updated format back to localStorage
				if (JSON.stringify(parsedRecents) !== JSON.stringify(recentItems)) {
					localStorage.setItem('recentItems', JSON.stringify(recentItems));
				}
			}
		} catch (error) {
			console.error('Failed to load recent items:', error);
		}
	}, []);

	const toggleFav = () => {
		setFavState(!favState);
	};

	return (
		<>
			{isTaskPopupOpen &&
				createPortal(
					<AddTaskPopup
						isOpen={isTaskPopupOpen}
						onClose={() => setIsTaskPopupOpen(false)}
					/>,
					document.body
				)}
			{isProjectPopupOpen &&
				createPortal(
					<AddProjectPopUp
						isOpen={isProjectPopupOpen}
						setIsopen={setIsProjectPopupOpen}
					/>,
					document.body
				)}
			{isLibraryPopupOpen &&
				session.session.activeOrganizationId &&
				createPortal(
					<AddLibraryPopup
						isOpen={isLibraryPopupOpen}
						onClose={() => setIsLibraryPopupOpen(false)}
						categories={[]}
						organizationId={session.session.activeOrganizationId}
						libraryTypeId="default"
					/>,
					document.body
				)}
			<div className={styles.sideBarWrapper}>
				<div className={styles.SideBar}>
					<div className={styles.sideBarContent}>
						<div className={styles.user}>
							<div
								className={styles.userInfo}
								onClick={() => setIsUserMenuOpen(true)}
							>
								<div className={styles.imgWrapper}>
									<Image
										src={session.user.image}
										alt="user"
										width={24}
										height={24}
									/>
								</div>
								<p>{session.session.organizationName}</p>
								<ChevronDown
									size={16}
									color="var(--main-80)"
									style={isUserMenuOpen ? { transform: 'rotate(180deg)' } : {}}
									className={styles.userMenuChevron}
								/>
								{isUserMenuOpen &&
									createPortal(
										<ClickOutsideWrapper
											onClose={() => {
												setIsUserMenuOpen(false);
												setIsSwitchAccountOpen(false);
											}}
										>
											<ProfilePopup
												profileOptions={profileOptions}
												helpOptions={helpOptions}
												accountOptions={accountOptions}
												setIsSwitchAccountOpen={setIsSwitchAccountOpen}
												isSwitchAccountOpen={isSwitchAccountOpen}
											/>
										</ClickOutsideWrapper>,
										document.body
									)}
							</div>
							<button
								onClick={() => setIsQuickActionsOpen(true)}
								className={styles.quickActionsButton}
							>
								<Plus fill="var(--main-55)" width="14" height="14" />
								{isQuickActionsOpen && (
									<ClickOutsideWrapper
										onClose={() => setIsQuickActionsOpen(false)}
									>
										<div className={styles.quickActionsPopup}>
											<div className={styles.quickActionsPopupHeader}>
												<h2>Quick Actions</h2>
											</div>
											<div className={styles.quickActionsPopupBody}>
												{quickActionOptions.map((option) => (
													<div
														className={styles.quickActionsPopupItem}
														key={option.value}
														onClick={() => {
															setIsQuickActionsOpen(false);
															if (option.value === 'task') {
																setIsTaskPopupOpen(true);
															} else if (option.value === 'project') {
																setIsProjectPopupOpen(true);
															} else if (option.value === 'library') {
																setIsLibraryPopupOpen(true);
															}
														}}
													>
														<option.icon
															fill="var(--main-55)"
															width="14"
															height="14"
														/>
														<p>{option.label}</p>
													</div>
												))}
											</div>
										</div>
									</ClickOutsideWrapper>
								)}
							</button>
						</div>
						<div className={styles.highlight}>
							<div className={styles.favorites}>
								<button
									onClick={() => {
										if (!favState) toggleFav();
									}}
								>
									<h2 className={favState ? styles.active : styles.normal}>
										Favorites
									</h2>
								</button>
								<button
									onClick={() => {
										if (favState) toggleFav();
									}}
								>
									<h2 className={favState ? styles.normal : styles.active}>
										Recently
									</h2>
								</button>
							</div>
							<div className={styles.items}>
								{favState ? (
									favorites.length > 0 ? (
										favorites.map((item) => (
											<Link
												href={item.pathname}
												className={styles.horizontal}
												key={`${item.type}-${item.id}`}
											>
												<div className={styles.circle}></div>
												<p className={styles.item}>{item.title}</p>
											</Link>
										))
									) : (
										<div className={styles.emptyState}>
											<p>No favorites yet</p>
											<small>Star items to see them here</small>
										</div>
									)
								) : recentItems.length > 0 ? (
									recentItems.map((item) => (
										<Link
											href={item.pathname}
											className={styles.horizontal}
											key={`${item.type}-${item.id}`}
										>
											<div className={styles.circle}></div>
											<p className={styles.item}>{item.title}</p>
										</Link>
									))
								) : (
									<div className={styles.emptyState}>
										<p>No recent items yet</p>
										<small>Open items to see them here</small>
									</div>
								)}
							</div>
						</div>
						<div className={styles.dashboards}>
							<h2>Dashboards</h2>
							<Link
								href={`/${session.session.organizationSlug}`}
								className={styles.hor}
							>
								<ArrowLineRight fill="transparant" height="16" width="16" />

								<ChartPieSlice width="20" height="20" fill="var(--main)" />
								<p>Home</p>
							</Link>

							<Link
								href={`/${session.session.organizationSlug}/projects`}
								className={styles.hor}
							>
								<ArrowLineRight fill="transparant" height="16" width="16" />

								<FolderV2 width="20" height="20" fill="var(--main)" />

								<p>Projects</p>
							</Link>
							<button
								className={styles.hor}
								onClick={() => setOpenClient(!openClient)}
							>
								<div
									className={`${styles.svg} ${openClient ? styles.rotate : ''}`}
								>
									<ArrowLineRight
										fill="var(--main-35)"
										height="16"
										width="16"
									/>
								</div>

								<Team fill="var(--main)" width="20" height="20" />
								<p>Clients</p>
							</button>
							<motion.ul
								animate={{
									height: openClient ? 'auto' : 0,
									opacity: openClient ? 1 : 0.2,
								}}
								initial={{ height: 0, opacity: 0.2, margin: '-2px 0' }}
								transition={{
									bounce: 0,
									duration: 0.2,
									ease: 'easeOut',
								}}
								style={{ overflow: 'hidden' }}
								className={styles.items}
							>
								<li>
									<Link href={`/${session.session.organizationSlug}/clients`}>
										Overview
									</Link>
								</li>
								<li>
									<Link
										href={`/${session.session.organizationSlug}/clients/leads`}
									>
										Leads
									</Link>
								</li>
							</motion.ul>
						</div>
						<div className={styles.dashboards}>
							<h2>Library</h2>
							<Link
								href={`/${session.session.organizationSlug}/library`}
								className={styles.hor}
							>
								<ArrowLineRight fill="transparant" height="16" width="16" />

								<ShoppingBagOpen fill="var(--main)" width="20" height="20" />

								<p>Overview</p>
							</Link>
							{libraryItems.map((item, index) => (
								<Link
									href={`/${session.session.organizationSlug}/library/category/${item.slug}`}
									className={styles.hor}
									key={index}
								>
									<ArrowLineRight fill="transparant" height="16" width="16" />

									<ShoppingBagOpen fill="var(--main)" width="20" height="20" />

									<p>{item.slug}</p>
								</Link>
							))}
							<Link
								href={`/${session.session.organizationSlug}/library/favorites`}
								className={styles.hor}
							>
								<ArrowLineRight fill="transparant" height="16" width="16" />

								<ShoppingBagOpen fill="var(--main)" width="20" height="20" />

								<p>Favorite</p>
							</Link>
							<Link
								href={`/${session.session.organizationSlug}/notes`}
								className={styles.hor}
							>
								<ArrowLineRight fill="transparant" height="16" width="16" />

								<Notebook fill="var(--main)" width="20" height="20" />

								<p>Notes</p>
							</Link>
						</div>
					</div>
					<div className={styles.sideBarFooterWrapper}>
						<div className={styles.infoBanner}></div>
						<div className={styles.sideBarFooter}>
							<SVG isButton>
								<Trash2 color="var(--main-80)" width="16" height="16" />
							</SVG>

							<div className={styles.footerRight}>
								<SVG isButton>
									<HelpCircle color="var(--main-80)" width="16" height="16" />
								</SVG>
								<SVG isButton>
									<UserPlus2Icon
										color="var(--main-80)"
										width="16"
										height="16"
									/>
								</SVG>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SideBar;
