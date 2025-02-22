declare module 'react-simple-wysiwyg' {
	import { ReactNode } from 'react';

	interface EditorProps {
		value: string;
		onChange: (e: { target: { value: string } }) => void;
		containerProps?: React.HTMLAttributes<HTMLDivElement>;
		placeholder?: string;
		buttons?: string[];
		className?: string;
		autoFocus?: boolean;
		disabled?: boolean;
	}

	interface ToolbarProps {
		className?: string;
		style?: React.CSSProperties;
	}

	export function Editor(props: EditorProps): JSX.Element;
	export function EditorProvider({
		children,
	}: {
		children: ReactNode;
	}): JSX.Element;
	export function Toolbar(props: ToolbarProps): JSX.Element;
	export function BtnBold(): JSX.Element;
	export function BtnItalic(): JSX.Element;
	export function BtnUnderline(): JSX.Element;
	export function BtnStrikeThrough(): JSX.Element;
	export function BtnLink(): JSX.Element;
	export function BtnCode(): JSX.Element;
	export function BtnQuote(): JSX.Element;
	export function BtnRedo(): JSX.Element;
	export function BtnUndo(): JSX.Element;
}
