import React, { useCallback, useEffect, useState, useRef, JSX } from 'react';
import styles from './TextFormatToolbar.module.scss';
import {
	BsTypeBold,
	BsTypeItalic,
	BsTypeUnderline,
	BsTypeStrikethrough,
	BsLink45Deg,
	BsCode,
	BsChevronDown,
	BsBoxArrowUpRight,
	BsLink,
	BsTrash,
	BsCheck,
	BsTextareaT,
	BsListUl,
	BsListOl,
	BsCheckSquare,
	BsImage,
	BsTable,
	BsQuote,
} from 'react-icons/bs';
import { LuHeading1, LuHeading2, LuHeading3 } from 'react-icons/lu';
import { RiDivideLine } from 'react-icons/ri';
import { FiGift } from 'react-icons/fi';

interface TextFormatToolbarProps {
	editorRef: React.RefObject<HTMLDivElement | null>;
}

interface LinkDialogProps {
	onSubmit: (url: string) => void;
	onCancel: () => void;
	position: { top: number; left: number };
}

interface LinkPopupProps {
	url: string;
	onOpen: () => void;
	onDelete: () => void;
	onEdit: (newUrl: string) => void;
	position: { top: number; left: number };
}

interface Command {
	id: string;
	label: string;
	icon: JSX.Element;
	shortcut?: string;
	action: () => void;
}

const COMMANDS: Command[] = [
	{
		id: 'heading1',
		label: 'Heading 1',
		icon: <LuHeading1 />,
		shortcut: 'Ctrl + 1',
		action: () => {
			const selection = window.getSelection();
			if (!selection) return;
			const range = selection.getRangeAt(0);
			const parentBlock = range.commonAncestorContainer.parentElement;
			if (
				parentBlock &&
				['h1', 'h2', 'h3'].includes(parentBlock.tagName.toLowerCase())
			) {
				document.execCommand('formatBlock', false, '<p>');
			}
			document.execCommand('formatBlock', false, '<h1>');
		},
	},
	{
		id: 'heading2',
		label: 'Heading 2',
		icon: <LuHeading2 />,
		shortcut: 'Ctrl + 2',
		action: () => {
			const selection = window.getSelection();
			if (!selection) return;
			const range = selection.getRangeAt(0);
			const parentBlock = range.commonAncestorContainer.parentElement;
			if (
				parentBlock &&
				['h1', 'h2', 'h3'].includes(parentBlock.tagName.toLowerCase())
			) {
				document.execCommand('formatBlock', false, '<p>');
			}
			document.execCommand('formatBlock', false, '<h2>');
		},
	},
	{
		id: 'heading3',
		label: 'Heading 3',
		icon: <LuHeading3 />,
		shortcut: 'Ctrl + 3',
		action: () => {
			const selection = window.getSelection();
			if (!selection) return;
			const range = selection.getRangeAt(0);
			const parentBlock = range.commonAncestorContainer.parentElement;
			if (
				parentBlock &&
				['h1', 'h2', 'h3'].includes(parentBlock.tagName.toLowerCase())
			) {
				document.execCommand('formatBlock', false, '<p>');
			}
			document.execCommand('formatBlock', false, '<h3>');
		},
	},
	{
		id: 'bulletedList',
		label: 'Bulleted list',
		icon: <BsListUl />,
		shortcut: 'Ctrl + 8',
		action: () => document.execCommand('insertUnorderedList', false),
	},
	{
		id: 'numberedList',
		label: 'Numbered list',
		icon: <BsListOl />,
		shortcut: 'Ctrl + 9',
		action: () => document.execCommand('insertOrderedList', false),
	},
	{
		id: 'checklist',
		label: 'Checklist',
		icon: <BsCheckSquare />,
		shortcut: 'Ctrl + 7',
		action: () => {
			/* Implement checklist logic */
		},
	},
	{
		id: 'codeBlock',
		label: 'Code block',
		icon: <BsCode />,
		shortcut: 'Ctrl + \\',
		action: () => {
			/* handleCodeBlock will be called */
		},
	},
	{
		id: 'divider',
		label: 'Divider',
		icon: <RiDivideLine />,
		shortcut: 'Ctrl + -',
		action: () => {
			/* Implement divider logic */
		},
	},
	{
		id: 'blockquote',
		label: 'Blockquote',
		icon: <BsQuote />,
		shortcut: 'Ctrl + .',
		action: () => document.execCommand('formatBlock', false, '<blockquote>'),
	},
	{
		id: 'table',
		label: 'Table',
		icon: <BsTable />,
		action: () => {
			/* Implement table logic */
		},
	},
	{
		id: 'media',
		label: 'Insert media...',
		icon: <BsImage />,
		action: () => {
			/* Implement media upload logic */
		},
	},
	{
		id: 'gif',
		label: 'Insert gif...',
		icon: <FiGift />,
		action: () => {
			/* Implement gif selection logic */
		},
	},
];

