import { Editor } from '@tiptap/react';
import { Figcaption } from '@/components/editor/extensions/Figcaption/Figcaption';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { ImageBlock } from '@/components/editor/extensions/ImageBlock/ImageBlock';

import { ImageUpload } from '@/components/editor/extensions/ImageUpload/ImageUpload';
import { Link } from '@/components/editor/extensions/Link/Link';
import { CodeBlock } from '@/components/editor/extensions/CodeBlock/CodeBlock';

export const isTableGripSelected = (node: HTMLElement) => {
	let container = node;

	while (container && !['TD', 'TH'].includes(container.tagName)) {
		container = container.parentElement!;
	}

	const gripColumn =
		container &&
		container.querySelector &&
		container.querySelector('a.grip-column.selected');
	const gripRow =
		container &&
		container.querySelector &&
		container.querySelector('a.grip-row.selected');

	if (gripColumn || gripRow) {
		return true;
	}

	return false;
};

export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
	const customNodes = [
		HorizontalRule.name,
		ImageBlock.name,
		ImageUpload.name,
		CodeBlock.name,
		ImageBlock.name,
		Link.name,

		Figcaption.name,
	];

	return (
		customNodes.some((type) => editor.isActive(type)) ||
		isTableGripSelected(node)
	);
};

export default isCustomNodeSelected;
