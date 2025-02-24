import {
	DropdownButton,
	DropdownCategoryTitle,
} from '@/components/editor/components/Dropdown/Dropdown';
import { Icon } from '@/components/editor/components/Icon';
import { Surface } from '@/components/editor/components/Surface';
import { Toolbar } from '@/components/editor/components/Toolbar';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { useCallback } from 'react';
import styles from './FontFamilyPicker.module.scss';

const FONT_FAMILY_GROUPS = [
	{
		label: 'Sans Serif',
		options: [
			{ label: 'Inter', value: '' },
			{ label: 'Arial', value: 'Arial' },
			{ label: 'Helvetica', value: 'Helvetica' },
		],
	},
	{
		label: 'Serif',
		options: [
			{ label: 'Times New Roman', value: 'Times' },
			{ label: 'Garamond', value: 'Garamond' },
			{ label: 'Georgia', value: 'Georgia' },
		],
	},
	{
		label: 'Monospace',
		options: [
			{ label: 'Courier', value: 'Courier' },
			{ label: 'Courier New', value: 'Courier New' },
		],
	},
];

const FONT_FAMILIES = FONT_FAMILY_GROUPS.flatMap((group) => [
	group.options,
]).flat();

export type FontFamilyPickerProps = {
	onChange: (value: string) => void; // eslint-disable-line no-unused-vars
	value: string;
};

export const FontFamilyPicker = ({
	onChange,
	value,
}: FontFamilyPickerProps) => {
	const currentValue = FONT_FAMILIES.find((size) => size.value === value);
	const currentFontLabel = currentValue?.label.split(' ')[0] || 'Inter';

	const selectFont = useCallback(
		(font: string) => () => onChange(font),
		[onChange]
	);

	return (
		<Dropdown.Root>
			<Dropdown.Trigger asChild>
				<Toolbar.Button active={!!currentValue?.value}>
					{currentFontLabel}
					<Icon name="ChevronDown" className={styles.chevron} />
				</Toolbar.Button>
			</Dropdown.Trigger>
			<Dropdown.Content asChild>
				<Surface className={styles.content}>
					{FONT_FAMILY_GROUPS.map((group) => (
						<div className={styles.groupWrapper} key={group.label}>
							<DropdownCategoryTitle>{group.label}</DropdownCategoryTitle>
							{group.options.map((font) => (
								<DropdownButton
									isActive={value === font.value}
									onClick={selectFont(font.value)}
									key={`${font.label}_${font.value}`}
								>
									<span style={{ fontFamily: font.value }}>{font.label}</span>
								</DropdownButton>
							))}
						</div>
					))}
				</Surface>
			</Dropdown.Content>
		</Dropdown.Root>
	);
};
