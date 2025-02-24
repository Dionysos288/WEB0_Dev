import { memo, useCallback, useEffect, useState } from 'react';
import styles from './ImageBlockWidth.module.scss';

export type ImageBlockWidthProps = {
	onChange: (value: number) => void;
	value: number;
};

export const ImageBlockWidth = memo(
	({ onChange, value }: ImageBlockWidthProps) => {
		const [currentValue, setCurrentValue] = useState(value);

		useEffect(() => {
			setCurrentValue(value);
		}, [value]);

		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const nextValue = parseInt(e.target.value);
				onChange(nextValue);
				setCurrentValue(nextValue);
			},
			[onChange]
		);

		return (
			<div className={styles.container}>
				<input
					className={styles.slider}
					type="range"
					min="25"
					max="100"
					step="25"
					onChange={handleChange}
					value={currentValue}
				/>
				<span className={styles.value}>{value}%</span>
			</div>
		);
	}
);

ImageBlockWidth.displayName = 'ImageBlockWidth';
