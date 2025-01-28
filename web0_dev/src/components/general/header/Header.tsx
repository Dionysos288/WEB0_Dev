'use client';
import SVG from '@components/general/SVG';
import { CSSProperties, useState } from 'react';
import BreadCrumbs from '@components/general/header/BreadCrumbs';
import styles from './Header.module.scss';
import Sidebar from '@/svgs/Sidebar';
import Star from '@/svgs/Star';
import Search from '@/svgs/Search';
import ClockCounterClockwise from '@/svgs/ClockCounterClockwise';
import Bell from '@/svgs/Bell';
import ThemeToggle from '@/components/general/header/ThemeToggle';

const Header = ({
	isOpenLeftBar,
	isOpenRightBar,
	widthLeftbar,
	widthRightbar,
}: {
	isOpenLeftBar: boolean;
	isOpenRightBar: boolean;
	widthLeftbar: string;
	widthRightbar: string;
}) => {
	const [isOpenLeftBarNew, setIsOpenLeftBar] = useState(isOpenLeftBar);
	const [isOpenRightBarNew, setIsOpenRightBar] = useState(isOpenRightBar);
	const headerStyle: CSSProperties = {
		'--widthLeftBar': `${widthLeftbar}`,
		'--widthRightBar': `${widthRightbar}`,
	} as CSSProperties;
	let headerClass = styles.header;
	if (!isOpenLeftBar && !isOpenRightBar) {
		headerClass += ` ${styles.bothOpen}`;
	} else if (!isOpenLeftBar) {
		headerClass += ` ${styles.leftOpen}`;
	} else if (!isOpenRightBar) {
		headerClass += ` ${styles.rightOpen}`;
	}
	return (
		<>
			<header className={headerClass} style={headerStyle}>
				<div className={styles.leftSide}>
					<div
						style={{ display: 'contents' }}
						onClick={() => setIsOpenLeftBar(!isOpenLeftBarNew)}
					>
						<SVG>
							<Sidebar fill="var(--main)" width="20" height="20" />
						</SVG>
					</div>

					<SVG>
						<Star fill="var(--main)" width="20" height="20" />
					</SVG>
					<BreadCrumbs />
				</div>
				<div className={styles.rightSide}>
					<span>
						<Search fill="var(--main)" width="20" height="20" />
					</span>
					<div className={styles.emojis}>
						<ThemeToggle />
						<SVG>
							<ClockCounterClockwise
								fill="var(--main)"
								width="20"
								height="20"
							/>
						</SVG>
						<SVG>
							<Bell fill="var(--main)" width="20" height="20" />
						</SVG>
						<div
							style={{ display: 'contents' }}
							onClick={() => setIsOpenRightBar(!isOpenRightBarNew)}
						>
							<SVG>
								<Sidebar fill="var(--main)" width="20" height="20" />
							</SVG>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;