const LinkPopup = ({
	url,
	onOpen,
	onDelete,
	onEdit,
	position,
}: LinkPopupProps) => {
	const [editUrl, setEditUrl] = useState(url);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editUrl.trim()) {
			onEdit(editUrl);
		}
	};

	return (
		<div
			className={styles.linkPopup}
			style={{
				top: position.top + 'px',
				left: position.left + 'px',
			}}
		>
			<form onSubmit={handleSubmit}>
				<input
					ref={inputRef}
					type="url"
					value={editUrl}
					onChange={(e) => setEditUrl(e.target.value)}
					className={styles.linkInput}
				/>
				<div className={styles.linkActions}>
					<button onClick={onOpen} type="button" title="Open link">
						<BsBoxArrowUpRight />
					</button>
					<button onClick={onDelete} type="button" title="Remove link">
						<BsTrash />
					</button>
				</div>
			</form>
		</div>
	);
};

const LinkDialog = ({ onSubmit, onCancel, position }: LinkDialogProps) => {
	const [url, setUrl] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (url.trim()) {
			onSubmit(url);
		}
	};

	return (
		<div
			className={styles.linkPopup}
			style={{
				top: position.top + 'px',
				left: position.left + 'px',
			}}
		>
			<form onSubmit={handleSubmit}>
				<input
					ref={inputRef}
					type="url"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="Enter link URL"
					className={styles.linkInput}
				/>
				<div className={styles.linkActions}>
					<button type="submit" disabled={!url.trim()} title="Add link">
						<BsLink />
					</button>
					<button type="button" onClick={onCancel} title="Cancel">
						<BsTrash />
					</button>
				</div>
			</form>
		</div>
	);
};

const LANGUAGES = [
	'Plain text',
	'JavaScript',
	'TypeScript',
	'HTML',
	'CSS',
	'Python',
	'Java',
	'C++',
	'C#',
	'Ruby',
	'PHP',
	'Swift',
	'Go',
	'Rust',
	'Kotlin',
	'SQL',
];

