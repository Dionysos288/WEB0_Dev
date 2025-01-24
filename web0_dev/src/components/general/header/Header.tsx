'use client';
import SVG from '../SVG';
import { CSSProperties, useState } from 'react';
import BreadCrumbs from './BreadCrumbs';
import styles from './Header.module.scss';
import { History, Notification, Search, Side, Star, Sun } from '@/svgs';

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
							<Side style={{ fill: '#484643' }} />
						</SVG>
					</div>

					<SVG>
						<Star />
					</SVG>
					<BreadCrumbs />
				</div>
				<div className={styles.rightSide}>
					<span>
						<Search style={{ fill: '#484643' }} />
					</span>
					<div className={styles.emojis}>
						<SVG>
							<Sun style={{ fill: '#484643' }} />
						</SVG>
						<SVG>
							<History style={{ fill: '#484643' }} />
						</SVG>
						<SVG>
							<Notification style={{ fill: '#484643' }} />
						</SVG>
						<div
							style={{ display: 'contents' }}
							onClick={() => setIsOpenRightBar(!isOpenRightBarNew)}
						>
							<SVG>
								<Side style={{ fill: '#484643' }} />
							</SVG>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;
