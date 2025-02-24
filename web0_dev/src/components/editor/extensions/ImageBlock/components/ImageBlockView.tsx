import { Node } from '@tiptap/pm/model';
import { Editor, NodeViewWrapper } from '@tiptap/react';
import { useCallback, useRef } from 'react';
import styles from './ImageBlockView.module.scss';

interface ImageBlockViewProps {
	editor: Editor;
	getPos: () => number;
	node: Node;
	updateAttributes: (attrs: Record<string, string>) => void;
}

export const ImageBlockView = (props: ImageBlockViewProps) => {
	const { editor, getPos, node } = props as ImageBlockViewProps & {
		node: Node & {
			attrs: {
				src: string;
			};
		};
	};
	const imageWrapperRef = useRef<HTMLDivElement>(null);
	const { src } = node.attrs;

	const wrapperClassName = [
		styles.wrapper,
		node.attrs.align === 'left' && styles.alignLeft,
		node.attrs.align === 'right' && styles.alignRight,
		node.attrs.align === 'center' && styles.alignCenter,
	]
		.filter(Boolean)
		.join(' ');

	const onClick = useCallback(() => {
		editor.commands.setNodeSelection(getPos());
	}, [getPos, editor.commands]);

	return (
		<NodeViewWrapper>
			<div
				className={wrapperClassName}
				style={{ width: node.attrs.width }}
				data-drag-handle
			>
				<div contentEditable={false} ref={imageWrapperRef}>
					<img className={styles.image} src={src} alt="" onClick={onClick} />
				</div>
			</div>
		</NodeViewWrapper>
	);
};

export default ImageBlockView;
