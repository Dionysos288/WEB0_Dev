import styles from './InputSelector.module.scss';
const InputSelector = ({
	onQueryChange,
	inputRef,
	options,
	setIsOpenOption,
}: {
	onQueryChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<string[]>>
	) => void;
	inputRef: React.RefObject<HTMLInputElement> | React.RefObject<null>;
	options: number | string;
	setIsOpenOption: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	return (
		<div className={styles.inputs} onClick={(e) => e.stopPropagation()}>
			<input
				type="number"
				placeholder="Insert budget.."
				value={options}
				onChange={onQueryChange}
				onEnter={setIsOpenOption(false)}
				ref={inputRef}
			/>
		</div>
	);
};

export default InputSelector;
