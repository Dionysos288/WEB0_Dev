'use client';
import Image from 'next/image';
import styles from './SideBar.module.scss';
import {
	Arrow,
	ChartPie,
	Library,
	Projects,
	Leads,
	Account,
	Notes,
	Social,
} from '@/svgs';
import Link from 'next/link';
import { useState } from 'react';
const SideBar = () => {
	const items = ['Overview', 'Projects'];
	const [favState, setFavState] = useState(true);

	const toggleFav = () => {
		setFavState(!favState);
	};
	return (
		<div className={styles.sideBar}>
			<div className={styles.user}>
				<div className={styles.imgWrapper}>
					<Image
						src="https://placehold.co/24"
						alt="user"
						width={24}
						height={24}
					/>
				</div>
				<h3>Dion Zeneli</h3>
			</div>
			<div className={styles.highlight}>
				<div className={styles.favorites}>
					<button
						onClick={() => {
							if (!favState) toggleFav();
						}}
					>
						<h4 className={favState ? styles.active : styles.normal}>
							Favorites
						</h4>
					</button>
					<button
						onClick={() => {
							if (favState) toggleFav();
						}}
					>
						<h4 className={favState ? styles.normal : styles.active}>
							Recently
						</h4>
					</button>
				</div>
				<div className={styles.items}>
					{items.map((item, index) => (
						<Link href={'/'} className={styles.horizontal} key={index}>
							<div className={styles.circle}></div>
							<h5 className={styles.item}>{item}</h5>
						</Link>
					))}
				</div>
			</div>
			<div className={styles.dashboards}>
				<h4>Dashboards</h4>
				<Link href={''} className={styles.hor}>
					<Arrow style={{ fill: '#484643', opacity: 0 }} />

					<ChartPie style={{ fill: '#484643' }} />
					<h5>Home</h5>
				</Link>
				<div className={styles.hor}>
					<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
					<Library style={{ fill: '#484643' }} />

					<h5>Library</h5>
				</div>
				<div className={styles.hor}>
					<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
					<Projects style={{ fill: '#484643' }} />

					<h5>Projects</h5>
				</div>
				<div className={styles.hor}>
					<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
					<Leads style={{ fill: '#484643' }} />

					<h5>Leads</h5>
				</div>
			</div>
			<div className={styles.dashboards}>
				<h4>Pages</h4>

				<div className={styles.hor}>
					<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
					<Account style={{ fill: '#484643' }} />

					<h5>Account</h5>
				</div>
				<div className={styles.hor}>
					<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
					<Notes style={{ fill: '#484643' }} />

					<h5>Notes</h5>
				</div>
				<div className={styles.hor}>
					<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
					<Social style={{ fill: '#484643' }} />

					<h5>Social</h5>
				</div>
			</div>
		</div>
	);
};

export default SideBar;
