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
		<div className={styles.sideBarWrapper}>
			<div className={styles.SideBar}>
				<div className={styles.user}>
					<div className={styles.imgWrapper}>
						<Image
							src="https://placehold.co/24"
							alt="user"
							width={24}
							height={24}
						/>
					</div>
					<p>Dion Zeneli</p>
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
						{items.map((item, index) => (
							<Link href={'/'} className={styles.horizontal} key={index}>
								<div className={styles.circle}></div>
								<p className={styles.item}>{item}</p>
							</Link>
						))}
					</div>
				</div>
				<div className={styles.dashboards}>
					<h2>Dashboards</h2>
					<Link href={''} className={styles.hor}>
						<Arrow style={{ fill: '#484643', opacity: 0 }} />

						<ChartPie style={{ fill: '#484643' }} />
						<p>Home</p>
					</Link>
					<div className={styles.hor}>
						<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
						<Library style={{ fill: '#484643' }} />

						<p>Library</p>
					</div>
					<div className={styles.hor}>
						<Arrow style={{ fill: '#484643', opacity: 0 }} />
						<Projects style={{ fill: '#484643' }} />

						<p>Projects</p>
					</div>
					<div className={styles.hor}>
						<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
						<Leads style={{ fill: '#484643' }} />

						<p>Clients</p>
					</div>
				</div>
				<div className={styles.dashboards}>
					<h2>Pages</h2>

					<div className={styles.hor}>
						<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
						<Account style={{ fill: '#484643' }} />

						<p>Account</p>
					</div>
					<div className={styles.hor}>
						<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
						<Notes style={{ fill: '#484643' }} />

						<p>Notes</p>
					</div>
					<div className={styles.hor}>
						<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
						<Social style={{ fill: '#484643' }} />

						<p>Social</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SideBar;
