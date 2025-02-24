import { useCallback } from 'react';
import styles from './Toggle.module.scss';

export type ToggleProps = {
	active?: boolean;
	onChange: (active: boolean) => void;
	size?: 'small' | 'large';
};

export const Toggle = ({
	onChange,
	active = false,
	size = 'large',
}: ToggleProps) => {
	const state = active ? 'checked' : 'unchecked';
	const value = active ? 'on' : 'off';

	const buttonClass = [styles.toggle, active && styles.active, styles[size]]
		.filter(Boolean)
		.join(' ');

	const pinClass = [styles.pin, styles[size]].filter(Boolean).join(' ');

	const handleChange = useCallback(() => {
		onChange(!active);
	}, [active, onChange]);

	return (
		<button
			className={buttonClass}
			type="button"
			role="switch"
			aria-checked={active}
			data-state={state}
			value={value}
			onClick={handleChange}
		>
			<span className={pinClass} data-state={state} />
		</button>
	);
};
