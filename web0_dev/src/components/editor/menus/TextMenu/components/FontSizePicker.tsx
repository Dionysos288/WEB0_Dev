import { DropdownButton } from '@/components/editor/components/Dropdown/Dropdown';
import { Icon } from '@/components/editor/components/Icon';
import { Surface } from '@/components/editor/components/Surface';
import { Toolbar } from '@/components/editor/components/Toolbar';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { useCallback } from 'react';
import styles from './FontSizePicker.module.scss';

const FONT_SIZES = [
	{ label: 'Smaller', value: '12px' },
	{ label: 'Small', value: '14px' },
	{ label: 'Medium', value: '' },
	{ label: 'Large', value: '18px' },
	{ label: 'Extra Large', value: '24px' },
];

export type FontSizePickerProps = {
	onChange: (value: string) => void; // eslint-disable-line no-unused-vars
	value: string;
};

export const FontSizePicker = ({ onChange, value }: FontSizePickerProps) => {
	const currentValue = FONT_SIZES.find((size) => size.value === value);
	const currentSizeLabel = currentValue?.label.split(' ')[0] || 'Medium';

	const selectSize = useCallback(
		(size: string) => () => onChange(size),
		[onChange]
	);

	return (
		<Dropdown.Root>
			<Dropdown.Trigger asChild>
				<Toolbar.Button active={!!currentValue?.value}>
					{currentSizeLabel}
					<Icon name="ChevronDown" className={styles.chevron} />
				</Toolbar.Button>
			</Dropdown.Trigger>
			<Dropdown.Content asChild>
				<Surface className={styles.content}>
					{FONT_SIZES.map((size) => (
						<DropdownButton
							isActive={value === size.value}
							onClick={selectSize(size.value)}
							key={`${size.label}_${size.value}`}
						>
							<span style={{ fontSize: size.value }}>{size.label}</span>
						</DropdownButton>
					))}
				</Surface>
			</Dropdown.Content>
		</Dropdown.Root>
	);
};
