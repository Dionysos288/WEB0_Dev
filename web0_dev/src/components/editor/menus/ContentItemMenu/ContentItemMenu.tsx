import { Icon } from '@/components/editor/components/Icon';
import { Toolbar } from '@/components/editor/components/Toolbar';
import { Editor } from '@tiptap/react';

import * as Popover from '@radix-ui/react-popover';
import { Surface } from '@/components/editor/components/Surface';
import { DropdownButton } from '@/components/editor/components/Dropdown/Dropdown';
import useContentItemActions from './hooks/useContentItemActions';
import { useData } from './hooks/useData';
import { useEffect, useState } from 'react';
import styles from './ContentItemMenu.module.scss';

export type ContentItemMenuProps = {
	editor: Editor;
	isEditable?: boolean;
};

export const ContentItemMenu = ({
	editor,
	isEditable = true,
}: ContentItemMenuProps) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const data = useData();
	const actions = useContentItemActions(
		editor,
		data.currentNode,
		data.currentNodePos
	);

	useEffect(() => {
		if (menuOpen) {
			editor.commands.setMeta('lockDragHandle', true);
		} else {
			editor.commands.setMeta('lockDragHandle', false);
		}
	}, [editor, menuOpen]);

	return (
		// <DragHandle
		// 	pluginKey="ContentItemMenu"
		// 	editor={editor}
		// 	onNodeChange={data.handleNodeChange}
		// 	tippyOptions={{
		// 		offset: [-2, 16],
		// 		zIndex: 99,
		// 	}}
		// >
		<div>
			{isEditable ? (
				<div className={styles.menuContainer}>
					<Toolbar.Button onClick={actions.handleAdd}>
						<Icon name="Plus" />
					</Toolbar.Button>
					<Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
						<Popover.Trigger asChild>
							<Toolbar.Button>
								<Icon name="GripVertical" />
							</Toolbar.Button>
						</Popover.Trigger>
						<Popover.Content side="bottom" align="start" sideOffset={8}>
							<Surface className={styles.menuContent}>
								<Popover.Close>
									<DropdownButton onClick={actions.resetTextFormatting}>
										<Icon name="RemoveFormatting" />
										Clear formatting
									</DropdownButton>
								</Popover.Close>
								<Popover.Close>
									<DropdownButton onClick={actions.copyNodeToClipboard}>
										<Icon name="Clipboard" />
										Copy to clipboard
									</DropdownButton>
								</Popover.Close>
								<Popover.Close>
									<DropdownButton onClick={actions.duplicateNode}>
										<Icon name="Copy" />
										Duplicate
									</DropdownButton>
								</Popover.Close>
								<Toolbar.Divider horizontal />
								<Popover.Close>
									<DropdownButton
										onClick={actions.deleteNode}
										className={styles.deleteButton}
									>
										<Icon name="Trash2" />
										Delete
									</DropdownButton>
								</Popover.Close>
							</Surface>
						</Popover.Content>
					</Popover.Root>
				</div>
			) : null}
		</div>
		// </DragHandle>
	);
};
