import styles from './Sidebar.module.scss';
import Link from 'next/link';
import { HelpCircle, UserPlus2Icon, Trash2, ChevronDown } from 'lucide-react';
import SVG from '@/components/general/SVG';
import ChartPieSlice from '@/svgs/ChartPieSlice';
import FolderV2 from '@/svgs/FolderV2';
import { Session } from '@/lib/auth';
import { usePathname } from 'next/navigation';

const Sidebar = ({ session }: { session: Session }) => {
	const pathname = usePathname();

	const isActiveLink = (href: string) => pathname === href;

	return (
		<div className={styles.sideBarWrapper}>
			<div className={styles.SideBar}>
				<div className={styles.sideBarContent}>
					<Link
						href={`/${session.session.organizationSlug}`}
						className={`${styles.backToApp} ${
							isActiveLink(`/${session.session.organizationSlug}`)
								? styles.active
								: ''
						}`}
					>
						<ChevronDown
							color="var(--main)"
							width={18}
							height={18}
							style={{ transform: 'rotate(90deg)' }}
						/>
						<p>Back To App</p>
					</Link>
					<div className={styles.dashboards}>
						<h2>Account</h2>
						<Link
							href={`/${session.session.organizationSlug}/settings/account/profile`}
							className={`${styles.hor} ${
								isActiveLink(
									`/${session.session.organizationSlug}/settings/account/profile`
								)
									? styles.active
									: ''
							}`}
						>
							<ChartPieSlice width="20" height="20" fill="var(--main)" />
							<p>Profile</p>
						</Link>

						<Link
							href={`/${session.session.organizationSlug}/settings/account/notifications`}
							className={`${styles.hor} ${
								isActiveLink(
									`/${session.session.organizationSlug}/settings/account/notifications`
								)
									? styles.active
									: ''
							}`}
						>
							<FolderV2 width="20" height="20" fill="var(--main)" />

							<p>Notifications</p>
						</Link>
						<Link
							href={`/${session.session.organizationSlug}/settings/account/security`}
							className={`${styles.hor} ${
								isActiveLink(
									`/${session.session.organizationSlug}/settings/account/security`
								)
									? styles.active
									: ''
							}`}
						>
							<FolderV2 width="20" height="20" fill="var(--main)" />

							<p>Security & Access</p>
						</Link>
						<Link
							href={`/${session.session.organizationSlug}/settings/account/connections`}
							className={`${styles.hor} ${
								isActiveLink(
									`/${session.session.organizationSlug}/settings/account/connections`
								)
									? styles.active
									: ''
							}`}
						>
							<FolderV2 width="20" height="20" fill="var(--main)" />

							<p>Connnected Accounts</p>
						</Link>
					</div>
					<div className={styles.dashboards}>
						<h2>Administration</h2>
						<Link
							href={`/${session.session.organizationSlug}/settings/administration/workspace`}
							className={`${styles.hor} ${
								isActiveLink(
									`/${session.session.organizationSlug}/settings/administration/workspace`
								)
									? styles.active
									: ''
							}`}
						>
							<ChartPieSlice width="20" height="20" fill="var(--main)" />
							<p>Workspace</p>
						</Link>

						<Link
							href={`/${session.session.organizationSlug}/settings/administration/teams`}
							className={`${styles.hor} ${
								isActiveLink(
									`/${session.session.organizationSlug}/settings/administration/teams`
								)
									? styles.active
									: ''
							}`}
						>
							<FolderV2 width="20" height="20" fill="var(--main)" />

							<p>Teams</p>
						</Link>
						<Link
							href={`/${session.session.organizationSlug}/settings/administration/members`}
							className={`${styles.hor} ${
								isActiveLink(
									`/${session.session.organizationSlug}/settings/administration/members`
								)
									? styles.active
									: ''
							}`}
						>
							<FolderV2 width="20" height="20" fill="var(--main)" />

							<p>Members</p>
						</Link>
						<Link
							href={`/${session.session.organizationSlug}/settings/administration/security`}
							className={`${styles.hor} ${
								isActiveLink(
									`/${session.session.organizationSlug}/settings/administration/security`
								)
									? styles.active
									: ''
							}`}
						>
							<FolderV2 width="20" height="20" fill="var(--main)" />

							<p>Security</p>
						</Link>
						<Link
							href={`/${session.session.organizationSlug}/settings/administration/billing`}
							className={`${styles.hor} ${
								isActiveLink(
									`/${session.session.organizationSlug}/settings/administration/billing`
								)
									? styles.active
									: ''
							}`}
						>
							<FolderV2 width="20" height="20" fill="var(--main)" />

							<p>Billing</p>
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
								<UserPlus2Icon color="var(--main-80)" width="16" height="16" />
							</SVG>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
