'use client';
import styles from './Gallery.module.scss';
import Link from 'next/link';
import { ExtendedLibrary } from '@/components/types/types';
import Image from 'next/image';
import {
	makeFavorite,
	updateLibraryProjects,
	deleteLibraries,
} from '@/actions/CRUDLibrary';
import { useState, useEffect, useRef } from 'react';
import BookmarkFilled from '@/svgs/Bookmark-Filled';
import BookmarkOutline from '@/svgs/Bookmark-Outline';
import PlusRoundStroke from '@/svgs/Plus-Round-Stroke';
import Trash from '@/svgs/AddDate';
import Category from '@/svgs/Category';
import { Project } from '@prisma/client';
import ButtonSelector from '@/components/pages/projects/addProject/ButtonSelector';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';
import Toolbar from '@/components/general/Toolbar/Toolbar';

type LibraryMetadata = {
	coverImageUrl?: string;
	[key: string]: unknown;
};

interface ExtendedLibraryWithProjects extends ExtendedLibrary {
	projects?: Array<{ id: string }>;
}

const Gallery = ({
	data,
	slug,
	projects = [],
}: {
	data: ExtendedLibraryWithProjects | ExtendedLibraryWithProjects[];
	slug: string;
	projects: Project[];
}) => {
	const [displayedItems, setDisplayedItems] = useState(
		Array.isArray(data) ? data : [data]
	);
	const [favoriteStatus, setFavoriteStatus] = useState(
		displayedItems.reduce((acc, item) => {
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
	const [openProjectSelector, setOpenProjectSelector] = useState<string | null>(
		null
	);
	const [itemProjectSelections, setItemProjectSelections] = useState<{
		[key: string]: string[];
	}>(
		displayedItems.reduce((acc, item) => {
			acc[item.id] = item.projects?.map((p) => p.id) || [];
			return acc;
		}, {} as { [key: string]: string[] })
	);
	const [projectQuery, setProjectQuery] = useState('');
	const [projectOptions, setProjectOptions] = useState<
		Array<{
			label: string;
			value: string;
			icon?: React.ComponentType<{
				fill?: string;
				width?: string;
				height?: string;
			}>;
		}>
	>(
		projects.map((project) => ({
			label: project.title,
			value: project.id,
		}))
	);
	const projectInputRef = useRef<HTMLInputElement>(null);
	const [pendingUpdates, setPendingUpdates] = useState<{
		[itemId: string]: {
			originalSelections: string[];
			currentSelections: string[];
		};
	}>({});
	const [showBulkProjectSelector, setShowBulkProjectSelector] = useState(false);
	const [bulkProjectSelections, setBulkProjectSelections] = useState<string[]>(
		[]
	);
	const bulkProjectInputRef = useRef<HTMLInputElement>(null);

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

			const itemIds = displayedItems.map((item) => item.id);
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
		const itemsToDelete = Array.from(selectedItems);

		setDisplayedItems((prev) =>
			prev.filter((item) => !itemsToDelete.includes(item.id))
		);
		setSelectedItems(new Set());

		try {
			const result = await deleteLibraries(itemsToDelete);
			if (!result.success) {
				setDisplayedItems((prev) => {
					const itemsToRestore = Array.isArray(data) ? data : [data];
					return [
						...prev,
						...itemsToRestore.filter((item) => itemsToDelete.includes(item.id)),
					];
				});
				setSelectedItems(new Set(itemsToDelete));
				console.error('Failed to delete items:', result.error);
			}
		} catch (error) {
			setDisplayedItems((prev) => {
				const itemsToRestore = Array.isArray(data) ? data : [data];
				return [
					...prev,
					...itemsToRestore.filter((item) => itemsToDelete.includes(item.id)),
				];
			});
			setSelectedItems(new Set(itemsToDelete));
			console.error('Error deleting items:', error);
		}
	};

	const handleAssignToProject = () => {
		setShowBulkProjectSelector(true);
		const selectedItemsArray = Array.from(selectedItems);
		const commonProjects = selectedItemsArray.reduce(
			(common, itemId, index) => {
				const itemProjects = itemProjectSelections[itemId] || [];
				if (index === 0) return itemProjects;
				return common.filter((projectId) => itemProjects.includes(projectId));
			},
			[] as string[]
		);
		setBulkProjectSelections(commonProjects);
	};

	const handleBulkProjectSelect = async (value: string | { value: string }) => {
		const projectId = typeof value === 'string' ? value : value.value;
		const selectedItemsArray = Array.from(selectedItems);

		const updatePromises = selectedItemsArray.map(async (itemId) => {
			const currentSelections = itemProjectSelections[itemId] || [];
			if (!currentSelections.includes(projectId)) {
				const result = await updateLibraryProjects(itemId, projectId);
				if (result.success) {
					setItemProjectSelections((prev) => ({
						...prev,
						[itemId]: [...(prev[itemId] || []), projectId],
					}));
				}
			}
		});

		await Promise.all(updatePromises);
		setShowBulkProjectSelector(false);
		setSelectedItems(new Set());
	};

	const handleChangeCategory = () => {
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

	const handleProjectQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<typeof projectOptions>>,
		oldData: typeof projectOptions
	) => {
		const value = e.target.value;
		setProjectQuery(value);

		if (value.trim() === '') {
			setOptions(oldData);
			return;
		}

		const filtered = oldData.filter((option) =>
			option.label.toLowerCase().includes(value.toLowerCase())
		);
		setOptions(filtered);
	};

	const handleProjectSelect = (
		value: string | (typeof projectOptions)[0],
		itemId: string
	) => {
		const projectId = typeof value === 'string' ? value : value.value;
		const currentSelections = itemProjectSelections[itemId] || [];
		const isRemoving = currentSelections.includes(projectId);

		if (!pendingUpdates[itemId]) {
			setPendingUpdates((prev) => ({
				...prev,
				[itemId]: {
					originalSelections: [...currentSelections],
					currentSelections: [...currentSelections],
				},
			}));
		}

		const newSelections = isRemoving
			? currentSelections.filter((id) => id !== projectId)
			: [...currentSelections, projectId];

		setItemProjectSelections((prev) => ({
			...prev,
			[itemId]: newSelections,
		}));

		setPendingUpdates((prev) => ({
			...prev,
			[itemId]: {
				...prev[itemId],
				currentSelections: newSelections,
			},
		}));
	};

	const syncProjectUpdates = async (itemId: string) => {
		const updates = pendingUpdates[itemId];
		if (!updates) return;

		const { originalSelections, currentSelections } = updates;
		if (
			JSON.stringify(originalSelections) === JSON.stringify(currentSelections)
		) {
			setPendingUpdates((prev) => {
				const newUpdates = { ...prev };
				delete newUpdates[itemId];
				return newUpdates;
			});
			return;
		}

		const addedProjects = currentSelections.filter(
			(id) => !originalSelections.includes(id)
		);
		const removedProjects = originalSelections.filter(
			(id) => !currentSelections.includes(id)
		);

		try {
			const updatePromises = [
				...addedProjects.map((projectId) =>
					updateLibraryProjects(itemId, projectId)
				),
				...removedProjects.map((projectId) =>
					updateLibraryProjects(itemId, projectId)
				),
			];

			const results = await Promise.all(updatePromises);
			const hasError = results.some((result) => !result.success);

			if (hasError) {
				setItemProjectSelections((prev) => ({
					...prev,
					[itemId]: originalSelections,
				}));
				console.error('Failed to update some projects');
			}
		} catch (error) {
			setItemProjectSelections((prev) => ({
				...prev,
				[itemId]: originalSelections,
			}));
			console.error('Failed to update projects:', error);
		}

		setPendingUpdates((prev) => {
			const newUpdates = { ...prev };
			delete newUpdates[itemId];
			return newUpdates;
		});
	};

	const handleProjectButtonClick = (e: React.MouseEvent, itemId: string) => {
		e.stopPropagation();
		if (openProjectSelector === itemId) {
			syncProjectUpdates(itemId);
		}
		setOpenProjectSelector(openProjectSelector === itemId ? null : itemId);
	};

	const handleClickOutside = (itemId: string) => {
		syncProjectUpdates(itemId);
		setOpenProjectSelector(null);
	};

	return (
		<>
			<div className={styles.GalleryContainer}>
				{displayedItems.map((item) => {
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
							{item.category && (
								<div className={styles.bannerLeft}>
									<p>{item.category.name}</p>
								</div>
							)}
							<div className={styles.bannerRight}>
								<p>{item.component}</p>
							</div>
							<div className={styles.under}>
								<h3>{item.title}</h3>
								<div className={styles.svgs}>
									<div className={styles.projectSelector}>
										<button
											className={styles.projectButton}
											onClick={(e) => handleProjectButtonClick(e, item.id)}
										>
											<PlusRoundStroke
												width="18"
												height="18"
												fill="var(--main-90)"
											/>
										</button>
										{openProjectSelector === item.id && (
											<ClickOutsideWrapper
												onClose={() => handleClickOutside(item.id)}
											>
												<div className={styles.selectorWrapper}>
													<ButtonSelector
														query={projectQuery}
														onQueryChange={handleProjectQueryChange}
														inputRef={projectInputRef}
														options={projectOptions}
														placeholder="Select Projects"
														oldData={projects.map((project) => ({
															label: project.title,
															value: project.id,
														}))}
														setOptions={setProjectOptions}
														setIsChosen={(value) =>
															handleProjectSelect(value, item.id)
														}
														setIsOpenOption={() => {}}
														isChosen=""
														isComboBox={true}
														selectedItems={itemProjectSelections[item.id] || []}
														onSelectedItemsChange={(items) => {
															setItemProjectSelections((prev) => ({
																...prev,
																[item.id]: items,
															}));
														}}
													/>
												</div>
											</ClickOutsideWrapper>
										)}
									</div>
									<button
										className={styles.favoriteButton}
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

			<Toolbar
				selectedCount={selectedItems.size}
				onClearSelection={clearSelection}
				actions={[
					{
						label: 'Favorite',
						icon: BookmarkOutline,
						onClick: handleBulkFavorite,
					},
					{
						label: 'Move to project',
						icon: PlusRoundStroke,
						onClick: handleAssignToProject,
					},
					{
						label: 'Move to category',
						icon: Category,
						onClick: handleChangeCategory,
					},
					{
						label: 'Delete',
						icon: Trash,
						onClick: handleBulkDelete,
						variant: 'danger',
					},
				]}
			>
				{showBulkProjectSelector && (
					<ClickOutsideWrapper
						onClose={() => setShowBulkProjectSelector(false)}
					>
						<div className={styles.projectSelectorWrapper}>
							<ButtonSelector
								query={projectQuery}
								onQueryChange={handleProjectQueryChange}
								inputRef={bulkProjectInputRef}
								options={projectOptions}
								placeholder="Select Projects"
								oldData={projects.map((project) => ({
									label: project.title,
									value: project.id,
								}))}
								setOptions={setProjectOptions}
								setIsChosen={handleBulkProjectSelect}
								setIsOpenOption={() => setShowBulkProjectSelector(false)}
								isChosen=""
								isComboBox={true}
								selectedItems={bulkProjectSelections}
								onSelectedItemsChange={(items) =>
									setBulkProjectSelections(items)
								}
							/>
						</div>
					</ClickOutsideWrapper>
				)}
			</Toolbar>
		</>
	);
};

export default Gallery;