export default function TextFormatToolbar({
	editorRef,
}: TextFormatToolbarProps) {
	const [showToolbar, setShowToolbar] = useState(false);
	const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
	const [activeFormats, setActiveFormats] = useState<string[]>([]);
	const [showHeadingMenu, setShowHeadingMenu] = useState(false);
	const [showLinkDialog, setShowLinkDialog] = useState(false);
	const [showLinkPopup, setShowLinkPopup] = useState(false);
	const [currentLink, setCurrentLink] = useState<{
		url: string;
		element: HTMLAnchorElement;
	} | null>(null);
	const [currentHeading, setCurrentHeading] = useState('p');
	const savedSelection = useRef<Range | null>(null);
	const [showCommands, setShowCommands] = useState(false);
	const [commandFilter, setCommandFilter] = useState('');
	const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
	const [commandPosition, setCommandPosition] = useState({ top: 0, left: 0 });
	const lastCaretPosition = useRef<Range | null>(null);

	useEffect(() => {
		const handleLinkClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const link = target.closest('a');
			if (link && editorRef.current?.contains(link)) {
				e.preventDefault();
				const rect = link.getBoundingClientRect();
				setToolbarPosition({
					top: rect.top - 40,
					left: rect.left + rect.width / 2,
				});
				setCurrentLink({ url: link.href, element: link as HTMLAnchorElement });
				setShowLinkPopup(true);
			} else {
				setShowLinkPopup(false);
				setCurrentLink(null);
			}
		};

		document.addEventListener('click', handleLinkClick);
		return () => document.removeEventListener('click', handleLinkClick);
	}, [editorRef]);

	const handleSelectionChange = useCallback(() => {
		const selection = window.getSelection();
		if (!selection || !editorRef.current) {
			setShowToolbar(false);
			return;
		}

		if (!selection.isCollapsed) {
			const range = selection.getRangeAt(0);

			// Check if selection is inside a code block
			const isInCodeBlock =
				range.commonAncestorContainer.parentElement?.closest('pre');
			if (isInCodeBlock) {
				setShowToolbar(false);
				return;
			}

			savedSelection.current = range.cloneRange();
			const rect = range.getBoundingClientRect();
			setToolbarPosition({
				top: rect.top - 50,
				left: rect.left + rect.width / 2,
			});
			setShowToolbar(true);

			// Check which formats are active
			const formats = ['bold', 'italic', 'underline', 'strikethrough'];
			const active = formats.filter((format) =>
				document.queryCommandState(format)
			);
			setActiveFormats(active);

			// Check current block format
			const parentBlock = range.commonAncestorContainer.parentElement;
			if (parentBlock) {
				const blockTag = parentBlock.tagName.toLowerCase();
				if (['h1', 'h2', 'h3', 'p'].includes(blockTag)) {
					setCurrentHeading(blockTag);
				}
			}
		} else {
			setShowToolbar(false);
			setShowHeadingMenu(false);
		}
	}, [editorRef]);

	useEffect(() => {
		document.addEventListener('selectionchange', handleSelectionChange);
		return () => {
			document.removeEventListener('selectionchange', handleSelectionChange);
		};
	}, [handleSelectionChange]);

	const handleFormat = (command: string, value?: string) => {
		const selection = window.getSelection();
		if (!selection || !savedSelection.current) return;

		// Restore the saved selection
		selection.removeAllRanges();
		selection.addRange(savedSelection.current);

		if (command === 'formatBlock') {
			// Remove any existing heading tags first
			const parentBlock =
				savedSelection.current.commonAncestorContainer.parentElement;
			if (
				parentBlock &&
				['h1', 'h2', 'h3'].includes(parentBlock.tagName.toLowerCase())
			) {
				document.execCommand('formatBlock', false, '<p>');
			}
			// Then apply the new heading if it's not 'p'
			if (value !== '<p>') {
				document.execCommand(command, false, value);
			}
			setCurrentHeading(value?.replace(/[<>]/g, '') || 'p');
		} else {
			document.execCommand(command, false);
		}

		const formats = ['bold', 'italic', 'underline', 'strikethrough'];
		const active = formats.filter((format) =>
			document.queryCommandState(format)
		);
		setActiveFormats(active);
		setShowHeadingMenu(false);
	};

	const handleLink = () => {
		const selection = window.getSelection();
		if (!selection) return;

		savedSelection.current = selection.getRangeAt(0).cloneRange();
		setShowLinkDialog(true);
		setShowToolbar(false);
	};

	const handleLinkSubmit = (url: string) => {
		const selection = window.getSelection();
		if (!selection || !savedSelection.current) return;

		// Restore the saved selection
		selection.removeAllRanges();
		selection.addRange(savedSelection.current);

		// Format the URL
		let formattedUrl = url.trim();
		if (
			!formattedUrl.startsWith('http://') &&
			!formattedUrl.startsWith('https://')
		) {
			formattedUrl = `https://${formattedUrl}`;
		}

		// Apply the link
		document.execCommand('createLink', false, formattedUrl);

		// Get the newly created link and set its attributes
		const range = selection.getRangeAt(0);
		const link = range.commonAncestorContainer
			.parentElement as HTMLAnchorElement;
		if (link && link.tagName === 'A') {
			link.href = formattedUrl;
			link.style.color = '#0066cc';
		}

		setShowLinkDialog(false);
		setShowToolbar(false);
		savedSelection.current = null;
	};

	const handleLinkOpen = () => {
		if (currentLink) {
			window.open(currentLink.url, '_blank', 'noopener,noreferrer');
			setShowLinkPopup(false);
		}
	};

	const handleLinkEdit = (newUrl: string) => {
		if (currentLink) {
			let formattedUrl = newUrl.trim();
			if (
				!formattedUrl.startsWith('http://') &&
				!formattedUrl.startsWith('https://')
			) {
				formattedUrl = `https://${formattedUrl}`;
			}
			currentLink.element.href = formattedUrl;
			setShowLinkPopup(false);
			setCurrentLink(null);
		}
	};

	const handleLinkDelete = () => {
		if (currentLink) {
			const text = currentLink.element.textContent;
			const textNode = document.createTextNode(text || '');
			currentLink.element.parentNode?.replaceChild(
				textNode,
				currentLink.element
			);
			setShowLinkPopup(false);
		}
	};

	const handleCodeBlock = () => {
		const selection = window.getSelection();
		if (!selection || !savedSelection.current) return;

		// Restore the saved selection
		selection.removeAllRanges();
		selection.addRange(savedSelection.current);

		const range = selection.getRangeAt(0);
		const content = range.toString().trim();

		// Create paragraph elements for spacing
		const beforeP = document.createElement('p');
		beforeP.innerHTML = '<br>';
		const afterP = document.createElement('p');
		afterP.innerHTML = '<br>';

		// Create code block
		const pre = document.createElement('pre');
		const code = document.createElement('code');
		code.contentEditable = 'true';

		// Add language selector and copy button container
		const header = document.createElement('div');
		header.className = styles.codeHeader;
		header.contentEditable = 'false';

		const languageSelect = document.createElement('select');
		languageSelect.className = styles.languageSelect;
		languageSelect.contentEditable = 'false';
		LANGUAGES.forEach((lang) => {
			const option = document.createElement('option');
			option.value = lang.toLowerCase();
			option.textContent = lang;
			languageSelect.appendChild(option);
		});

		const copyButton = document.createElement('button');
		copyButton.className = styles.copyButton;
		copyButton.contentEditable = 'false';
		copyButton.innerHTML =
			'<svg viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" d="M4 2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm0-1h5a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3zm4.5-1H8V0h1.5v1.5z"/></svg>';
		copyButton.title = 'Copy code';

		copyButton.onclick = () => {
			navigator.clipboard.writeText(code.textContent || '');
			copyButton.innerHTML =
				'<svg viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/></svg>';
			setTimeout(() => {
				copyButton.innerHTML =
					'<svg viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" d="M4 2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm0-1h5a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3zm4.5-1H8V0h1.5v1.5z"/></svg>';
			}, 2000);
		};

		header.appendChild(languageSelect);
		header.appendChild(copyButton);

		// Detect language
		const detectLanguage = (code: string): string => {
			if (!code.trim()) return 'plain text';

			const patterns = {
				javascript:
					/\b(function|const|let|var|return|if|else|for|while|console|=>)\b|import\s+.*\s+from\s+['"][^'"]+['"]|export\s+/,
				typescript:
					/\b(interface|type|enum|implements|declare|namespace|public|private|protected)\b|:\s*[A-Za-z<>[\]]+/,
				html: /<\/?[a-z][\s\S]*>|class=["'][^"']*["']|<[^>]+>/i,
				css: /[{}\s\w\-:]+([\s]*{[\s]*[^}]*})|,media|@keyframes|@import/,
				python:
					/\b(def|class|import|from|if|elif|else|for|while|try|except|self)\b|:\s*$/,
				java: /\b(public|private|protected|class|interface|extends|implements|void|String)\b/,
				cpp: /\b(include|namespace|class|template|public|private|protected|std::)\b/,
				csharp:
					/\b(using|namespace|class|public|private|protected|void|string)\b/,
				php: /(<\?php|\$\w+|function|class|public|private|protected)\b/,
				sql: /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|GROUP BY|ORDER BY)\b/i,
				jsx: /\b(React|Component|render|props|state)\b|<[A-Z][^>]*>|<\/[A-Z][^>]*>/,
				tsx: /\b(React|Component|render|props|state|interface)\b|<[A-Z][^>]*>|<\/[A-Z][^>]*>/,
			};

			for (const [lang, pattern] of Object.entries(patterns)) {
				if (pattern.test(code)) {
					return lang;
				}
			}
			return 'plain text';
		};

		// Apply syntax highlighting
		const applyHighlighting = (codeElement: HTMLElement, lang: string) => {
			const content = codeElement.textContent || '';
			if (lang === 'plain text') {
				codeElement.textContent = content;
				return;
			}

			const highlightedContent = document.createElement('div');
			highlightedContent.className = styles.highlightContainer;

			let tokens;
			const commonPatterns = {
				keywords:
					/\b(function|const|let|var|return|if|else|for|while|do|switch|case|break|continue|class|extends|new|try|catch|throw|finally|import|export|default|from|async|await|public|private|protected|interface|implements|package|this|super)\b/g,
				functions: /\b[a-zA-Z_]\w*(?=\s*\()/g,
				strings: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g,
				comments: /\/\/.*$|\/\*[\s\S]*?\*\//gm,
				numbers: /\b\d+(\.\d+)?\b/g,
				operators: /[+\-*/%=<>!&|^~?:]+/g,
				punctuation: /[{}[\]();,.]/g,
				decorators: /@[a-zA-Z_]\w*/g,
				regex: /\/(?:[^/\\]|\\.)*\/[gimuy]*/g,
				jsx: {
					tags: /<\/?[a-zA-Z][\w-]*|\/>/g,
					attributes: /\b[a-zA-Z][\w-]*(?==)/g,
					strings: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,
				},
			};

			let html = content;

			// Replace tokens with spans
			const replace = (pattern: RegExp, className: string) => {
				html = html.replace(
					pattern,
					(match) => `<span class="${className}">${match}</span>`
				);
			};

			// Handle comments first to avoid highlighting within comments
			replace(commonPatterns.comments, 'comment');

			// Handle strings next to avoid highlighting within strings
			replace(commonPatterns.strings, 'string');

			// Handle regex
			replace(commonPatterns.regex, 'regex');

			// Handle decorators
			replace(commonPatterns.decorators, 'decorator');

			// Handle keywords
			replace(commonPatterns.keywords, 'keyword');

			// Handle functions
			replace(commonPatterns.functions, 'function');

			// Handle numbers
			replace(commonPatterns.numbers, 'number');

			// Handle operators
			replace(commonPatterns.operators, 'operator');

			// Handle punctuation
			replace(commonPatterns.punctuation, 'punctuation');

			// Special handling for JSX/TSX
			if (lang === 'jsx' || lang === 'tsx') {
				replace(commonPatterns.jsx.tags, 'jsx-tag');
				replace(commonPatterns.jsx.attributes, 'jsx-attribute');
				replace(commonPatterns.jsx.strings, 'string');
			}

			highlightedContent.innerHTML = html;
			codeElement.innerHTML = '';
			codeElement.appendChild(highlightedContent);
		};

		// Handle line breaks in code content
		code.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				const selection = window.getSelection();
				if (selection) {
					const range = selection.getRangeAt(0);
					const textNode = document.createTextNode('\n');
					range.insertNode(textNode);
					range.setStartAfter(textNode);
					range.setEndAfter(textNode);
					selection.removeAllRanges();
					selection.addRange(range);

					// Reapply syntax highlighting
					const lang = languageSelect.value;
					applyHighlighting(code, lang);
				}
			}
		});

		// Set content and classes
		code.className = styles.codeContent;
		pre.className = styles.codeBlock;

		// Detect and set initial language
		const detectedLang = detectLanguage(content);
		languageSelect.value = detectedLang;
		code.dataset.language = detectedLang;

		// Set initial content or placeholder
		if (content) {
			code.textContent = content;
			applyHighlighting(code, detectedLang);
		} else {
			code.textContent = ' '; // Add a space to maintain minimum height
		}

		// Update the language change handler
		languageSelect.onchange = (e) => {
			const target = e.target as HTMLSelectElement;
			const lang = target.value;
			code.dataset.language = lang;
			applyHighlighting(code, lang);
		};

		// Input handler for live syntax highlighting
		code.addEventListener('input', () => {
			const lang = languageSelect.value;
			applyHighlighting(code, lang);
		});

		// Assemble the code block
		pre.appendChild(header);
		pre.appendChild(code);

		// Insert the elements with spacing
		range.deleteContents();
		range.insertNode(beforeP);
		range.insertNode(pre);
		range.insertNode(afterP);

		// Set cursor after the code block
		const newRange = document.createRange();
		newRange.setStartAfter(afterP);
		newRange.collapse(true);
		selection.removeAllRanges();
		selection.addRange(newRange);

		setShowToolbar(false);
		savedSelection.current = null;
	};

	useEffect(() => {
		// Find the editor's contenteditable element
		const editorElement = editorRef.current?.querySelector(
			'.rsw-ce'
		) as HTMLElement;
		if (!editorElement) return;

		const handleKeyDown = (e: Event) => {
			const keyEvent = e as KeyboardEvent;
			if (!showCommands) {
				// Handle both direct "/" and "Shift + /" (which gives "/" on many keyboards)
				if (
					(keyEvent.key === '/' ||
						(keyEvent.key === '?' && keyEvent.shiftKey)) &&
					!keyEvent.ctrlKey &&
					!keyEvent.altKey &&
					!keyEvent.metaKey
				) {
					console.log('Slash key pressed in editor'); // Debug log
					const selection = window.getSelection();
					if (selection && selection.rangeCount > 0) {
						const range = selection.getRangeAt(0);
						const rect = range.getBoundingClientRect();
						setCommandPosition({
							top: rect.bottom + window.scrollY + 10,
							left: rect.left + window.scrollX,
						});
						lastCaretPosition.current = range.cloneRange();
						setShowCommands(true);
						setCommandFilter('');
						setSelectedCommandIndex(0);
						keyEvent.preventDefault();
					}
				}
			} else {
				if (keyEvent.key === 'Escape') {
					keyEvent.preventDefault();
					setShowCommands(false);
				} else if (keyEvent.key === 'ArrowUp') {
					keyEvent.preventDefault();
					setSelectedCommandIndex((prev) =>
						prev > 0 ? prev - 1 : COMMANDS.length - 1
					);
				} else if (keyEvent.key === 'ArrowDown') {
					keyEvent.preventDefault();
					setSelectedCommandIndex((prev) =>
						prev < COMMANDS.length - 1 ? prev + 1 : 0
					);
				} else if (keyEvent.key === 'Enter') {
					keyEvent.preventDefault();
					if (COMMANDS[selectedCommandIndex]) {
						executeCommand(COMMANDS[selectedCommandIndex]);
					}
				} else if (keyEvent.key === 'Tab') {
					keyEvent.preventDefault();
					setSelectedCommandIndex((prev) =>
						prev < COMMANDS.length - 1 ? prev + 1 : 0
					);
				} else if (keyEvent.key === 'Backspace' && commandFilter === '') {
					setShowCommands(false);
				} else if (keyEvent.key.length === 1 || keyEvent.key === 'Backspace') {
					// Handle typing and backspace for filtering
					if (keyEvent.key === 'Backspace') {
						setCommandFilter((prev) => prev.slice(0, -1));
					} else {
						setCommandFilter((prev) => prev + keyEvent.key);
					}
					setSelectedCommandIndex(0);
				}
			}
		};

		editorElement.addEventListener('keydown', handleKeyDown);
		return () => editorElement.removeEventListener('keydown', handleKeyDown);
	}, [showCommands, selectedCommandIndex, commandFilter, COMMANDS, editorRef]);

	// Remove the old document-level keydown listener
	useEffect(() => {
		document.removeEventListener('keydown', () => {});
	}, []);

	const filteredCommands = COMMANDS.filter((command) =>
		command.label.toLowerCase().includes(commandFilter.toLowerCase())
	);

	const executeCommand = (command: Command) => {
		setShowCommands(false);
		if (lastCaretPosition.current) {
			const selection = window.getSelection();
			if (selection) {
				selection.removeAllRanges();
				selection.addRange(lastCaretPosition.current);

				// Remove the slash character
				document.execCommand('delete', false);

				// If we're at the start of a line after Enter, move cursor to the new line
				const range = selection.getRangeAt(0);
				const node = range.startContainer;
				const offset = range.startOffset;

				if (
					node.nodeType === Node.TEXT_NODE &&
					offset === 1 &&
					node.textContent?.charAt(0) === '/'
				) {
					// We're right after a slash, remove it
					document.execCommand('delete', false);
				}

				// Execute the command
				if (command.id === 'codeBlock') {
					handleCodeBlock();
				} else {
					command.action();
				}

				// Update toolbar state based on the command
				const formats = ['bold', 'italic', 'underline', 'strikethrough'];
				const active = formats.filter((format) =>
					document.queryCommandState(format)
				);
				setActiveFormats(active);

				// Update heading state
				const parentBlock =
					selection.getRangeAt(0).commonAncestorContainer.parentElement;
				if (parentBlock) {
					const blockTag = parentBlock.tagName.toLowerCase();
					if (['h1', 'h2', 'h3', 'p'].includes(blockTag)) {
						setCurrentHeading(blockTag);
					}
				}
			}
		}
	};

	const headingOptions = [
		{
			tag: 'p',
			label: 'Normal text',
			icon: <BsTextareaT />,
			toolbarIcon: <BsTextareaT />,
		},
		{
			tag: 'h1',
			label: 'Header 1',
			icon: <LuHeading1 />,
			toolbarIcon: <LuHeading1 />,
		},
		{
			tag: 'h2',
			label: 'Header 2',
			icon: <LuHeading2 />,
			toolbarIcon: <LuHeading2 />,
		},
		{
			tag: 'h3',
			label: 'Header 3',
			icon: <LuHeading3 />,
			toolbarIcon: <LuHeading3 />,
		},
	];

	return (
		<>
			{showCommands && (
				<div
					className={styles.commandMenu}
					style={{
						top: commandPosition.top + 'px',
						left: commandPosition.left + 'px',
					}}
				>
					<div className={styles.commandList}>
						{filteredCommands.map((command, index) => (
							<button
								key={command.id}
								className={`${styles.commandItem} ${
									index === selectedCommandIndex ? styles.selected : ''
								}`}
								onClick={() => executeCommand(command)}
								onMouseEnter={() => setSelectedCommandIndex(index)}
							>
								<div className={styles.commandIcon}>{command.icon}</div>
								<div className={styles.commandLabel}>
									<span>{command.label}</span>
									{command.shortcut && (
										<span className={styles.shortcut}>{command.shortcut}</span>
									)}
								</div>
							</button>
						))}
					</div>
				</div>
			)}

			{showLinkPopup && currentLink && (
				<LinkPopup
					url={currentLink.url}
					onOpen={handleLinkOpen}
					onDelete={handleLinkDelete}
					onEdit={handleLinkEdit}
					position={toolbarPosition}
				/>
			)}

			{showLinkDialog && (
				<LinkDialog
					onSubmit={handleLinkSubmit}
					onCancel={() => {
						setShowLinkDialog(false);
						setShowToolbar(true);
					}}
					position={toolbarPosition}
				/>
			)}

			{showToolbar && (
				<div
					className={styles.toolbar}
					style={{
						top: toolbarPosition.top + 'px',
						left: toolbarPosition.left + 'px',
					}}
				>
					<div className={styles.group}>
						<button
							className={`${styles.button} ${
								activeFormats.includes('bold') ? styles.active : ''
							}`}
							onClick={() => handleFormat('bold')}
							title="Bold"
						>
							<BsTypeBold />
						</button>
						<button
							className={`${styles.button} ${
								activeFormats.includes('italic') ? styles.active : ''
							}`}
							onClick={() => handleFormat('italic')}
							title="Italic"
						>
							<BsTypeItalic />
						</button>
						<button
							className={`${styles.button} ${
								activeFormats.includes('underline') ? styles.active : ''
							}`}
							onClick={() => handleFormat('underline')}
							title="Underline"
						>
							<BsTypeUnderline />
						</button>
						<button
							className={`${styles.button} ${
								activeFormats.includes('strikethrough') ? styles.active : ''
							}`}
							onClick={() => handleFormat('strikethrough')}
							title="Strikethrough"
						>
							<BsTypeStrikethrough />
						</button>
					</div>

					<div className={styles.divider} />

					<div className={styles.group}>
						<button className={styles.button} onClick={handleLink} title="Link">
							<BsLink45Deg />
						</button>
						<div className={styles.headingDropdown}>
							<button
								className={`${styles.button} ${styles.headingButton}`}
								onClick={() => setShowHeadingMenu(!showHeadingMenu)}
								title="Text style"
							>
								{headingOptions.find((h) => h.tag === currentHeading)
									?.toolbarIcon || 'Text'}
								<BsChevronDown />
							</button>
							{showHeadingMenu && (
								<div className={styles.headingMenu}>
									{headingOptions.map((option) => (
										<button
											key={option.tag}
											className={`${styles.headingOption} ${
												currentHeading === option.tag ? styles.active : ''
											}`}
											onClick={() =>
												handleFormat('formatBlock', `<${option.tag}>`)
											}
										>
											<div className={styles.headingLabel}>
												{option.icon}
												<span>{option.label}</span>
											</div>
											{currentHeading === option.tag && (
												<BsCheck className={styles.checkmark} />
											)}
										</button>
									))}
								</div>
							)}
						</div>
						<button
							className={styles.button}
							onClick={handleCodeBlock}
							title="Code Block"
						>
							<BsCode />
						</button>
					</div>
				</div>
			)}
		</>
	);
}
