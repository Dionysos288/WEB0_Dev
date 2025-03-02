import React, { useState, useRef, useEffect } from 'react';
import styles from './CategorySelector.module.scss';
import { ExtendedCategory } from '@/components/types/types';
import Spacing from '@/components/general/Spacing';
import Check from '@/svgs/Check';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';

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
	const [activeIndex, setActiveIndex] = useState<number>(-1);
	const inputRef = useRef<HTMLInputElement>(null);

	// Filter categories based on search query
	const filteredCategories = searchQuery
		? categories.filter((category) =>
				category.name.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: categories;

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	useEffect(() => {
		if (searchQuery) {
			const filtered = categories.filter((category) =>
				category.name.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setActiveIndex(filtered.length > 0 ? 0 : -1);
		} else {
			setActiveIndex(categories.length > 0 ? 0 : -1);
		}
	}, [searchQuery, categories]);

	// Function to generate a consistent color based on category name
	const getCategoryColor = (name: string) => {
		const colors = [
			'#FF6B6B',
			'#4ECDC4',
			'#45B7D1',
			'#FFA5A5',
			'#98D8C8',
			'#F9C74F',
			'#90BE6D',
			'#43AA8B',
			'#577590',
			'#F94144',
		];

		// Simple hash function to get a consistent index
		const hash = name.split('').reduce((acc, char) => {
			return acc + char.charCodeAt(0);
		}, 0);

		return colors[hash % colors.length];
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			if (activeIndex >= 0 && activeIndex < filteredCategories.length) {
				setSelectedCategoryId(filteredCategories[activeIndex].id);
				setIsCategoryOpen(false);
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			const maxIndex =
				filteredCategories.length > 0 ? filteredCategories.length - 1 : 0;
			setActiveIndex((prevIndex) => (prevIndex < maxIndex ? prevIndex + 1 : 0));
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			const maxIndex =
				filteredCategories.length > 0 ? filteredCategories.length - 1 : 0;
			setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : maxIndex));
		} else if (e.key === 'Escape') {
			setIsCategoryOpen(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleCategorySelect = (categoryId: string) => {
		setSelectedCategoryId(categoryId);
		setIsCategoryOpen(false);
	};

	return (
		<ClickOutsideWrapper onClose={() => setIsCategoryOpen(false)}>
			<div
				className={styles.inputs}
				onKeyDown={handleKeyDown}
				tabIndex={0}
				onClick={(e) => e.stopPropagation()}
			>
				<input
					ref={inputRef}
					type="text"
					value={searchQuery}
					onChange={handleInputChange}
					placeholder="Search categories..."
				/>
				<Spacing space={6} />
				<div className={styles.line} />
				<Spacing space={6} />

				<div className={styles.options}>
					{filteredCategories.length > 0 ? (
						filteredCategories.map((category, index) => (
							<button
								key={category.id}
								className={`${styles.optionItem} ${
									index === activeIndex ? styles.active : ''
								}`}
								onClick={() => handleCategorySelect(category.id)}
								onMouseEnter={() => setActiveIndex(index)}
								tabIndex={-1}
							>
								<div className={styles.leftSide}>
									<div
										className={styles.colorBadge}
										style={{ backgroundColor: getCategoryColor(category.name) }}
									/>
									<span>{category.name}</span>
								</div>
								<div className={styles.rightSide}>
									<Check
										fill={'var(--main-90)'}
										width="16"
										height="16"
										style={{
											opacity: selectedCategoryId === category.id ? '1' : '0',
										}}
									/>
								</div>
							</button>
						))
					) : (
						<div className={styles.noResults}>
							<span>No categories found</span>
						</div>
					)}
				</div>
			</div>
		</ClickOutsideWrapper>
	);
};

export default CategorySelector;
