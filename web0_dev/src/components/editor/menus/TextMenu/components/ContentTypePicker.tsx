import { Icon } from '@/components/editor/components/Icon';
import { icons } from 'lucide-react';
import { useMemo } from 'react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { Toolbar } from '@/components/editor/components/Toolbar';
import { Surface } from '@/components/editor/components/Surface';
import {
	DropdownButton,
	DropdownCategoryTitle,
} from '@/components/editor/components/Dropdown/Dropdown';
import styles from './ContentTypePicker.module.scss';

export type ContentTypePickerOption = {
	label: string;
	id: string;
	type: 'option';
	disabled: () => boolean;
	isActive: () => boolean;
	onClick: () => void;
	icon: keyof typeof icons;
};

export type ContentTypePickerCategory = {
	label: string;
	id: string;
	type: 'category';
};

export type ContentPickerOptions = Array<
	ContentTypePickerOption | ContentTypePickerCategory
>;

export type ContentTypePickerProps = {
	options: ContentPickerOptions;
};

const isOption = (
	option: ContentTypePickerOption | ContentTypePickerCategory
): option is ContentTypePickerOption => option.type === 'option';
const isCategory = (
	option: ContentTypePickerOption | ContentTypePickerCategory
): option is ContentTypePickerCategory => option.type === 'category';

export const ContentTypePicker = ({ options }: ContentTypePickerProps) => {
	const activeItem = useMemo(
		() =>
			options.find((option) => option.type === 'option' && option.isActive()),
		[options]
	);

	return (
		<Dropdown.Root>
			<Dropdown.Trigger asChild>
				<Toolbar.Button
					active={activeItem?.id !== 'paragraph' && !!activeItem?.type}
				>
					<Icon
						name={
							(activeItem?.type === 'option' && activeItem.icon) || 'Pilcrow'
						}
					/>
					<Icon name="ChevronDown" className={styles.chevron} />
				</Toolbar.Button>
			</Dropdown.Trigger>
			<Dropdown.Content asChild>
				<Surface className={styles.content}>
					{options.map((option) => {
						if (isOption(option)) {
							return (
								<DropdownButton
									key={option.id}
									onClick={option.onClick}
									isActive={option.isActive()}
								>
									<Icon name={option.icon} className={styles.icon} />
									{option.label}
								</DropdownButton>
							);
						} else if (isCategory(option)) {
							return (
								<div className={styles.categoryWrapper} key={option.id}>
									<DropdownCategoryTitle key={option.id}>
										{option.label}
									</DropdownCategoryTitle>
								</div>
							);
						}
					})}
				</Surface>
			</Dropdown.Content>
		</Dropdown.Root>
	);
};
