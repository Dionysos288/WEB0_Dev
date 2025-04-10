import { DropdownButton } from '@/components/editor/components/Dropdown/Dropdown';
import { Icon } from '@/components/editor/components/Icon';
import { Surface } from '@/components/editor/components/Surface';
import { Toolbar } from '@/components/editor/components/Toolbar';
import { languages, tones } from '@/data/constantsEditor';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import type { Language } from '@/components/editor/extensions/Ai/AiFree';
import { useCallback } from 'react';
import styles from './AIDropdown.module.scss';

export type AIDropdownProps = {
	onSimplify: () => void;
	onFixSpelling: () => void;
	onMakeShorter: () => void;
	onMakeLonger: () => void;
	onEmojify: () => void;
	onTldr: () => void;
	onTranslate: (language: Language) => void;
	onTone: (tone: string) => void;
	onCompleteSentence: () => void;
};

export const AIDropdown = ({
	onCompleteSentence,
	onEmojify,
	onFixSpelling,
	onMakeLonger,
	onMakeShorter,
	onSimplify,
	onTldr,
	onTone,
	onTranslate,
}: AIDropdownProps) => {
	const handleTone = useCallback(
		(tone: string) => () => onTone(tone),
		[onTone]
	);
	const handleTranslate = useCallback(
		(language: Language) => () => onTranslate(language),
		[onTranslate]
	);

	return (
		<Dropdown.Root>
			<Dropdown.Trigger asChild>
				<Toolbar.Button className={`${styles.trigger} ${styles.purple}`}>
					<Icon name="Sparkles" className={styles.icon} />
					AI Tools
					<Icon
						name="ChevronDown"
						className={`${styles.icon} ${styles.small}`}
					/>
				</Toolbar.Button>
			</Dropdown.Trigger>
			<Dropdown.Content asChild>
				<Surface className="p-2 min-w-[10rem]">
					<Dropdown.Item onClick={onSimplify}>
						<DropdownButton>
							<Icon name="CircleSlash" />
							Simplify
						</DropdownButton>
					</Dropdown.Item>
					<Dropdown.Item onClick={onFixSpelling}>
						<DropdownButton>
							<Icon name="Eraser" />
							Fix spelling & grammar
						</DropdownButton>
					</Dropdown.Item>
					<Dropdown.Item onClick={onMakeShorter}>
						<DropdownButton>
							<Icon name="ArrowLeftToLine" />
							Make shorter
						</DropdownButton>
					</Dropdown.Item>
					<Dropdown.Item onClick={onMakeLonger}>
						<DropdownButton>
							<Icon name="ArrowRightToLine" />
							Make longer
						</DropdownButton>
					</Dropdown.Item>
					<Dropdown.Sub>
						<Dropdown.SubTrigger>
							<DropdownButton>
								<Icon name="Mic" />
								Change tone
								<Icon name="ChevronRight" className="w-4 h-4 ml-auto" />
							</DropdownButton>
						</Dropdown.SubTrigger>
						<Dropdown.SubContent>
							<Surface className="flex flex-col min-w-[15rem] p-2 max-h-[20rem] overflow-auto">
								{tones.map((tone) => (
									<Dropdown.Item
										onClick={handleTone(tone.value)}
										key={tone.value}
									>
										<DropdownButton>{tone.label}</DropdownButton>
									</Dropdown.Item>
								))}
							</Surface>
						</Dropdown.SubContent>
					</Dropdown.Sub>
					<Dropdown.Item onClick={onTldr}>
						<DropdownButton>
							<Icon name="Ellipsis" />
							Tl;dr:
						</DropdownButton>
					</Dropdown.Item>
					<Dropdown.Item onClick={onEmojify}>
						<DropdownButton>
							<Icon name="SmilePlus" />
							Emojify
						</DropdownButton>
					</Dropdown.Item>
					<Dropdown.Sub>
						<Dropdown.SubTrigger>
							<DropdownButton>
								<Icon name="Languages" />
								Translate
								<Icon name="ChevronRight" className="w-4 h-4 ml-auto" />
							</DropdownButton>
						</Dropdown.SubTrigger>
						<Dropdown.SubContent>
							<Surface className="flex flex-col min-w-[15rem] p-2 max-h-[20rem] overflow-auto">
								{languages.map((lang) => (
									<Dropdown.Item
										onClick={handleTranslate(lang.value)}
										key={lang.value}
									>
										<DropdownButton>{lang.label}</DropdownButton>
									</Dropdown.Item>
								))}
							</Surface>
						</Dropdown.SubContent>
					</Dropdown.Sub>
					<Dropdown.Item onClick={onCompleteSentence}>
						<DropdownButton>
							<Icon name="PenLine" />
							Complete sentence
						</DropdownButton>
					</Dropdown.Item>
				</Surface>
			</Dropdown.Content>
		</Dropdown.Root>
	);
};
