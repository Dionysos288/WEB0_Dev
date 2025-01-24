'use client';
import { useState } from 'react';
import { Arrow } from '@/svgs';
import { motion } from 'motion/react';
import { Category, Library, LibraryType } from '@prisma/client';
import styles from './FilterSideBar.module.scss';
import { updateDataFiltered } from '@/actions/GetLibraryItems';

type ExtendedCategory = Category & { subcategories: ExtendedCategory[] };

export default function FilterSideBar({
	data,
	setData,
}: {
	data: LibraryType & { categories: ExtendedCategory[] };
	setData: React.Dispatch<React.SetStateAction<Library[]>>;
}) {
	const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
		{}
	);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

		const updatedData = await updateDataFiltered({
			selectedCategories: newSelectedCategories,
			id: data.id,
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
								<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
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
		<div className={styles.filterSideBar}>
			<h2>Filters</h2>
			<div className={styles.selectedInfo}>
				Selected: {selectedCategories.join(', ')}
			</div>
			<div className={styles.filterBar}>
				{data?.categories && renderCategories(data.categories)}
			</div>
		</div>
	);
}
