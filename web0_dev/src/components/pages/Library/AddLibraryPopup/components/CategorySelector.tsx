import React, { useState, useRef, useEffect } from 'react';
import styles from './CategorySelector.module.scss';
import { ExtendedCategory } from '@/components/types/types';
import Check from '@/svgs/Check';
import Search from '@/svgs/Search';
import Dismiss from '@/svgs/Dismiss';
import ChevronRight from '@/svgs/ChevronRight';
import ChevronDown from '@/svgs/ChevronDown';

interface CategorySelectorProps {
	categories: ExtendedCategory[];
	selectedCategoryId: string;
	setSelectedCategoryId: (id: string) => void;
	setIsCategoryOpen: (isOpen: boolean) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
	categories,
	selectedCategoryId,
	setSelectedCategoryId,
	setIsCategoryOpen,
}) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set()
	);
	const selectorRef = useRef<HTMLDivElement>(null);

	const getCategoryTree = (categories: ExtendedCategory[]) => {
		const categoryMap = new Map<
			string,
			ExtendedCategory & { children: ExtendedCategory[] }
		>();
		const rootCategories: (ExtendedCategory & {
			children: ExtendedCategory[];
		})[] = [];

		categories.forEach((category) => {
			categoryMap.set(category.id, { ...category, children: [] });
		});

		categories.forEach((category) => {
			if (category.parentId) {
				const parent = categoryMap.get(category.parentId);
				if (parent) {
					parent.children.push(categoryMap.get(category.id)!);
				}
			} else {
				rootCategories.push(categoryMap.get(category.id)!);
			}
		});

		return rootCategories;
	};

	const filterCategories = (query: string) => {
		if (!query) return categories;

		return categories.filter((category) =>
			category.name.toLowerCase().includes(query.toLowerCase())
		);
	};

	const filteredCategories = filterCategories(searchQuery);
	const categoryTree = getCategoryTree(filteredCategories);

	useEffect(() => {
		if (selectorRef.current) {
			selectorRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleCategorySelect = (categoryId: string) => {
		if (categoryId === selectedCategoryId) {
			setSelectedCategoryId('');
		} else {
			setSelectedCategoryId(categoryId);
			setIsCategoryOpen(false);
		}
	};

	const toggleExpand = (categoryId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setExpandedCategories((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(categoryId)) {
				newSet.delete(categoryId);
			} else {
				newSet.add(categoryId);
			}
			return newSet;
		});
	};

	const renderCategoryTree = (
		category: ExtendedCategory & { children: ExtendedCategory[] },
		level = 0
	) => {
		const hasChildren = category.children && category.children.length > 0;
		const isExpanded = expandedCategories.has(category.id);

		return (
			<div key={category.id} className={styles.categoryTreeItem}>
				<button
					className={`${styles.categoryItem} ${
						selectedCategoryId === category.id ? styles.selected : ''
					}`}
					onClick={() => handleCategorySelect(category.id)}
					style={{ paddingLeft: `${level * 20 + 12}px` }}
				>
					<div className={styles.leftSide}>
						{hasChildren && (
							<button
								className={styles.expandButton}
								onClick={(e) => toggleExpand(category.id, e)}
							>
								{isExpanded ? (
									<ChevronDown width="16" height="16" fill="var(--main-65)" />
								) : (
									<ChevronRight width="16" height="16" fill="var(--main-65)" />
								)}
							</button>
						)}
						{!hasChildren && <div className={styles.indent} />}
						<span>{category.name}</span>
					</div>
					{selectedCategoryId === category.id && (
						<div className={styles.rightSide}>
							<Check fill="var(--orange-90)" width="16" height="16" />
						</div>
					)}
				</button>
				{hasChildren && isExpanded && (
					<div className={styles.children}>
						{category.children.map((child) =>
							renderCategoryTree(
								{ ...child, children: child.subcategories || [] },
								level + 1
							)
						)}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className={styles.categorySelector} ref={selectorRef}>
			<div className={styles.topPart}>
				<h3>Select Category</h3>
				<button
					className={styles.closeButton}
					onClick={() => setIsCategoryOpen(false)}
				>
					<Dismiss width="16" height="16" />
				</button>
			</div>

			<div className={styles.searchWrapper}>
				<Search width="16" height="16" fill="var(--main-65)" />
				<input
					type="text"
					value={searchQuery}
					onChange={handleInputChange}
					placeholder="Search categories..."
					className={styles.searchInput}
				/>
			</div>

			<div className={styles.categoryList}>
				{categoryTree.length > 0 ? (
					categoryTree.map((category) => renderCategoryTree(category))
				) : (
					<div className={styles.noResults}>
						<span>No categories found</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default CategorySelector;
