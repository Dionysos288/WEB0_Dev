import React, { useState, useRef, Dispatch, SetStateAction } from 'react';
import ButtonSelector from '@/components/pages/projects/addProject/ButtonSelector';
import { LibraryType } from '@prisma/client';
import Category from '@/svgs/Category';

interface MainCategorySelectorProps {
	libraryTypes: LibraryType[];
	selectedTypeId: string;
	onTypeSelect: (typeId: string) => void;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface CategoryOption {
	label: string;
	value: string;
	icon: React.ComponentType<{
		fill?: string;
		width?: string;
		height?: string;
	}>;
}

const MainCategorySelector: React.FC<MainCategorySelectorProps> = ({
	libraryTypes,
	selectedTypeId,
	onTypeSelect,
	isOpen,
	setIsOpen,
}) => {
	const [query, setQuery] = useState('');
	const [filteredOptions, setFilteredOptions] = useState<CategoryOption[]>(
		libraryTypes.map((type) => ({
			label: type.name,
			value: type.id,
			icon: Category,
		}))
	);
	const inputRef = useRef(null);

	const handleQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: Dispatch<SetStateAction<CategoryOption[]>>,
		oldData: CategoryOption[]
	) => {
		const value = e.target.value;
		setQuery(value);

		if (value.trim() === '') {
			setOptions(oldData);
			return;
		}

		const filtered = oldData.filter((option) =>
			option.label.toLowerCase().includes(value.toLowerCase())
		);
		setOptions(filtered);
	};

	const handleSelect = (value: string | CategoryOption) => {
		if (typeof value === 'string') {
			onTypeSelect(value);
		} else {
			onTypeSelect(value.value);
		}
		setQuery('');
	};

	return (
		<div style={{ position: 'relative' }}>
			{isOpen && (
				<ButtonSelector
					query={query}
					onQueryChange={handleQueryChange}
					inputRef={inputRef}
					options={filteredOptions}
					placeholder="Select Main Category"
					oldData={libraryTypes.map((type) => ({
						label: type.name,
						value: type.id,
						icon: Category,
					}))}
					setOptions={setFilteredOptions}
					setIsChosen={handleSelect}
					setIsOpenOption={setIsOpen}
					isChosen={selectedTypeId}
					isComboBox={false}
				/>
			)}
		</div>
	);
};

export default MainCategorySelector;
