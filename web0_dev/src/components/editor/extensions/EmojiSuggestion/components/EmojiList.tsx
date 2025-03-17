import { EmojiItem } from '@tiptap-pro/extension-emoji';
import React, {
	ForwardedRef,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react';
import { Button } from '@/components/editor/components/Button/Button';
import { Panel } from '@/components/editor/components/Panel';
import { EmojiListProps } from '../types';
import { SuggestionKeyDownProps } from '@tiptap/suggestion';
import styles from './EmojiList.module.scss';

const EmojiList = forwardRef(
	(
		props: EmojiListProps,
		ref: ForwardedRef<{ onKeyDown: (evt: SuggestionKeyDownProps) => boolean }>
	) => {
		const [selectedIndex, setSelectedIndex] = useState(0);

		useEffect(() => setSelectedIndex(0), [props.items]);

		const selectItem = useCallback(
			(index: number) => {
				const item = props.items[index];

				if (item) {
					props.command({ name: item.name });
				}
			},
			[props]
		);

		useImperativeHandle(
			ref,
			() => {
				const scrollIntoView = (index: number) => {
					const item = props.items[index];

					if (item) {
						const node = document.querySelector(
							`[data-emoji-name="${item.name}"]`
						);

						if (node) {
							node.scrollIntoView({ block: 'nearest' });
						}
					}
				};

				const upHandler = () => {
					const newIndex =
						(selectedIndex + props.items.length - 1) % props.items.length;
					setSelectedIndex(newIndex);
					scrollIntoView(newIndex);
				};

				const downHandler = () => {
					const newIndex = (selectedIndex + 1) % props.items.length;
					setSelectedIndex(newIndex);
					scrollIntoView(newIndex);
				};

				const enterHandler = () => {
					selectItem(selectedIndex);
				};

				return {
					onKeyDown: ({ event }) => {
						if (event.key === 'ArrowUp') {
							upHandler();
							return true;
						}

						if (event.key === 'ArrowDown') {
							downHandler();
							return true;
						}

						if (event.key === 'Enter') {
							enterHandler();
							return true;
						}

						return false;
					},
				};
			},
			[props, selectedIndex, selectItem]
		);

		const createClickHandler = useCallback(
			(index: number) => () => selectItem(index),
			[selectItem]
		);

		if (!props.items || !props.items.length) {
			return null;
		}

		return (
			<Panel className={styles.root}>
				{props.items.map((item: EmojiItem, index: number) => (
					<Button
						active={index === selectedIndex}
						variant="ghost"
						className={styles.button}
						buttonSize="small"
						key={item.name}
						onClick={createClickHandler(index)}
						data-emoji-name={item.name}
					>
						{item.fallbackImage ? (
							<img
								src={item.fallbackImage}
								className={styles.emoji}
								alt="emoji"
							/>
						) : (
							item.emoji
						)}{' '}
						<span className={styles.label}>:{item.name}:</span>
					</Button>
				))}
			</Panel>
		);
	}
);

EmojiList.displayName = 'EmojiList';

export default EmojiList;
