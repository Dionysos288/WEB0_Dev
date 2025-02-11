import React, { useState, useEffect } from 'react';
import Spacing from '@/components/general/Spacing';
import styles from './ButtonSelector.module.scss';
import Text from '@/svgs/Text';
import Check from '@/svgs/Check';

const ButtonSelector = ({
	query,
	onQueryChange,
	inputRef,
	setOptions,
	options,
	oldData,
	placeholder,
	setIsChosen,
	setIsOpenOption,
	isChosen,
	isComboBox = false,
	selectedItems = [],
	onSelectedItemsChange = () => {},
}: {
	query: string;
	onQueryChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<string[]>>,
		oldData: string[]
	) => void;
	inputRef: React.RefObject<HTMLInputElement> | React.RefObject<null>;
	options: string[];
	placeholder: string;
	oldData: string[];
	setOptions: React.Dispatch<React.SetStateAction<string[]>>;
	setIsChosen: React.Dispatch<React.SetStateAction<string>>;
	setIsOpenOption: React.Dispatch<React.SetStateAction<boolean>>;
	isChosen: string;
	isComboBox?: boolean;
	selectedItems?: string[];
	onSelectedItemsChange?: (items: string[]) => void;
}) => {
	const [activeIndex, setActiveIndex] = useState<number>(-1);

	useEffect(() => {
		const chosenIndex = options.findIndex((option) => option === isChosen);
		setActiveIndex(chosenIndex !== -1 ? chosenIndex : 0);
	}, [isChosen, options]);

	const handleItemClick = (option: string) => {
		if (isComboBox) {
			const newSelectedItems = selectedItems.includes(option)
				? selectedItems.filter((item) => item !== option)
				: [...selectedItems, option];
			onSelectedItemsChange(newSelectedItems);
		} else {
			setIsChosen(option);
			setIsOpenOption(false);
		}
	};

	const handleCheckboxClick = (
		e: React.MouseEvent<HTMLInputElement>,
		option: string
	) => {
		e.stopPropagation();
		handleItemClick(option);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			setActiveIndex((prevIndex) => (prevIndex + 1) % options.length);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setActiveIndex(
				(prevIndex) => (prevIndex - 1 + options.length) % options.length
			);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (activeIndex >= 0 && activeIndex < options.length) {
				handleItemClick(options[activeIndex]);
			}
		}
	};

	return (
		<div
			className={styles.inputs}
			onClick={(e) => e.stopPropagation()}
			onKeyDown={handleKeyDown}
			tabIndex={0}
		>
			<input
				type="text"
				placeholder={placeholder}
				value={query}
				onChange={(e) => onQueryChange(e, setOptions, oldData)}
				ref={inputRef}
			/>
			<Spacing space={6} />
			<div className={styles.line} />
			<Spacing space={6} />

			<div className={styles.options}>
				{Array.isArray(options) &&
					options.map((option, index) => (
						<button
							className={`${styles.optionItem} ${
								index === activeIndex ? styles.active : ''
							}`}
							key={index}
							onMouseOverCapture={() => setActiveIndex(index)}
							onClick={() => handleItemClick(option)}
							tabIndex={-1}
						>
							<div className={styles.leftSide}>
								{isComboBox ? (
									<>
										<input
											type="checkbox"
											checked={selectedItems.includes(option)}
											onChange={() => {}}
											onClick={(e) => handleCheckboxClick(e, option)}
											className={styles.checkbox}
										/>
										<div className={styles.iconCombo}>
											<Text fill={'var(--main)'} width="16" height="16" />
										</div>
									</>
								) : (
									<div className={styles.iconNoCombo}>
										<Text fill={'var(--main)'} width="16" height="16" />
									</div>
								)}
								<span>{option}</span>
							</div>
							{!isComboBox && (
								<div className={styles.leftSide}>
									<Check
										fill={'var(--main-90)'}
										width="16"
										height="16"
										style={{ opacity: isChosen === option ? '1' : '0' }}
									/>
								</div>
							)}
						</button>
					))}
			</div>
		</div>
	);
};

export default ButtonSelector;
