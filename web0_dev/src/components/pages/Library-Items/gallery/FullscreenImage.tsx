'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import styles from './FullscreenImage.module.scss';
import Dismiss from '@/svgs/Dismiss';
import ArrowLineRight from '@/svgs/ArrowLineRight';

interface FullscreenImageProps {
	images: string[];
	currentIndex: number;
	isOpen: boolean;
	onClose: () => void;
	onNavigate: (direction: 'next' | 'prev') => void;
}

const FullscreenImage = ({
	images,
	currentIndex,
	isOpen,
	onClose,
	onNavigate,
}: FullscreenImageProps) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;

			if (e.key === 'Escape') {
				onClose();
			} else if (e.key === 'ArrowRight') {
				onNavigate('next');
			} else if (e.key === 'ArrowLeft') {
				onNavigate('prev');
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		if (isOpen) {
			document.body.style.overflow = 'hidden';
		}

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'auto';
		};
	}, [isOpen, onClose, onNavigate]);

	if (!isOpen) return null;

	return (
		<div className={styles.fullscreenModal} onClick={onClose}>
			<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
				<div className={styles.fullscreenImageContainer}>
					<Image
						src={images[currentIndex]}
						alt={`Fullscreen image ${currentIndex + 1}`}
						fill
						sizes="100vw"
						priority
						className={styles.fullscreenImg}
					/>
				</div>

				<button className={styles.closeButton} onClick={onClose}>
					<Dismiss fill="var(--white)" width="30" height="30" />
				</button>

				{images.length > 1 && (
					<>
						<button
							className={`${styles.navButton} ${styles.prevButton}`}
							onClick={(e) => {
								e.stopPropagation();
								onNavigate('prev');
							}}
						>
							<ArrowLineRight
								fill="var(--white)"
								width="30"
								height="30"
								style={{ rotate: '180deg' }}
							/>
						</button>
						<button
							className={`${styles.navButton} ${styles.nextButton}`}
							onClick={(e) => {
								e.stopPropagation();
								onNavigate('next');
							}}
						>
							<ArrowLineRight fill="var(--white)" width="30" height="30" />
						</button>
					</>
				)}

				<div className={styles.imageCounter}>
					{currentIndex + 1} / {images.length}
				</div>
			</div>
		</div>
	);
};

export default FullscreenImage;
