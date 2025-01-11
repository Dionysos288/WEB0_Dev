'use client';
import Image from 'next/image';
import styles from './GalleryV2.module.scss';
import { useState } from 'react';
import { ArrowXL } from '@/svgs';
const GalleryV2 = () => {
	const [image, setImage] = useState(0);
	const changeImage = (index: number) => {
		setImage(index);
	};
	const indexes = [0, 1];
	const changePageUp = (next: boolean) => {
		if (next) {
			setImage((prev) => (prev === indexes.length - 1 ? 0 : prev + 1));
		} else {
			setImage((prev) => (prev === 0 ? indexes.length - 1 : prev - 1));
		}
	};
	return (
		<div className={styles.galleryWrapper}>
			<div className={styles.imgWrapper}>
				<div className={styles.abs}>
					<button className={styles.click} onClick={() => changePageUp(false)}>
						<ArrowXL fill={'var(--main)'} style={{ rotate: '180deg' }} />
					</button>
					<button className={styles.click} onClick={() => changePageUp(true)}>
						<ArrowXL fill={'var(--main)'} />
					</button>
				</div>
				<Image
					src={`https://placehold.co/500x${image === 0 ? 300 : 400}`}
					alt="Cover Image Gallery"
					fill
					sizes="100vw"
				/>
			</div>

			<div className={styles.gallery}>
				{Array.from({ length: 2 }).map((_, index) => (
					<button
						key={index}
						className={`${styles.galleryItem} ${
							index === image ? styles.active : ''
						}`}
						onClick={() => (index === image ? null : changeImage(index))}
					>
						<Image
							src={`https://placehold.co/500x${index === 0 ? 300 : 400}`}
							alt={`Image Gallery img ${index + 1}`}
							fill
							sizes="20vw"
						/>
					</button>
				))}
			</div>
		</div>
	);
};

export default GalleryV2;
