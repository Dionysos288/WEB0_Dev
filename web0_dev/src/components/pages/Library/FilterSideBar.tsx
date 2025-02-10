'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Category } from '@prisma/client';
import styles from './FilterSideBar.module.scss';
import { updateFilterLibrary } from '@/actions/CRUDLibrary';
import {
	ExtendedLibrary,
	LibraryData,
	SortOptions,
} from '@/components/types/types';
import ArrowLineRight from '@/svgs/ArrowLineRight';

type ExtendedCategory = Category & { subcategories: ExtendedCategory[] };
export default function FilterSideBar({
	data,
	setData,
	setIsFilterOpen,
	favorite,
	isFilterOpen,
	selectedCategories,
	setSelectedCategories,
	query,
	sortType,
	organizationId,
}: {
	data: LibraryData | LibraryData[];
	favorite: boolean;
	setData: React.Dispatch<React.SetStateAction<ExtendedLibrary[]>>;
	setIsFilterOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	isFilterOpen?: boolean;
	selectedCategories: string[];
	setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
	query: string;
	sortType: [SortOptions, boolean];
	organizationId: string;
}) {
	console.log(setIsFilterOpen);
	const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
		{}
	);
	const id = Array.isArray(data) ? undefined : data.id;
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

		const updatedData = await updateFilterLibrary({
			selectedCategories: newSelectedCategories,
			id: id,
			type: sortType[0],
			query,
			favorite: favorite,
			isAscending: sortType[1],
			organizationId,
		});
		setData(updatedData.data);
	}

	function renderCategories(
		categories: ExtendedCategory[],
		depth = 0,

		visited = new Set<string>()
	) {
		return categories.map((category) => {
			if (visited.has(category.name)) return null;
			visited.add(category.name);

			const isTopLevel = depth === 0;
			const isOpen = !!openCategories[category.name];
			const isChecked = selectedCategories.includes(category.name);
			const hasSubcats = category.subcategories?.length;

			return (
				<div
					key={category.id}
					className={
						isTopLevel ? styles.topCategoryItem : styles.subCategoryItem
					}
					style={hasSubcats ? {} : { paddingLeft: `${depth * 12}px` }}
				>
					<div className={styles.hor}>
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
					</div>

					<motion.ul
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
								{renderCategories(category.subcategories, depth + 1, visited)}
							</div>
						)}
					</motion.ul>
				</div>
			);
		});
	}

	return (
		<div
			className={styles.filterSideBar}
			style={isFilterOpen ? { left: '0' } : { left: '-100%' }}
		>
			<h2>Filters</h2>
			<div className={styles.selectedInfo}>
				Selected: {selectedCategories.join(', ')}
			</div>
			<div className={styles.filterBar}>
				{Array.isArray(data)
					? data.map(
							(libraryType) =>
								libraryType.categories &&
								renderCategories(libraryType.categories)
					  )
					: data.categories && renderCategories(data.categories)}
			</div>
		</div>
	);
}
