'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Category } from '@prisma/client';
import styles from './FilterSideBar.module.scss';
import {
	updateFilterLibrary,
	createCategory,
	updateCategoryParent,
} from '@/actions/CRUDLibrary';
import {
	ExtendedLibrary,
	LibraryData,
	SortOptions,
} from '@/components/types/types';
import ArrowLineRight from '@/svgs/ArrowLineRight';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	DragOverEvent,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import PlusRoundStroke from '@/svgs/Plus-Round-Stroke';

type ExtendedCategory = Category & { subcategories: ExtendedCategory[] };

// Sortable category item component
const SortableCategoryItem = ({
	category,
	depth,
	isChecked,
	isOpen,
	toggleCategory,
	toggleSelection,
	addNewCategory,
	isDragging: isDraggingProp,
}: {
	category: ExtendedCategory;
	depth: number;
	isChecked: boolean;
	isOpen: boolean;
	toggleCategory: (name: string) => void;
	toggleSelection: (category: ExtendedCategory) => void;
	addNewCategory: (parentId: string) => void;
	isDragging: boolean;
}) => {
	const { attributes, listeners, setNodeRef, isDragging } = useSortable({
		id: category.id,
		// This prevents the actual item from moving when dragged
		transition: null,
	});

	const hasSubcats = category.subcategories?.length > 0;

	// Keep the item in place, just reduce opacity when dragging
	const style = {
		// Use both isDragging (self) and isDraggingProp (any item) for visual feedback
		opacity: isDragging ? 0.5 : isDraggingProp ? 0.9 : 1,
		paddingLeft: `${depth * 12}px`,
		position: 'relative' as const,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`${styles.categoryItem} ${isOpen ? styles.open : ''}`}
		>
			<div className={styles.hor}>
				<div className={styles.dragHandle} {...attributes} {...listeners}>
					⠿
				</div>

				<input
					type="checkbox"
					checked={isChecked}
					onChange={() => toggleSelection(category)}
				/>

				{hasSubcats && (
					<div
						className={`${styles.svg} ${isOpen ? styles.rotate : ''}`}
						onClick={() => toggleCategory(category.name)}
					>
						<ArrowLineRight fill="var(--main-35)" height="16" width="16" />
					</div>
				)}

				<span onClick={() => toggleCategory(category.name)}>
					{category.name}
				</span>

				<button
					className={styles.addSubCategoryBtn}
					onClick={() => addNewCategory(category.id)}
				>
					<PlusRoundStroke width="14" height="14" fill="var(--main-35)" />
				</button>
			</div>
		</div>
	);
};

