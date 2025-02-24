import { useCallback, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ColorButton } from './ColorButton';
import { Toolbar } from '@/components/editor/components/Toolbar';
import { Icon } from '@/components/editor/components/Icon';
import { themeColors } from '@/data/themeColors';
import styles from './Colorpicker.module.scss';

export type ColorPickerProps = {
	color?: string;
	onChange?: (color: string) => void;
	onClear?: () => void;
};

export const ColorPicker = ({ color, onChange, onClear }: ColorPickerProps) => {
	const [colorInputValue, setColorInputValue] = useState(color || '');

	const handleColorUpdate = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setColorInputValue(event.target.value);
		},
		[]
	);

	const handleColorChange = useCallback(() => {
		const isCorrectColor = /^#([0-9A-F]{3}){1,2}$/i.test(colorInputValue);

		if (!isCorrectColor) {
			if (onChange) {
				onChange('');
			}

			return;
		}

		if (onChange) {
			onChange(colorInputValue);
		}
	}, [colorInputValue, onChange]);

	return (
		<div className={styles.container}>
			<HexColorPicker
				className={styles.colorPicker}
				color={color || ''}
				onChange={onChange}
			/>
			<input
				type="text"
				className={styles.input}
				placeholder="#000000"
				value={colorInputValue}
				onChange={handleColorUpdate}
				onBlur={handleColorChange}
			/>
			<div className={styles.colorsGrid}>
				{themeColors.map((currentColor) => (
					<ColorButton
						active={currentColor === color}
						color={currentColor}
						key={currentColor}
						onColorChange={onChange}
					/>
				))}
				<Toolbar.Button tooltip="Reset color to default" onClick={onClear}>
					<Icon name="Undo" />
				</Toolbar.Button>
			</div>
		</div>
	);
};
