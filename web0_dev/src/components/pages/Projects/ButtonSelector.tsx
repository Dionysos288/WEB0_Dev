import React, { useState, useEffect } from 'react';
import Spacing from '@/components/General/Spacing';
import styles from './ButtonSelector.module.scss';
import { Text } from '@/svgs';

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
}) => {
	const [activeIndex, setActiveIndex] = useState<number>(-1);

	useEffect(() => {
		const chosenIndex = options.findIndex((option) => option === isChosen);
		setActiveIndex(chosenIndex !== -1 ? chosenIndex : 0);
	}, [isChosen, options]);

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
				setIsChosen(options[activeIndex]);
				setIsOpenOption(false);
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
				{options.map((option, index) => (
					<button
						className={`${styles.optionItem} ${
							index === activeIndex ? styles.active : ''
						}`}
						key={index}
						onMouseOverCapture={() => setActiveIndex(index)}
						onClick={() => {
							setIsChosen(option);
							setIsOpenOption(false);
						}}
						tabIndex={-1}
					>
						<div className={styles.leftSide}>
							<Text fill={'var(--main)'} />
							<span>{option}</span>
						</div>
						<div className={styles.leftSide}>
							<Text
								fill={'var(--main)'}
								opacity={isChosen === option ? '1' : '0'}
							/>
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default ButtonSelector;
