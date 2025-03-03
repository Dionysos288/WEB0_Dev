'use client';
import styles from './Gallery.module.scss';
import Link from 'next/link';
import { ExtendedLibrary } from '@/components/types/types';
import Image from 'next/image';
import { makeFavorite } from '@/actions/CRUDLibrary';
import { useState, useEffect, useRef } from 'react';
import BookmarkFilled from '@/svgs/Bookmark-Filled';
import BookmarkOutline from '@/svgs/Bookmark-Outline';
import PlusRoundStroke from '@/svgs/Plus-Round-Stroke';
import Trash from '@/svgs/AddDate';
import Category from '@/svgs/Category';
import Dismiss from '@/svgs/Dismiss';
import SVG from '@/components/general/SVG';
type LibraryMetadata = {
	coverImageUrl?: string;
	[key: string]: unknown;
};

const Gallery = ({
	data,
	slug,
}: {
	data: ExtendedLibrary | ExtendedLibrary[];
	slug: string;
}) => {
	const items = Array.isArray(data) ? data : [data];
	const [favoriteStatus, setFavoriteStatus] = useState(
		items.reduce((acc, item) => {
			acc[item.id] = item.favorite;
			return acc;
		}, {} as { [key: string]: boolean })
	);
	const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
	const [lastSelectedItem, setLastSelectedItem] = useState<string | null>(null);
	const [anchorItem, setAnchorItem] = useState<string | null>(null);
	const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
	const [isShiftPressed, setIsShiftPressed] = useState(false);
	const [isCtrlPressed, setIsCtrlPressed] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Shift') {
				setIsShiftPressed(true);
			} else if (e.key === 'Control') {
				setIsCtrlPressed(true);
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === 'Shift') {
				setIsShiftPressed(false);
			} else if (e.key === 'Control') {
				setIsCtrlPressed(false);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	useEffect(() => {
		Object.entries(videoRefs.current).forEach(([id, videoElement]) => {
			if (videoElement) {
				if (hoveredVideo === id) {
					videoElement.play().catch((error) => {
						console.error('Error playing video:', error);
					});
				} else {
					videoElement.pause();
					videoElement.currentTime = 0;
				}
			}
		});
	}, [hoveredVideo]);

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

	const handleItemClick = (e: React.MouseEvent, id: string) => {
		e.preventDefault();

		if (!isShiftPressed && !isCtrlPressed) {
			// Clear selection on normal click
			setSelectedItems(new Set());
			setAnchorItem(null);
			setLastSelectedItem(null);
			return;
		}

		if (isCtrlPressed && !isShiftPressed) {
			setSelectedItems((prev) => {
				const newSet = new Set(prev);
				if (newSet.has(id)) {
					newSet.delete(id);
				} else {
					newSet.add(id);
				}
				return newSet;
			});
			setAnchorItem(id);
			setLastSelectedItem(id);
			return;
		}

		if (isShiftPressed) {
			if (!anchorItem) {
				setSelectedItems(new Set([id]));
				setAnchorItem(id);
				setLastSelectedItem(id);
				return;
			}

			const itemIds = items.map((item) => item.id);
			const anchorIndex = itemIds.indexOf(anchorItem);
			const currentIndex = itemIds.indexOf(id);
			const lastIndex = lastSelectedItem
				? itemIds.indexOf(lastSelectedItem)
				: anchorIndex;

			const start = Math.min(anchorIndex, currentIndex);
			const end = Math.max(anchorIndex, currentIndex);
			const rangeIds = itemIds.slice(start, end + 1);

			const shouldSelect = !selectedItems.has(id);

			setSelectedItems((prev) => {
				const newSet = new Set(prev);

				const prevStart = Math.min(anchorIndex, lastIndex);
				const prevEnd = Math.max(anchorIndex, lastIndex);
				const prevRange = itemIds.slice(prevStart, prevEnd + 1);

				prevRange.forEach((itemId) => {
					if (!rangeIds.includes(itemId)) {
						newSet.delete(itemId);
					}
				});

				rangeIds.forEach((itemId) => {
					if (shouldSelect) {
						newSet.add(itemId);
					} else {
						newSet.delete(itemId);
					}
				});

				return newSet;
			});

			setLastSelectedItem(id);
		}
	};

	const handleBulkFavorite = async () => {
		const promises = Array.from(selectedItems).map((id) =>
			handleFavorite(id, favoriteStatus[id])
		);
		await Promise.all(promises);
	};

	const handleBulkDelete = async () => {
		// Implement bulk delete functionality
		console.log('Deleting items:', Array.from(selectedItems));
	};

	const handleAssignToProject = () => {
		// Implement project assignment functionality
		console.log('Assigning items to project:', Array.from(selectedItems));
	};

	const handleChangeCategory = () => {
		// Implement category change functionality
		console.log('Changing category for items:', Array.from(selectedItems));
	};

	const getVideoType = (url: string): string => {
		const extension = url.split('.').pop()?.toLowerCase();
		switch (extension) {
			case 'mp4':
				return 'video/mp4';
			case 'webm':
				return 'video/webm';
			case 'ogg':
				return 'video/ogg';
			default:
				return 'video/mp4';
		}
	};

	const isVideoUrl = (url?: string) => {
		return url?.match(/\.(mp4|webm|ogg)$/i) ?? false;
	};

	const getCoverImageUrl = (metadata: LibraryMetadata): string => {
		return metadata?.coverImageUrl || 'https://placehold.co/24';
	};

	const handleVideoRef = (id: string) => (el: HTMLVideoElement | null) => {
		videoRefs.current[id] = el;
	};

	const clearSelection = () => {
		setSelectedItems(new Set());
	};

	return (
		<>
			<div className={styles.GalleryContainer}>
				{items.map((item) => {
					const coverUrl = getCoverImageUrl(item.metadata as LibraryMetadata);
					const isVideo = isVideoUrl(coverUrl);
					const isSelected = selectedItems.has(item.id);

					return (
						<div
							className={`${styles.item} ${isSelected ? styles.selected : ''}`}
							key={item.id}
							onClick={(e) => handleItemClick(e, item.id)}
						>
							<div className={styles.GalleryItem}>
								<Link
									href={`/${slug}/library/${item.id}`}
									onMouseEnter={() => setHoveredVideo(item.id)}
									onMouseLeave={() => setHoveredVideo(null)}
									onClick={(e) => {
										if (
											isShiftPressed ||
											isCtrlPressed ||
											selectedItems.size > 0
										) {
											e.preventDefault();
										}
									}}
								>
									{isVideo ? (
										<div className={styles.videoWrapper}>
											<video
												ref={handleVideoRef(item.id)}
												preload="metadata"
												muted
												playsInline
												loop
												poster={`${coverUrl}#t=0.1`}
												className={styles.video}
											>
												<source src={coverUrl} type={getVideoType(coverUrl)} />
												Your browser does not support the video tag.
											</video>
										</div>
									) : (
										<Image
											src={coverUrl}
											alt={item.title}
											fill={true}
											style={{ objectFit: 'cover' }}
										/>
									)}
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
										<PlusRoundStroke
											width="18"
											height="18"
											fill="var(--main-90)"
										/>
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleFavorite(item.id, favoriteStatus[item.id]);
										}}
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
					);
				})}
			</div>

			{selectedItems.size > 0 && (
				<div className={styles.toolbar}>
					<div className={styles.toolbarContent}>
						<div className={styles.selectedCount}>
							{selectedItems.size} selected
							<SVG onClick={clearSelection} style={{ marginLeft: '-4px' }}>
								<Dismiss width="14" height="14" fill="var(--main-75)" />
							</SVG>
						</div>
						<div className={styles.actions}>
							<button onClick={handleBulkFavorite}>
								<BookmarkOutline width="16" height="16" />
								<span>Favorite</span>
							</button>
							<button onClick={handleAssignToProject}>
								<PlusRoundStroke width="16" height="16" />
								<span>Move to project</span>
							</button>
							<button onClick={handleChangeCategory}>
								<Category width="16" height="16" />
								<span>Move to category</span>
							</button>
							<button
								onClick={handleBulkDelete}
								className={styles.deleteButton}
							>
								<Trash width="16" height="16" />
								<span>Delete</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Gallery;
