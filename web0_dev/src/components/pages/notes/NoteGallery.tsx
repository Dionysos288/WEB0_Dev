import styles from './NoteGallery.module.scss';
import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { Folder as folderType, Note as noteType } from '@prisma/client';
import PlusFilled from '@/svgs/Plus-Filled';
import Folder from '@/svgs/Folder';

const NoteGallery = async ({
	notesData,
	foldersData,
	inFolder = false,
}: {
	notesData?: noteType[];
	foldersData?: folderType & { notes: noteType[] };
	inFolder?: boolean;
}) => {
	let folders;
	let notes;
	if (foldersData === undefined || notesData === undefined) {
		folders = await prisma.folder.findMany();
		notes = await prisma.note.findMany();
	} else {
		folders = foldersData;
		notes = notesData;
	}
	function groupFoldersAndNotes(folders: folderType[], notes: noteType[]) {
		const grouped = notes.reduce((acc, note) => {
			const folderId = note.folderId ? note.folderId.toString() : 'no-folder';
			if (!acc[folderId]) {
				acc[folderId] = [];
			}
			acc[folderId].push(note);
			return acc;
		}, {} as { [key: string]: noteType[] });

		const result: Array<
			{ folder: folderType; notes: noteType[] } | { note: noteType }
		> = [];

		folders.forEach((folder) => {
			const folderId = folder.id.toString();
			if (grouped[folderId]) {
				result.push({
					folder,
					notes: grouped[folderId],
				});
				delete grouped[folderId];
			}
		});

		if (grouped['no-folder']) {
			grouped['no-folder'].forEach((note) => {
				result.push({ note });
			});
		}
		return result;
	}
	let groupedNotes;
	if (!inFolder) {
		// @ts-expect-error maybe fix this later
		groupedNotes = groupFoldersAndNotes(folders, notes);
	}
	const renderEmoji = (emoji: string) => {
		switch (emoji) {
			case 'Folder':
				return <Folder fill={'var(--main)'} width="22" height="22" />;
			case 'Money':
				return <Folder fill={'var(--main)'} width="22" height="22" />;
			default:
				return <Folder fill={'var(--main)'} width="22" height="22" />;
		}
	};
	return (
		<div className={styles.container}>
			<button className={styles.addNote}>
				<PlusFilled fill={'var(--main-80)'} width="16" height="16" />
				<span>Add Item</span>
			</button>
			{inFolder
				? notes?.map((item, index) => {
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
								<div className={styles.emoji}>{renderEmoji(item.emoji)}</div>
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
										<h3 className={styles.folderTitle}>{item.folder.name}</h3>
										<p className={styles.length}>
											{item.notes.length} Item{item.notes.length > 1 ? 's' : ''}
										</p>
										<div className={styles.emoji}>
											{renderEmoji(item.folder.emoji)}
										</div>
									</>
								)}
								{'note' in item && (
									<>
										<h3>{item.note.title}</h3>
										<p className={styles.content}>{item.note.content}</p>
										<div className={styles.emoji}>
											{renderEmoji(item.note.emoji)}
										</div>
									</>
								)}
							</Link>
						);
				  })}
		</div>
	);
};

export default NoteGallery;
