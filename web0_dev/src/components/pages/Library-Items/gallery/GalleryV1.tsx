'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './GalleryV1.module.scss';
import Spacing from '@/components/general/Spacing';
import FullscreenImage from './FullscreenImage';

interface ImageDimension {
	src: string;
	isLandscape: boolean | null;
	index: number;
}

const GalleryV1 = ({ images }: { images: string[] }) => {
	const [imageDimensions, setImageDimensions] = useState<ImageDimension[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	useEffect(() => {
		const loadImageDimensions = async () => {
			setIsLoading(true);

			const dimensionsPromises = images.map((src, index) => {
				return new Promise<ImageDimension>((resolve) => {
					const img = new window.Image();
					img.onload = () => {
						resolve({
							src,
							isLandscape: img.width > img.height,
							index,
						});
					};
					img.onerror = () => {
						resolve({
							src,
							isLandscape: null,
							index,
						});
					};
					img.src = src;
				});
			});

			const dimensions = await Promise.all(dimensionsPromises);
			setImageDimensions(dimensions);
			setIsLoading(false);
		};

		if (images.length > 0) {
			loadImageDimensions();
		}
	}, [images]);

	const openFullscreen = (src: string, index: number) => {
		setFullscreenImage(src);
		setCurrentIndex(index);
	};

	const closeFullscreen = () => {
		setFullscreenImage(null);
	};

	const navigateFullscreen = (direction: 'next' | 'prev') => {
		if (images.length <= 1) return;

		let newIndex;
		if (direction === 'next') {
			newIndex = (currentIndex + 1) % images.length;
		} else {
			newIndex = (currentIndex - 1 + images.length) % images.length;
		}

		setCurrentIndex(newIndex);
		setFullscreenImage(images[newIndex]);
	};

	const landscapeImages = imageDimensions.filter(
		(img) => img.isLandscape === true
	);
	const portraitImages = imageDimensions.filter(
		(img) => img.isLandscape === false
	);
	const unknownImages = imageDimensions.filter(
		(img) => img.isLandscape === null
	);

	if (isLoading) {
		return <div className={styles.loading}>Loading gallery...</div>;
	}

	return (
		<div className={styles.galleryWrapper}>
			{images.length > 0 && (
				<div
					className={styles.imgWrapper}
					onClick={() => openFullscreen(images[0], 0)}
				>
					<Image src={images[0]} alt="Cover Image Gallery" fill sizes="100vw" />
				</div>
			)}
			<Spacing space={28} />

			{landscapeImages.length > 0 && (
				<>
					<div className={styles.gallerySection}>
						<div className={styles.landscapeGallery}>
							{landscapeImages.map((img) => (
								<div
									key={img.index}
									className={styles.landscapeItem}
									onClick={() => openFullscreen(img.src, img.index)}
								>
									<Image
										src={img.src}
										alt={`Landscape image ${img.index + 1}`}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									/>
								</div>
							))}
						</div>
					</div>
					<Spacing space={28} />
				</>
			)}

			{portraitImages.length > 0 && (
				<>
					<div className={styles.gallerySection}>
						<div className={styles.portraitGallery}>
							{portraitImages.map((img) => (
								<div
									key={img.index}
									className={styles.portraitItem}
									onClick={() => openFullscreen(img.src, img.index)}
								>
									<Image
										src={img.src}
										alt={`Portrait image ${img.index + 1}`}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
									/>
								</div>
							))}
						</div>
					</div>
					<Spacing space={28} />
				</>
			)}

			{unknownImages.length > 0 && (
				<div className={styles.gallerySection}>
					<div className={styles.gallery}>
						{unknownImages.map((img) => (
							<div
								key={img.index}
								className={styles.galleryItem}
								onClick={() => openFullscreen(img.src, img.index)}
							>
								<Image
									src={img.src}
									alt={`Image ${img.index + 1}`}
									fill
									sizes="(max-width: 768px) 100vw, 50vw"
								/>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Fullscreen Modal */}
			<FullscreenImage
				images={images}
				currentIndex={currentIndex}
				isOpen={fullscreenImage !== null}
				onClose={closeFullscreen}
				onNavigate={navigateFullscreen}
			/>
		</div>
	);
};

export default GalleryV1;
