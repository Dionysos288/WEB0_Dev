import React from 'react';
import styles from './LibraryComponentSelector.module.scss';
import { LibraryTypeOption } from '../types';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';

interface LibraryComponentSelectorProps {
	libraryTypeOptions: LibraryTypeOption[];
	selectedComponentType: string;
	setSelectedComponentType: (id: LibraryTypeOption['id']) => void;
	activeCategory: 'code' | 'design';
	setActiveCategory: (category: 'code' | 'design') => void;
	setIsComponentTypeOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LibraryComponentSelector: React.FC<LibraryComponentSelectorProps> = ({
	libraryTypeOptions,
	selectedComponentType,
	setSelectedComponentType,
	activeCategory,
	setActiveCategory,
	setIsComponentTypeOpen,
}) => {
	const handleSelectType = (typeId: LibraryTypeOption['id']) => {
		setSelectedComponentType(typeId);
		setIsComponentTypeOpen(false);
	};

	return (
		<ClickOutsideWrapper onClose={() => setIsComponentTypeOpen(false)}>
			<div className={styles.componentSelector}>
				<div className={styles.topPart}>
					<h3>Component Type</h3>
					<div className={styles.categoryTabs}>
						<button
							className={`${styles.categoryTab} ${
								activeCategory === 'code' ? styles.active : ''
							}`}
							onClick={() => setActiveCategory('code')}
						>
							Code
						</button>
						<button
							className={`${styles.categoryTab} ${
								activeCategory === 'design' ? styles.active : ''
							}`}
							onClick={() => setActiveCategory('design')}
						>
							Design
						</button>
					</div>
				</div>

				<div className={styles.componentOptions}>
					{libraryTypeOptions
						.filter((option) => option.category === activeCategory)
						.map((option) => (
							<div
								key={option.id}
								className={`${styles.componentOption} ${
									selectedComponentType === option.id ? styles.selected : ''
								}`}
								onClick={() => handleSelectType(option.id)}
							>
								<div className={styles.optionIcon}>
									<option.icon
										width="24"
										height="24"
										fill={
											selectedComponentType === option.id
												? 'var(--orange-90)'
												: 'var(--main-75)'
										}
									/>
								</div>
								<div className={styles.optionContent}>
									<h4>{option.name}</h4>
									<p>{option.description}</p>
								</div>
							</div>
						))}
				</div>
			</div>
		</ClickOutsideWrapper>
	);
};

export default LibraryComponentSelector;
