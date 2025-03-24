'use client';
import SVG from '@components/general/SVG';
import { CSSProperties } from 'react';
import BreadCrumbs from '@components/general/header/BreadCrumbs';
import styles from './Header.module.scss';
import Sidebar from '@/svgs/Sidebar';
import Star from '@/svgs/Star';
import Search from '@/svgs/Search';
import ClockCounterClockwise from '@/svgs/ClockCounterClockwise';
import Bell from '@/svgs/Bell';
import ThemeToggle from '@/components/general/header/ThemeToggle';

interface HeaderProps {
	isOpenLeftBar: boolean;
	isOpenRightBarNotifications: boolean;
	isOpenRightBarComments: boolean;
	isTaskDetailPage: boolean;
	widthLeftbar: string;
	widthRightbar: string;
	onToggleNotifications: (value: boolean) => void;
	onToggleComments: (value: boolean) => void;
	onToggleLeftBar: (value: boolean) => void;
	onToggleFavorite?: (value: boolean) => void;
	isFavorite?: boolean;
}

const Header = ({
	isOpenLeftBar,
	isOpenRightBarNotifications,
	isOpenRightBarComments,
	isTaskDetailPage,
	widthLeftbar,
	widthRightbar,
	onToggleNotifications,
	onToggleComments,
	onToggleLeftBar,
	onToggleFavorite,
	isFavorite = false,
}: HeaderProps) => {
	const headerStyle: CSSProperties = {
		'--widthLeftBar': `${widthLeftbar}`,
		'--widthRightBar': `${widthRightbar}`,
	} as CSSProperties;
	console.log(isTaskDetailPage);
	let headerClass = styles.header;
	if (!isOpenLeftBar && !isOpenRightBarComments) {
		headerClass += ` ${styles.bothOpen}`;
	} else if (!isOpenLeftBar) {
		headerClass += ` ${styles.leftOpen}`;
	} else if (!isOpenRightBarComments) {
		headerClass += ` ${styles.rightOpen}`;
	}

	const handleToggleFavorite = () => {
		if (onToggleFavorite) {
			onToggleFavorite(!isFavorite);
		}
	};

	return (
		<>
			<header className={headerClass} style={headerStyle}>
				<div className={styles.leftSide}>
					<SVG isButton onClick={() => onToggleLeftBar(!isOpenLeftBar)}>
						<Sidebar fill="var(--main)" width="20" height="20" />
					</SVG>
					<SVG
						isButton
						onClick={handleToggleFavorite}
						className={isFavorite ? styles.active : ''}
					>
						<Star
							fill={isFavorite ? 'var(--orange)' : 'transparent'}
							border={isFavorite ? 'var(--orange)' : 'var(--main)'}
							width="20"
							height="20"
						/>
					</SVG>
					<BreadCrumbs />
				</div>
				<div className={styles.rightSide}>
					<SVG isButton>
						<Search fill="var(--main)" width="20" height="20" />
					</SVG>
					<div className={styles.emojis}>
						<ThemeToggle />
						<SVG isButton>
							<ClockCounterClockwise
								fill="var(--main)"
								width="20"
								height="20"
							/>
						</SVG>
						<SVG
							isButton
							onClick={() =>
								onToggleNotifications(!isOpenRightBarNotifications)
							}
						>
							<Bell fill="var(--main)" width="20" height="20" />
						</SVG>
						{isTaskDetailPage && (
							<SVG
								isButton
								onClick={() => onToggleComments(!isOpenRightBarComments)}
							>
								<Sidebar fill="var(--main)" width="20" height="20" />
							</SVG>
						)}
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;