export default function FilterSideBar({
	data,
	setData,
	favorite,
	isFilterOpen,
	selectedCategories,
	setSelectedCategories,
	query,
	sortType,
	organizationId,
	setIsFilterOpen,
}: {
	data: LibraryData | LibraryData[];
	favorite: boolean;
	setData: React.Dispatch<React.SetStateAction<ExtendedLibrary[]>>;
	isFilterOpen?: boolean;
	selectedCategories: string[];
	setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
	query: string;
	sortType: [SortOptions, boolean];
	organizationId: string;
	setIsFilterOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
		{}
	);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [newCategoryName, setNewCategoryName] = useState('');
	const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
	const [newCategoryParentId, setNewCategoryParentId] = useState<string | null>(
		null
	);
	const [dropTargetId, setDropTargetId] = useState<string | null>(null);
	const [dropPosition, setDropPosition] = useState<'top' | 'bottom' | 'middle'>(
		'middle'
	);
	const [categories, setCategories] = useState<ExtendedCategory[]>(
		Array.isArray(data)
			? data.flatMap((d) => d.categories || [])
			: data.categories || []
	);
	const newCategoryInputRef = useRef<HTMLInputElement>(null);
	const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const id = Array.isArray(data) ? undefined : data.id;

	// Configure dnd-kit sensors
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Update the categories state when the data changes
	useEffect(() => {
		setCategories(
			Array.isArray(data)
				? data.flatMap((d) => d.categories || [])
				: data.categories || []
		);
	}, [data]);

	function getAllChildNames(category: ExtendedCategory): string[] {
		if (!category.subcategories?.length) return [];
		return category.subcategories.reduce<string[]>((acc, subcat) => {
			acc.push(subcat.name, ...getAllChildNames(subcat));
			return acc;
		}, []);
	}

	function toggleCategory(categoryName: string) {
		setOpenCategories((prev) => ({
			...prev,
			[categoryName]: !prev[categoryName],
		}));
	}

	async function toggleSelection(category: ExtendedCategory) {
		const isSelected = selectedCategories.includes(category.name);
		const allChildNames = getAllChildNames(category);

		// Client-side state update first (optimistic UI)
		let newSelectedCategories;
		if (isSelected) {
			newSelectedCategories = selectedCategories.filter(
				(item) => item !== category.name && !allChildNames.includes(item)
			);
		} else {
			newSelectedCategories = [
				...new Set([...selectedCategories, category.name, ...allChildNames]),
			];
		}
		setSelectedCategories(newSelectedCategories);

		// Update data optimistically
		// We'll need to manually filter the data here since we can't wait for the server
		let filteredData = [
			...(Array.isArray(data)
				? data.flatMap((d) => d.libraries)
				: data.libraries),
		];

		if (newSelectedCategories.length > 0) {
			filteredData = filteredData.filter(
				(item) =>
					item.Category && newSelectedCategories.includes(item.Category.name)
			);
		}

		setData(filteredData);

		// Then server update
		const updatedData = await updateFilterLibrary({
			selectedCategories: newSelectedCategories,
			id: id,
			type: sortType[0],
			query,
			favorite: favorite,
			isAscending: sortType[1],
			organizationId: organizationId,
		});

		// Update with server data in case there's any difference
		setData(updatedData.data);
	}

	function handleDragStart(event: DragStartEvent) {
		setActiveId(event.active.id as string);
		// Close any open hover timeouts
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}
	}

	function handleDragOver(event: DragOverEvent) {
		const { over, active } = event;

		// If not over anything, clear the target
		if (!over) {
			setDropTargetId(null);
			return;
		}

		// Don't allow dropping on self
		if (over.id === active.id) {
			setDropTargetId(null);
			return;
		}

		setDropTargetId(over.id as string);

		// Determine position with enhanced precision
		if (event.activatorEvent instanceof PointerEvent) {
			const overRect = over.rect as {
				top: number;
				bottom: number;
				height: number;
			};
			const overHeight = overRect.height;
			const pointerY = event.activatorEvent.clientY;

			// Create zones that are easier to target:
			// - Top 25% = top drop
			// - Middle 50% = middle drop (become child)
			// - Bottom 25% = bottom drop
			const topZone = overRect.top + overHeight * 0.25;
			const bottomZone = overRect.bottom - overHeight * 0.25;

			if (pointerY < topZone) {
				setDropPosition('top');
			} else if (pointerY > bottomZone) {
				setDropPosition('bottom');
			} else {
				setDropPosition('middle');

				// For middle position, open the target category if it has children
				const overCategory = findCategoryById(categories, over.id as string);
				if (overCategory && overCategory.subcategories?.length > 0) {
					setOpenCategories((prev) => ({
						...prev,
						[overCategory.name]: true,
					}));
				}
			}
		}
	}

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		const currentDropPosition = dropPosition;

		// Reset states
		setDropTargetId(null);
		setActiveId(null);
		setDropPosition('middle'); // Reset to default

		// Only process if we have a valid drop target
		if (!over || active.id === over.id) {
			return;
		}

		const activeCategory = findCategoryById(categories, active.id as string);
		const overCategory = findCategoryById(categories, over.id as string);

		if (!activeCategory || !overCategory) return;

		// Check for circular dependency (can't drop on own child)
		const isChildOfActive = (category: ExtendedCategory): boolean => {
			if (category.id === active.id) return true;
			return category.subcategories?.some(isChildOfActive) || false;
		};

		// Prevent dropping on own child
		if (currentDropPosition === 'middle' && isChildOfActive(overCategory)) {
			console.log("Can't drop inside own child");
			return;
		}

		// Determine the parent id based on drop position
		let newParentId: string | null = null;

		if (currentDropPosition === 'middle') {
			// Dropping inside the target - make it a child
			newParentId = overCategory.id;
		} else {
			// Dropping before or after - use the same parent as the target
			newParentId = overCategory.parentId;
		}

		try {
			// For optimistic UI update
			let updatedCategories: ExtendedCategory[] | null = null;

			// Use our different update strategies based on position
			if (currentDropPosition === 'middle') {
				// Add as child when dropping in the middle
				updatedCategories = updateCategoryAsChild(
					JSON.parse(JSON.stringify(categories)),
					active.id as string,
					over.id as string
				);
			} else {
				// Handle top/bottom positions - same level as target, before or after
				updatedCategories = updateCategoryPosition(
					JSON.parse(JSON.stringify(categories)),
					active.id as string,
					over.id as string,
					currentDropPosition
				);
			}

			if (updatedCategories) {
				setCategories(updatedCategories);
			}

			// Server update
			const result = await updateCategoryParent({
				categoryId: active.id as string,
				newParentId: newParentId,
			});

			if (result.success) {
				// Refresh the data to reflect the changes
				const updatedData = await updateFilterLibrary({
					selectedCategories,
					id,
					type: sortType[0],
					query,
					favorite,
					isAscending: sortType[1],
					organizationId,
				});
				setData(updatedData.data);
			} else {
				// If server update failed, revert to original data
				setCategories(
					Array.isArray(data)
						? data.flatMap((d) => d.categories || [])
						: data.categories || []
				);
			}
		} catch (error) {
			console.error('Error during drag operation:', error);
			// Revert to original data on error
			setCategories(
				Array.isArray(data)
					? data.flatMap((d) => d.categories || [])
					: data.categories || []
			);
		}
	}

	// Add as child to target category (middle position)
	function updateCategoryAsChild(
		categoriesArray: ExtendedCategory[],
		draggedId: string,
		targetId: string
	): ExtendedCategory[] | null {
		try {
			// Create a deep copy of the categories array to avoid mutation issues
			const categoriesCopy: ExtendedCategory[] = JSON.parse(
				JSON.stringify(categoriesArray)
			);

			// Find the dragged category and its path
			let draggedCategory: ExtendedCategory | null = null;
			let draggedCategoryPath: number[] = [];

			// Find the target category and its path
			let targetCategory: ExtendedCategory | null = null;

			// Helper function to find a category by ID
			const findCategory = (
				categories: ExtendedCategory[],
				id: string,
				path: number[] = []
			): [ExtendedCategory | null, number[]] => {
				for (let i = 0; i < categories.length; i++) {
					const currentPath = [...path, i];

					if (categories[i].id === id) {
						return [categories[i], currentPath];
					}

					if (categories[i].subcategories?.length > 0) {
						const [found, foundPath] = findCategory(
							categories[i].subcategories,
							id,
							currentPath
						);

						if (found) {
							return [found, foundPath];
						}
					}
				}

				return [null, []];
			};

			// Find both the dragged and target categories
			[draggedCategory, draggedCategoryPath] = findCategory(
				categoriesCopy,
				draggedId
			);
			[targetCategory] = findCategory(categoriesCopy, targetId);

			if (!draggedCategory || !targetCategory) {
				return null;
			}

			// Helper function to remove a category at a specific path
			const removeByPath = (
				categories: ExtendedCategory[],
				path: number[]
			): ExtendedCategory[] => {
				if (path.length === 1) {
					return [
						...categories.slice(0, path[0]),
						...categories.slice(path[0] + 1),
					];
				}

				const index = path[0];
				const restPath = path.slice(1);
				const category = { ...categories[index] };

				if (category.subcategories?.length > 0) {
					category.subcategories = removeByPath(
						category.subcategories,
						restPath
					);

					return [
						...categories.slice(0, index),
						category,
						...categories.slice(index + 1),
					];
				}

				return categories;
			};

			// Remove the dragged category from its original location
			if (draggedCategoryPath.length > 0) {
				const modifiedCategories = removeByPath(
					categoriesCopy,
					draggedCategoryPath
				);

				// Create a clean copy of the dragged category
				const categoryToMove: ExtendedCategory = {
					...draggedCategory,
					parentId: targetId,
				};

				// Find the target again in our modified structure
				const [updatedTarget] = findCategory(modifiedCategories, targetId);

				if (updatedTarget) {
					// Ensure subcategories array exists
					if (!updatedTarget.subcategories) {
						updatedTarget.subcategories = [];
					}

					// Add the category
					updatedTarget.subcategories.push(categoryToMove);
				} else {
					// If target not found (rare case), add to root
					modifiedCategories.push(categoryToMove);
				}

				return modifiedCategories;
			}

			return categoriesCopy;
		} catch (error) {
			console.error('Error updating category structure:', error);
			return null;
		}
	}

	// Position before or after target category (top or bottom position)
	function updateCategoryPosition(
		categoriesArray: ExtendedCategory[],
		draggedId: string,
		targetId: string,
		position: 'top' | 'bottom' | 'middle'
	): ExtendedCategory[] | null {
		try {
			// Deep copy to avoid mutations
			const categoriesCopy: ExtendedCategory[] = JSON.parse(
				JSON.stringify(categoriesArray)
			);

			// Find the dragged category and target category with their paths
			let draggedCategory: ExtendedCategory | null = null;
			let draggedCategoryPath: number[] = [];
			let targetCategory: ExtendedCategory | null = null;
			let targetCategoryPath: number[] = [];

			// Helper function to find a category by ID
			const findCategory = (
				categories: ExtendedCategory[],
				id: string,
				path: number[] = []
			): [ExtendedCategory | null, number[]] => {
				for (let i = 0; i < categories.length; i++) {
					const currentPath = [...path, i];

					if (categories[i].id === id) {
						return [categories[i], currentPath];
					}

					if (categories[i].subcategories?.length > 0) {
						const [found, foundPath] = findCategory(
							categories[i].subcategories,
							id,
							currentPath
						);

						if (found) {
							return [found, foundPath];
						}
					}
				}

				return [null, []];
			};

			// Find both categories
			[draggedCategory, draggedCategoryPath] = findCategory(
				categoriesCopy,
				draggedId
			);
			[targetCategory, targetCategoryPath] = findCategory(
				categoriesCopy,
				targetId
			);

			if (!draggedCategory || !targetCategory) {
				return null;
			}

			// Helper function to remove a category at a specific path
			const removeByPath = (
				categories: ExtendedCategory[],
				path: number[]
			): ExtendedCategory[] => {
				if (path.length === 1) {
					return [
						...categories.slice(0, path[0]),
						...categories.slice(path[0] + 1),
					];
				}

				const index = path[0];
				const restPath = path.slice(1);
				const category = { ...categories[index] };

				if (category.subcategories?.length > 0) {
					category.subcategories = removeByPath(
						category.subcategories,
						restPath
					);

					return [
						...categories.slice(0, index),
						category,
						...categories.slice(index + 1),
					];
				}

				return categories;
			};

			// Remove the dragged category from its original location
			if (draggedCategoryPath.length > 0) {
				const modifiedCategories = removeByPath(
					categoriesCopy,
					draggedCategoryPath
				);

				// Create a clean copy of the dragged category
				const categoryToMove: ExtendedCategory = {
					...draggedCategory,
					parentId: targetCategory.parentId, // Same parent as target
				};

				// Find where to insert the category
				if (targetCategoryPath.length > 0) {
					// If target category is at the root level or in subcategories
					const parentPath = targetCategoryPath.slice(0, -1);
					const targetIndex = targetCategoryPath[targetCategoryPath.length - 1];

					// Navigate to the parent container
					let containerToModify = modifiedCategories;
					const currentPath: number[] = [];

					for (const index of parentPath) {
						currentPath.push(index);
						containerToModify = containerToModify[index].subcategories;
					}

					// Insert based on position (before or after target)
					const insertIndex =
						position === 'top' ? targetIndex : targetIndex + 1;

					containerToModify.splice(insertIndex, 0, categoryToMove);

					return modifiedCategories;
				} else {
					// Target is at root level - more straightforward
					const targetIndex = modifiedCategories.findIndex(
						(c) => c.id === targetId
					);

					if (targetIndex !== -1) {
						const insertIndex =
							position === 'top' ? targetIndex : targetIndex + 1;
						modifiedCategories.splice(insertIndex, 0, categoryToMove);
					} else {
						// Fallback if we can't find target (unlikely)
						modifiedCategories.push(categoryToMove);
					}

					return modifiedCategories;
				}
			}

			return categoriesCopy;
		} catch (error) {
			console.error('Error updating category position:', error);
			return null;
		}
	}

	function initiateAddCategory(parentId: string | null = null) {
		setNewCategoryParentId(parentId);
		setShowNewCategoryInput(true);
		setNewCategoryName('');

		// Focus the input after rendering
		setTimeout(() => {
			if (newCategoryInputRef.current) {
				newCategoryInputRef.current.focus();
			}
		}, 0);
	}

	async function handleAddCategory() {
		if (newCategoryName.trim()) {
			const libraryTypeId = Array.isArray(data) ? data[0]?.id || '' : data.id;

			// Optimistic update
			const tempId = `temp-${Date.now()}`;
			const newCategory = {
				id: tempId,
				name: newCategoryName.trim(),
				slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-'),
				parentId: newCategoryParentId,
				organizationId,
				libraryTypeId,
				subcategories: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as ExtendedCategory;

			// Add the new category to our client-side state
			if (newCategoryParentId) {
				// Add as subcategory
				const updatedCategories = [...categories];
				const addToParent = (cats: ExtendedCategory[]) => {
					for (const cat of cats) {
						if (cat.id === newCategoryParentId) {
							cat.subcategories = [...(cat.subcategories || []), newCategory];
							return true;
						}
						if (cat.subcategories?.length && addToParent(cat.subcategories)) {
							return true;
						}
					}
					return false;
				};

				addToParent(updatedCategories);
				setCategories(updatedCategories);

				// Open the parent category
				const parentCategory = findCategoryById(
					categories,
					newCategoryParentId
				);
				if (parentCategory) {
					setOpenCategories((prev) => ({
						...prev,
						[parentCategory.name]: true,
					}));
				}
			} else {
				// Add at root level
				setCategories((prev) => [...prev, newCategory]);
			}

			// Server update
			const result = await createCategory({
				name: newCategoryName.trim(),
				organizationId,
				libraryTypeId,
				parentId: newCategoryParentId,
			});

			if (result.success) {
				// Refresh data from server
				const updatedData = await updateFilterLibrary({
					selectedCategories,
					id,
					type: sortType[0],
					query,
					favorite,
					isAscending: sortType[1],
					organizationId,
				});
				setData(updatedData.data);
			}

			// Reset the input state
			setShowNewCategoryInput(false);
			setNewCategoryParentId(null);
		} else {
			setShowNewCategoryInput(false);
		}
	}

	// Helper to find a category by ID
	function findCategoryById(
		categories: ExtendedCategory[],
		id: string
	): ExtendedCategory | null {
		for (const category of categories) {
			if (category.id === id) {
				return category;
			}

			if (category.subcategories?.length) {
				const found = findCategoryById(category.subcategories, id);
				if (found) return found;
			}
		}

		return null;
	}

	function renderCategories(
		categories: ExtendedCategory[],
		depth = 0,
		visited = new Set<string>()
	) {
		// Get all category IDs for SortableContext
		const categoryIds = categories.map((category) => category.id);

		return (
			<SortableContext
				items={categoryIds}
				strategy={verticalListSortingStrategy}
			>
				{categories.map((category) => {
					if (visited.has(category.name)) return null;
					visited.add(category.name);

					const isTopLevel = depth === 0;
					const isOpen = !!openCategories[category.name];
					const isChecked = selectedCategories.includes(category.name);
					const hasSubcats = category.subcategories?.length > 0;
					const isDropTarget = dropTargetId === category.id;

					return (
						<div
							key={category.id}
							className={`
								${isTopLevel ? styles.topCategoryItem : styles.subCategoryItem}
								${
									isDropTarget
										? dropPosition === 'top'
											? styles.dropTargetTop
											: dropPosition === 'bottom'
											? styles.dropTargetBottom
											: styles.dropTargetMiddle
										: ''
								}
							`}
						>
							<SortableCategoryItem
								category={category}
								depth={depth}
								isChecked={isChecked}
								isOpen={isOpen}
								toggleCategory={toggleCategory}
								toggleSelection={toggleSelection}
								addNewCategory={initiateAddCategory}
								isDragging={activeId !== null}
							/>

							<motion.div
								animate={{
									height: isOpen && hasSubcats ? 'auto' : 0,
									opacity: isOpen ? 1 : 0.2,
								}}
								initial={{ height: 0, opacity: 0.2, margin: '-2px 0' }}
								transition={{ bounce: 0, duration: 0.2, ease: 'easeOut' }}
								style={{ overflow: 'hidden' }}
								className={styles.items}
							>
								{hasSubcats && (
									<div className={styles.subCategory}>
										{renderCategories(
											category.subcategories,
											depth + 1,
											visited
										)}
									</div>
								)}
							</motion.div>
						</div>
					);
				})}
			</SortableContext>
		);
	}

	return (
		<div
			className={styles.filterSideBar}
			style={isFilterOpen ? { left: '0' } : { left: '-100%' }}
		>
			<div className={styles.headerRow}>
				<h2>Filters</h2>
				{setIsFilterOpen && (
					<button
						className={styles.closeButton}
						onClick={() => setIsFilterOpen(false)}
					>
						×
					</button>
				)}
			</div>

			<div className={styles.categoryActions}>
				<button
					className={styles.addCategoryBtn}
					onClick={() => initiateAddCategory(null)}
				>
					<PlusRoundStroke width="16" height="16" fill="var(--main-35)" />
					<span>Add Category</span>
				</button>
			</div>

			{showNewCategoryInput && (
				<div className={styles.newCategoryInput}>
					<input
						ref={newCategoryInputRef}
						type="text"
						value={newCategoryName}
						onChange={(e) => setNewCategoryName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') handleAddCategory();
							if (e.key === 'Escape') setShowNewCategoryInput(false);
						}}
						placeholder="Category name..."
					/>
					<div className={styles.inputActions}>
						<button onClick={handleAddCategory}>Add</button>
						<button onClick={() => setShowNewCategoryInput(false)}>
							Cancel
						</button>
					</div>
				</div>
			)}

			{selectedCategories.length > 0 && (
				<div className={styles.selectedInfo}>
					Selected: {selectedCategories.join(', ')}
				</div>
			)}

			<div className={styles.filterBar}>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
				>
					{renderCategories(categories)}

					<DragOverlay>
						{activeId ? (
							<div className={styles.draggingItem}>
								<div className={styles.hor}>
									<div className={styles.dragHandle}>⠿</div>
									<span>
										{findCategoryById(categories, activeId)?.name || 'Category'}
									</span>
								</div>
							</div>
						) : null}
					</DragOverlay>
				</DndContext>
			</div>
		</div>
	);
}
