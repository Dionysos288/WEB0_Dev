import React, { useState, useEffect } from 'react';
import Spacing from '@/components/general/Spacing';
import styles from './ButtonSelector.module.scss';
import Text from '@/svgs/Text';
import Check from '@/svgs/Check';

interface OptionItem {
	label: string;
	value: string;
	icon?: React.ComponentType<{
		fill?: string;
		width?: string;
		height?: string;
	}>;
	color?: string;
}

interface ButtonSelectorProps<T> {
	query: string;
	onQueryChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<T[]>>,
		oldData: T[]
	) => void;
	inputRef: React.RefObject<HTMLInputElement> | React.RefObject<null>;
	options: T[];
	placeholder: string;
	oldData: T[];
	setOptions: React.Dispatch<React.SetStateAction<T[]>>;
	setIsChosen: (value: string | T) => void;
	setIsOpenOption: React.Dispatch<React.SetStateAction<boolean>>;
	isChosen: string;
	isComboBox?: boolean;
	selectedItems?: string[];
	onSelectedItemsChange?: (items: string[]) => void;
	showColorBadge?: boolean;
}

function ButtonSelector<T extends OptionItem>({
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
	showColorBadge = false,
}: ButtonSelectorProps<T>) {
	const [activeIndex, setActiveIndex] = useState<number>(-1);
	console.log(oldData);
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, [inputRef]);

	useEffect(() => {
		const chosenIndex = options.findIndex(
			(option) => option.value === isChosen
		);
		setActiveIndex(chosenIndex !== -1 ? chosenIndex : 0);
	}, [isChosen, options]);

	const handleItemClick = (option: T) => {
		if (isComboBox) {
			const newSelectedItems = selectedItems.includes(option.value)
				? selectedItems.filter((item) => item !== option.value)
				: [...selectedItems, option.value];
			onSelectedItemsChange(newSelectedItems);

			if (newSelectedItems.length === 0) {
				setIsChosen({ ...option, label: placeholder } as T);
			} else if (newSelectedItems.length === 1) {
				const selectedOption = options.find(
					(opt) => opt.value === newSelectedItems[0]
				);
				if (selectedOption) {
					setIsChosen(selectedOption);
				}
			} else {
				setIsChosen({
					...option,
					label: `${newSelectedItems.length} Assignees`,
				} as T);
			}
		} else {
			setIsChosen(option);
			setIsOpenOption(false);
			setOptions(oldData);
			const emptyEvent = {
				target: { value: '' },
			} as React.ChangeEvent<HTMLInputElement>;
			onQueryChange(emptyEvent, setOptions, oldData);
		}
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

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		onQueryChange(e, setOptions, oldData);
		console.log(value);
		if (value === '') {
			console.log('reset');
			console.log(oldData);
			setOptions(oldData);
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
				onChange={handleInputChange}
				ref={inputRef}
			/>
			<Spacing space={6} />
			<div className={styles.line} />
			<Spacing space={6} />

			<div className={styles.options}>
				{Array.isArray(options) &&
					options.map((option, index) => {
						const Icon = option.icon || Text;
						return (
							<button
								className={`${styles.optionItem} ${
									index === activeIndex ? styles.active : ''
								}`}
								key={index}
								onMouseEnter={() => setActiveIndex(index)}
								onClick={() => handleItemClick(option)}
								tabIndex={-1}
							>
								<div className={styles.leftSide}>
									{isComboBox ? (
										<>
											<input
												type="checkbox"
												checked={selectedItems.includes(option.value)}
												onChange={() => handleItemClick(option)}
												onClick={(e) => e.stopPropagation()}
												className={styles.checkbox}
											/>
											{showColorBadge && option.color ? (
												<div
													className={styles.colorBadge}
													style={{ backgroundColor: option.color }}
												/>
											) : (
												<div className={styles.iconCombo}>
													<Icon fill={'var(--main)'} width="16" height="16" />
												</div>
											)}
										</>
									) : (
										<div className={styles.iconNoCombo}>
											<Icon fill={'var(--main)'} width="16" height="16" />
										</div>
									)}
									<span>{option.label}</span>
								</div>
								{!isComboBox && (
									<div className={styles.leftSide}>
										<Check
											fill={'var(--main-90)'}
											width="16"
											height="16"
											style={{ opacity: isChosen === option.value ? '1' : '0' }}
										/>
									</div>
								)}
							</button>
						);
					})}
			</div>
		</div>
	);
}

export default ButtonSelector;
