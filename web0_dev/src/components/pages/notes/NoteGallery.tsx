import { FolderType, NoteType } from '@/components/types/types';
import styles from './NoteGallery.module.scss';
import React from 'react';
import { Folder, PlusSpecial } from '@/svgs';
import Link from 'next/link';

const NoteGallery = ({
	notes,
	folders,
	inFolder = false,
}: {
	notes: NoteType[];
	folders: FolderType[];
	inFolder?: boolean;
}) => {
	function groupFoldersAndNotes(folders: FolderType[], notes: NoteType[]) {
		// 1) Group notes by folderId
		const grouped = notes.reduce((acc, note) => {
			const folderId = note.folderId ? note.folderId.toString() : 'no-folder';
			if (!acc[folderId]) {
				acc[folderId] = [];
			}
			acc[folderId].push(note);
			return acc;
		}, {} as { [key: string]: NoteType[] });

		// 2) Create the final array: folders first, then no-folder notes
		const result: Array<
			{ folder: FolderType; notes: NoteType[] } | { note: NoteType }
		> = [];

		// For each folder in use (meaning it appears in grouped)
		folders.forEach((folder) => {
			const folderId = folder.id.toString();
			if (grouped[folderId]) {
				// Push a single object with the folder and the notes
				result.push({
					folder,
					notes: grouped[folderId],
				});
				// Remove from the grouped object so we don't repeat it later
				delete grouped[folderId];
			}
		});

		// Finally, add each note without a folder as a separate item
		if (grouped['no-folder']) {
			grouped['no-folder'].forEach((note) => {
				result.push({ note });
			});
		}
		return result;
	}
	let groupedNotes;
	if (!inFolder) {
		groupedNotes = groupFoldersAndNotes(folders, notes);
	}
	const renderEmoji = (emoji: string) => {
		switch (emoji) {
			case 'Folder':
				return <Folder fill={'var(--main)'} />;
			case 'Money':
				return <Folder fill={'var(--main)'} />;
			default:
				return <Folder fill={'var(--main)'} />;
		}
	};
	return (
		<div className={styles.container}>
			<button className={styles.addNote}>
				<PlusSpecial fill={'var(--black)'} />
				<span>Add Item</span>
			</button>
			{inFolder
				? notes.map((item, index) => {
						return (
							<Link
								href={`/notes/${item.id}`}
								key={index}
								className={styles.folder}
								style={{
									backgroundColor:
										'folder' in item
											? 'var(--whiteSpecial)'
											: 'var(--lightBlue)',
									borderTopLeftRadius: 'folder' in item ? '0' : '16px',
								}}
							>
								<h3>{item.title}</h3>
								<p className={styles.content}>{item.content}</p>
								{item.emoji && (
									<div className={styles.emoji}>{renderEmoji(item.emoji)}</div>
								)}
							</Link>
						);
				  })
				: groupedNotes?.map((item, index) => {
						return (
							<Link
								href={
									'note' in item
										? `/notes/${item.note.id}`
										: `/notes/folder/${item.folder.id}`
								}
								key={index}
								className={styles.folder}
								style={{
									backgroundColor:
										'folder' in item
											? 'var(--whiteSpecial)'
											: 'var(--lightBlue)',
									borderTopLeftRadius: 'folder' in item ? '0' : '16px',
								}}
							>
								{'folder' in item && (
									<>
										<div className={styles.folderTop}></div>
										<h3>{item.folder.name}</h3>
										<p className={styles.length}>
											{item.notes.length} Item{item.notes.length > 1 ? 's' : ''}
										</p>
										{item.folder.emoji && (
											<div className={styles.emoji}>
												{renderEmoji(item.folder.emoji)}
											</div>
										)}{' '}
									</>
								)}
								{'note' in item && (
									<>
										<h3>{item.note.title}</h3>
										<p className={styles.content}>{item.note.content}</p>
										{item.note.emoji && (
											<div className={styles.emoji}>
												{renderEmoji(item.note.emoji)}
											</div>
										)}
									</>
								)}
							</Link>
						);
				  })}
		</div>
	);
};

export default NoteGallery;
