import React, { useState, useEffect, useRef } from 'react';
import styles from './TagSelector.module.scss';
import Spacing from '@/components/general/Spacing';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';

interface TagSelectorProps {
	existingTags: string[];
	selectedTags: string[];
	setSelectedTags: (tags: string[]) => void;
	onAddNewTag: (tag: string) => void;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
	existingTags,
	selectedTags,
	setSelectedTags,
	onAddNewTag,
	isOpen,
	setIsOpen,
}) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredTags, setFilteredTags] = useState<string[]>(existingTags);
	const [activeIndex, setActiveIndex] = useState<number>(-1);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	useEffect(() => {
		if (searchQuery) {
			const filtered = existingTags.filter((tag) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setFilteredTags(filtered);
			setActiveIndex(filtered.length > 0 ? 0 : -1);
		} else {
			setFilteredTags(existingTags);
			setActiveIndex(existingTags.length > 0 ? 0 : -1);
		}
	}, [searchQuery, existingTags]);

	const handleTagSelect = (tag: string) => {
		if (selectedTags.includes(tag)) {
			setSelectedTags(selectedTags.filter((t) => t !== tag));
		} else {
			setSelectedTags([...selectedTags, tag]);
		}
	};

	const handleCreateTag = () => {
		if (searchQuery && !existingTags.includes(searchQuery)) {
			onAddNewTag(searchQuery);
			setSelectedTags([...selectedTags, searchQuery]);
			setSearchQuery('');
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			if (searchQuery && !filteredTags.includes(searchQuery)) {
				handleCreateTag();
			} else if (activeIndex >= 0 && activeIndex < filteredTags.length) {
				handleTagSelect(filteredTags[activeIndex]);
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			const maxIndex = filteredTags.length > 0 ? filteredTags.length - 1 : 0;
			setActiveIndex((prevIndex) => (prevIndex < maxIndex ? prevIndex + 1 : 0));
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			const maxIndex = filteredTags.length > 0 ? filteredTags.length - 1 : 0;
			setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : maxIndex));
		} else if (e.key === 'Escape') {
			setIsOpen(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	return (
		<ClickOutsideWrapper onClose={() => setIsOpen(false)}>
			<div
				className={styles.inputs}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={handleKeyDown}
				tabIndex={0}
			>
				<input
					ref={inputRef}
					type="text"
					value={searchQuery}
					onChange={handleInputChange}
					placeholder="Search or create tags..."
				/>
				<Spacing space={6} />
				<div className={styles.line} />
				<Spacing space={6} />

				<div className={styles.options}>
					{filteredTags.length > 0 ? (
						filteredTags.map((tag, index) => (
							<button
								key={tag}
								className={`${styles.optionItem} ${
									index === activeIndex ? styles.active : ''
								}`}
								onMouseEnter={() => setActiveIndex(index)}
								onClick={() => handleTagSelect(tag)}
								tabIndex={-1}
							>
								<div className={styles.leftSide}>
									<input
										type="checkbox"
										checked={selectedTags.includes(tag)}
										onChange={() => handleTagSelect(tag)}
										onClick={(e) => e.stopPropagation()}
										className={styles.checkbox}
									/>
									<span>{tag}</span>
								</div>
							</button>
						))
					) : (
						<div className={styles.noResults}>
							{searchQuery ? (
								<button
									className={`${styles.optionItem} ${styles.createNewTag}`}
									onClick={handleCreateTag}
								>
									<div className={styles.leftSide}>
										<input
											type="checkbox"
											checked={false}
											onChange={handleCreateTag}
											onClick={(e) => e.stopPropagation()}
											className={styles.checkbox}
										/>
										<span>
											Create: <strong>{searchQuery}</strong>
										</span>
									</div>
								</button>
							) : (
								<span>No tags found</span>
							)}
						</div>
					)}

					{searchQuery &&
						!filteredTags.includes(searchQuery) &&
						filteredTags.length > 0 && (
							<button
								className={`${styles.optionItem} ${styles.createNewTag} ${
									activeIndex === filteredTags.length ? styles.active : ''
								}`}
								onClick={handleCreateTag}
								onMouseEnter={() => setActiveIndex(filteredTags.length)}
								tabIndex={-1}
							>
								<div className={styles.leftSide}>
									<input
										type="checkbox"
										checked={false}
										onChange={handleCreateTag}
										onClick={(e) => e.stopPropagation()}
										className={styles.checkbox}
									/>
									<span>
										Create: <strong>{searchQuery}</strong>
									</span>
								</div>
							</button>
						)}
				</div>
			</div>
		</ClickOutsideWrapper>
	);
};

export default TagSelector;
