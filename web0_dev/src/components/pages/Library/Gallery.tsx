'use client';
import styles from './Gallery.module.scss';
import Link from 'next/link';
import { ExtendedLibrary } from '@/components/types/types';
import Image from 'next/image';
import { makeFavorite } from '@/actions/CRUDLibrary';
import { useState } from 'react';
import BookmarkFilled from '@/svgs/Bookmark-Filled';
import BookmarkOutline from '@/svgs/Bookmark-Outline';
import PlusRoundStroke from '@/svgs/Plus-Round-Stroke';

const Gallery = ({ data }: { data: ExtendedLibrary | ExtendedLibrary[] }) => {
	const items = Array.isArray(data) ? data : [data];
	const [favoriteStatus, setFavoriteStatus] = useState(
		items.reduce((acc, item) => {
			acc[item.id] = item.favorite;
			return acc;
		}, {} as { [key: string]: boolean })
	);

	const handleFavorite = async (id: string, favorite: boolean) => {
		setFavoriteStatus((prevStatus) => ({
			...prevStatus,
			[id]: !favorite,
		}));

		const result = await makeFavorite(id, favorite);

		if (result?.error) {
			setFavoriteStatus((prevStatus) => ({
				...prevStatus,
				[id]: favorite,
			}));
		}
	};
	return (
		<div className={styles.GalleryContainer}>
			{items.map((item) => (
				<div className={styles.item} key={item.id}>
					<div className={styles.GalleryItem}>
						<Link href={`/library/${item.id}`}>
							<Image
								src="https://placehold.co/24"
								alt="UserProfilePic"
								fill={true}
							/>
						</Link>
					</div>
					{item.Category && (
						<div className={styles.bannerLeft}>
							<p>{item.Category.name}</p>
						</div>
					)}
					<div className={styles.bannerRight}>
						<p>{item.component}</p>
					</div>
					<div className={styles.under}>
						<h3>{item.title}</h3>
						<div className={styles.svgs}>
							<button>
								<PlusRoundStroke width="18" height="18" fill="var(--main-90)" />
							</button>
							<button
								onClick={() => handleFavorite(item.id, favoriteStatus[item.id])}
							>
								{favoriteStatus[item.id] ? (
									<BookmarkFilled
										width="20"
										height="20"
										fill="var(--main-90)"
									/>
								) : (
									<BookmarkOutline
										width="20"
										height="20"
										fill="var(--main-90)"
									/>
								)}
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default Gallery;
