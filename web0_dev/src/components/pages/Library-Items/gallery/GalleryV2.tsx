'use client';
import Image from 'next/image';
import styles from './GalleryV2.module.scss';
import { useState, useEffect } from 'react';
import ArrowLineRight from '@/svgs/ArrowLineRight';
import FullscreenImage from './FullscreenImage';

const GalleryV2 = ({ images }: { images: string[] }) => {
	const [image, setImage] = useState(0);
	const [fullView, setFullView] = useState(false);
	const [imageDimensions, setImageDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);

	// Function to load image dimensions
	useEffect(() => {
		if (images.length > 0) {
			const img = new window.Image();
			img.onload = () => {
				setImageDimensions({
					width: img.width,
					height: img.height,
				});
			};
			img.src = images[image];
		}
	}, [image, images]);

	const changeImage = (index: number) => {
		setImage(index);
	};

	const changePageUp = (next: boolean) => {
		if (next) {
			setImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
		} else {
			setImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
		}
	};

	const toggleFullView = () => {
		setFullView(!fullView);
	};

	const handleNavigate = (direction: 'next' | 'prev') => {
		changePageUp(direction === 'next');
	};

	return (
		<div className={styles.galleryWrapper}>
			<div
				className={`${styles.imgWrapper} ${
					imageDimensions && imageDimensions.height > imageDimensions.width
						? styles.portrait
						: ''
				}`}
				onClick={toggleFullView}
			>
				<div className={styles.abs}>
					<button
						className={styles.click}
						onClick={(e) => {
							e.stopPropagation();
							changePageUp(false);
						}}
					>
						<ArrowLineRight
							fill={'var(--main-main)'}
							width="44"
							height="44"
							style={{ rotate: '180deg' }}
						/>
					</button>
					<button
						className={styles.click}
						onClick={(e) => {
							e.stopPropagation();
							changePageUp(true);
						}}
					>
						<ArrowLineRight fill={'var(--main-main)'} width="44" height="44" />
					</button>
				</div>
				<Image
					src={images[image]}
					alt="Cover Image Gallery"
					fill
					sizes="100vw"
				/>
			</div>

			<div className={styles.gallery}>
				{images.map((_, index) => (
					<button
						key={index}
						className={`${styles.galleryItem} ${
							index === image ? styles.active : ''
						}`}
						onClick={() => (index === image ? null : changeImage(index))}
					>
						<Image
							src={images[index]}
							alt={`Image Gallery img ${index + 1}`}
							fill
							sizes="20vw"
						/>
					</button>
				))}
			</div>

			{/* Fullscreen Modal */}
			<FullscreenImage
				images={images}
				currentIndex={image}
				isOpen={fullView}
				onClose={toggleFullView}
				onNavigate={handleNavigate}
			/>
		</div>
	);
};

export default GalleryV2;
