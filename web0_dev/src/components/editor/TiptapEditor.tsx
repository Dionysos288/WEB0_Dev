'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Typography from '@tiptap/extension-typography';
import Focus from '@tiptap/extension-focus';
import Dropcursor from '@tiptap/extension-dropcursor';
import { useEffect, useRef } from 'react';
import { Document } from '@tiptap/extension-document';
import Table from '@tiptap/extension-table';

import { TableHeader } from './extensions/Table/Header';
import { BlockquoteFigure } from './extensions/BlockquoteFigure/BlockquoteFigure';
import TableRow from '@tiptap/extension-table-row';
import { TableCell } from './extensions/Table/Cell';
import { SlashCommand } from './extensions/SlashCommand/SlashCommand';
import { Figcaption } from './extensions/Figcaption/Figcaption';
import { ImageBlock } from './extensions/ImageBlock/ImageBlock';
import { ImageUpload } from './extensions/ImageUpload/ImageUpload';
import { TrailingNode } from './extensions/TrailingNode/trailing-node';
import { CodeBlock } from './extensions/CodeBlock/CodeBlock';
import { FontSize } from './extensions/FontSize/FontSize';
import { Columns } from './extensions/MultiColumn/Columns';
import { Heading } from './extensions/Heading/Heading';
import { Column } from './extensions/MultiColumn/Column';
import { HorizontalRule } from './extensions/HorizontalRule/HorizontalRule';
import { TableColumnMenu } from './extensions/Table/menus/TableColumn';
import { ImageBlockMenu } from './extensions/ImageBlock/components/ImageBlockMenu';
import TableRowMenu from './extensions/Table/menus/TableRow';
import ColumnsMenu from './extensions/MultiColumn/menus/ColumnsMenu';
import Selection from './extensions/Selection/Selection';
import { TextMenu } from './menus/TextMenu/TextMenu';
import { ContentItemMenu } from './menus/ContentItemMenu/ContentItemMenu';
import LinkMenu from './menus/LinkMenu/LinkMenu';

interface TiptapEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
	const menuContainerRef = useRef(null);

	const editor = useEditor({
		extensions: [
			Document,
			Selection,
			Columns,
			TaskList,
			TaskItem.configure({
				nested: true,
			}),
			Column,
			Heading.configure({
				levels: [1, 2, 3, 4, 5, 6],
			}),
			HorizontalRule,

			StarterKit.configure({
				document: false,
				dropcursor: false,
				heading: false,
				horizontalRule: false,
				blockquote: false,
				history: false,
				codeBlock: false,
			}),

			CodeBlock,
			TextStyle,
			FontSize,
			FontFamily,
			Color,
			TrailingNode,
			Link.configure({
				openOnClick: false,
			}),
			Highlight.configure({ multicolor: true }),
			Underline,
			CharacterCount.configure({ limit: 50000 }),
			ImageUpload.configure({
				clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
			}),
			ImageBlock,

			TextAlign.extend({
				addKeyboardShortcuts() {
					return {};
				},
			}).configure({
				types: ['heading', 'paragraph'],
			}),
			Subscript,
			Superscript,
			Table,
			TableCell,
			TableHeader,
			TableRow,
			Typography,
			Placeholder.configure({
				includeChildren: true,
				showOnlyCurrent: false,
				placeholder: () => '',
			}),
			SlashCommand,
			Focus,
			Figcaption,
			BlockquoteFigure,
			Dropcursor.configure({
				width: 2,
				class: 'ProseMirror-dropcursor border-black',
			}),
		],
		content,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	useEffect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content);
		}
	}, [content, editor]);

	if (!editor) {
		return null;
	}

	return (
		<div style={{}}>
			<EditorContent
				editor={editor}
				style={{
					flex: 1,
					overflowY: 'auto',
				}}
			/>
			<ContentItemMenu editor={editor} isEditable={true} />
			<LinkMenu editor={editor} appendTo={menuContainerRef} />
			<TextMenu editor={editor} />
			<ColumnsMenu editor={editor} appendTo={menuContainerRef} />
			<TableRowMenu editor={editor} appendTo={menuContainerRef} />
			<TableColumnMenu editor={editor} appendTo={menuContainerRef} />
			<ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
		</div>
	);
};

export default TiptapEditor;
