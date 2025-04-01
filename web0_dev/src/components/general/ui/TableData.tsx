'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './TableData.module.scss';
import { fileType, TableHeader, TeamData } from '@/components/types/types';
import {
	getFileType,
	getImagePerson,
	getTypePerson,
} from '@/utils/GetAddOnsTable';
import { Client } from '@prisma/client';
import GetFileSize from '@/utils/GetFileSize';
import Dots from '@/svgs/Dots';
import { getTimeAgo } from '@/utils/DateHooks';
import Toolbar from '../Toolbar/Toolbar';
import ArrowUp from '@/svgs/ArrowUp';
import ArrowDown from '@/svgs/ArrowDown';
import Download from '@/svgs/Download';
import Trash from '@/svgs/Trash';
import { bulkDeleteFiles } from '@/actions/FileActions';
import { downloadFile, downloadFilesAsZip } from '@/utils/fileUtils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type CSSPropertiesWithVars = React.CSSProperties & {
	'--amount'?: string | number;
};

interface TableDataProps {
	type: string;
	tableData: fileType[] | Client[] | TeamData[];
	tableHeaders: TableHeader[];
	isCheckboxes?: boolean;
}

const TableData: React.FC<TableDataProps> = ({
	type,
	tableData,
	tableHeaders,
	isCheckboxes = true,
}) => {
	const [data, setData] = useState<(fileType | Client)[]>(tableData);
	const [selected, setSelected] = useState<string[]>([]);
	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: 'ascending' | 'descending' | null;
	}>({ key: '', direction: null });
	const [hoveredHeader, setHoveredHeader] = useState<string | null>(null);
	const [contextMenu, setContextMenu] = useState<{
		visible: boolean;
		x: number;
		y: number;
		itemId: string;
	} | null>(null);
	const router = useRouter();
	const lastSelectedRef = useRef<string | null>(null);

	// Update data when tableData changes
	useEffect(() => {
		setData(tableData);
	}, [tableData]);

	// Sort function
	const requestSort = (key: string) => {
		let direction: 'ascending' | 'descending' | null = 'ascending';

		if (sortConfig.key === key) {
			if (sortConfig.direction === 'ascending') {
				direction = 'descending';
			} else if (sortConfig.direction === 'descending') {
				direction = null;
			}
		}

		setSortConfig({ key, direction });

		if (direction === null) {
			// Reset to original order
			setData([...tableData]);
			return;
		}

		const sortedData = [...data].sort((a, b) => {
			const aValue = a[key as keyof typeof a];
			const bValue = b[key as keyof typeof b];

			if (aValue === null || aValue === undefined) return 1;
			if (bValue === null || bValue === undefined) return -1;

			if (aValue instanceof Date && bValue instanceof Date) {
				return direction === 'ascending'
					? aValue.getTime() - bValue.getTime()
					: bValue.getTime() - aValue.getTime();
			}

			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return direction === 'ascending' ? aValue - bValue : bValue - aValue;
			}

			// String comparison
			const aString = String(aValue).toLowerCase();
			const bString = String(bValue).toLowerCase();

			return direction === 'ascending'
				? aString.localeCompare(bString)
				: bString.localeCompare(aString);
		});

		setData(sortedData);
	};

	// Handle selection
	const handleSelect = (id: string, event: React.MouseEvent) => {
		event.stopPropagation();

		// Handle Ctrl+Click (multi-select non-contiguous)
		if (event.ctrlKey) {
			setSelected((prev) =>
				prev.includes(id)
					? prev.filter((itemId) => itemId !== id)
					: [...prev, id]
			);
			lastSelectedRef.current = id;
			return;
		}

		// Handle Shift+Click (range select)
		if (event.shiftKey && lastSelectedRef.current) {
			const currentIndex = data.findIndex((item) => item.id === id);
			const lastIndex = data.findIndex(
				(item) => item.id === lastSelectedRef.current
			);

			if (currentIndex >= 0 && lastIndex >= 0) {
				const start = Math.min(currentIndex, lastIndex);
				const end = Math.max(currentIndex, lastIndex);

				const rangeIds = data.slice(start, end + 1).map((item) => item.id);

				// Merge with existing selection, avoiding duplicates
				const newSelection = [...new Set([...selected, ...rangeIds])];
				setSelected(newSelection);
				return;
			}
		}

		// Normal click (single select)
		if (selected.includes(id)) {
			setSelected([]);
		} else {
			setSelected([id]);
			lastSelectedRef.current = id;
		}
	};

	// Handle select all
	const handleSelectAll = () => {
		if (selected.length === data.length) {
			setSelected([]);
		} else {
			setSelected(data.map((item) => item.id));
		}
	};

	// Handle context menu
	const handleContextMenu = (event: React.MouseEvent, id: string) => {
		event.preventDefault();
		setContextMenu({
			visible: true,
			x: event.clientX,
			y: event.clientY,
			itemId: id,
		});
	};

	// Close context menu when clicking outside
	useEffect(() => {
		const handleClickOutside = () => {
			if (contextMenu) setContextMenu(null);
		};

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [contextMenu]);

	// Handle file download
	const handleDownload = useCallback((item: fileType | Client) => {
		if ('url' in item && 'name' in item) {
			downloadFile(item.url, item.name);
		}
	}, []);

	// Handle bulk download
	const handleBulkDownload = useCallback(() => {
		const selectedFiles = selected
			.map((id) => {
				const item = data.find((item) => item.id === id);
				if (item && 'url' in item && 'name' in item) {
					return { url: item.url, name: item.name };
				}
				return null;
			})
			.filter((item): item is { url: string; name: string } => item !== null);

		if (selectedFiles.length === 0) {
			toast.error('No valid files selected for download');
			return;
		}

		if (selectedFiles.length === 1) {
			downloadFile(selectedFiles[0].url, selectedFiles[0].name);
			return;
		}

		toast.promise(downloadFilesAsZip(selectedFiles, 'files.zip'), {
			loading: 'Preparing files for download...',
			success: (result) => {
				if (!result.success)
					throw new Error(result.error || 'Failed to create zip file');

				if (result.failedFiles.length > 0) {
					return `Downloaded ${result.successfulFiles} files. ${result.failedFiles.length} files could not be included.`;
				}

				return `${result.successfulFiles} files downloaded as zip`;
			},
			error: (error) => `Failed to download files: ${error.message}`,
		});
	}, [selected, data]);

	// Handle file deletion
	const handleDelete = useCallback(
		async (ids: string[]) => {
			try {
				toast.promise(bulkDeleteFiles(ids), {
					loading: 'Deleting files...',
					success: (result) => {
						if (result.error) throw new Error(result.error);
						setSelected([]);
						router.refresh();
						return `${ids.length} file(s) deleted successfully`;
					},
					error: 'Failed to delete files',
				});
			} catch (error) {
				console.error('Delete error:', error);
			}
		},
		[router]
	);

	// Toolbar actions
	const toolbarActions = [
		{
			label: 'Download',
			icon: Download,
			onClick: handleBulkDownload,
		},
		{
			label: 'Delete',
			icon: Trash,
			onClick: () => handleDelete(selected),
			variant: 'danger' as const,
		},
	];

	// Get sort icon
	const getSortIcon = (key: string) => {
		if (sortConfig.key !== key) return null;

		return sortConfig.direction === 'ascending' ? (
			<ArrowUp width="12" height="12" fill="var(--main)" />
		) : sortConfig.direction === 'descending' ? (
			<ArrowDown width="12" height="12" fill="var(--main)" />
		) : null;
	};

	return (
		<>
			{type === 'files' && selected.length > 0 && (
				<Toolbar
					selectedCount={selected.length}
					onClearSelection={() => setSelected([])}
					actions={toolbarActions}
				/>
			)}

			<div
				className={`${styles.table} ${
					type === 'files'
						? styles.files
						: type === 'teams'
						? styles.teams
						: styles.default
				} ${!isCheckboxes ? styles['no-checkboxes'] : ''}`}
				style={
					{
						'--amount': tableHeaders.length,
					} as CSSPropertiesWithVars
				}
			>
				{tableHeaders.map((header, index) => (
					<React.Fragment key={header[0] || index}>
						{index === 0 && isCheckboxes && (
							<div className={` ${styles.border}`}>
								<div
									className={`${styles.square} ${styles.headerCheckbox}`}
									onClick={handleSelectAll}
									style={{
										opacity: 1,
										cursor: 'pointer',
										backgroundColor:
											selected.length === data.length && data.length > 0
												? 'var(--main)'
												: 'transparent',
									}}
								/>
							</div>
						)}

						<div
							className={`${styles.tableHeader} ${
								index === tableHeaders.length - 1 ? styles.lastHeader : ''
							}`}
							onClick={() => requestSort(header[0])}
							onMouseEnter={() => setHoveredHeader(header[0])}
							onMouseLeave={() => setHoveredHeader(null)}
						>
							<h2>{header[1]}</h2>
							{(hoveredHeader === header[0] || sortConfig.key === header[0]) &&
								getSortIcon(header[0])}
						</div>
						{index === tableHeaders.length - 1 && (
							<div className={styles.space} />
						)}
					</React.Fragment>
				))}
				{data.map((item) => (
					<div
						key={item.id}
						className={`${styles.row} ${
							selected.includes(item.id) ? styles.active : ''
						}`}
						onClick={() =>
							type === 'files' && 'url' in item && handleDownload(item)
						}
						onContextMenu={(e) =>
							type === 'files' && handleContextMenu(e, item.id)
						}
					>
						{tableHeaders.map((header, index) => {
							const value = item[header[0] as keyof typeof item];
							const displayValue =
								value instanceof Date
									? getTimeAgo(String(value))
									: header[2] && header[2] === 'size'
									? GetFileSize(Number(item[header[0] as keyof typeof item]))
									: value;

							return (
								<React.Fragment key={`${item.id}-${header[0]}`}>
									{index === 0 && isCheckboxes && (
										<div className={` ${styles.borderS}`}>
											<div
												className={`${styles.square}`}
												style={{
													opacity: selected.includes(item.id) ? 1 : 0,
													backgroundColor: selected.includes(item.id)
														? 'var(--main)'
														: 'transparent',
													cursor: 'pointer',
												}}
												onClick={(e) => handleSelect(item.id, e)}
											/>
										</div>
									)}
									<div
										className={styles.tableCell}
										style={index === 0 ? { padding: '8px 16px 8px 4px' } : {}}
									>
										{header[2] && typeof header[2] === 'object' && (
											<div className={styles.svg}>{header[2]}</div>
										)}
										{header[2] && header[2] === 'file' && (
											<>
												{getFileType(
													String(item[header[0] as keyof typeof item])
												)}
											</>
										)}

										{header[2] && header[2] === 'user' && (
											<>
												{getImagePerson(
													String(item[header[0] as keyof typeof item])
												)}
											</>
										)}
										{header[2] && header[2] === 'status' ? (
											<>
												{getTypePerson(
													String(item[header[0] as keyof typeof item])
												)}
											</>
										) : (
											<span>{displayValue}</span>
										)}
									</div>
									{index === tableHeaders.length - 1 && (
										<div className={styles.dots}>
											<Dots
												fill={'var(--main)'}
												width="20"
												height="20"
												style={{
													opacity: selected.includes(item.id) ? 1 : 0,
													cursor: 'pointer',
												}}
												onClick={(e) => {
													e.stopPropagation();
													handleContextMenu(e, item.id);
												}}
											/>
										</div>
									)}
								</React.Fragment>
							);
						})}
					</div>
				))}
			</div>

			{contextMenu && contextMenu.visible && (
				<div
					className={styles.contextMenu}
					style={{
						position: 'fixed',
						top: contextMenu.y,
						left: contextMenu.x,
						zIndex: 1000,
					}}
				>
					<div
						className={styles.contextMenuItem}
						onClick={() => {
							const item = data.find((item) => item.id === contextMenu.itemId);
							if (item && 'url' in item) {
								handleDownload(item);
							}
							setContextMenu(null);
						}}
					>
						<Download width="16" height="16" fill="var(--main)" />
						<span>Download</span>
					</div>
					<div
						className={styles.contextMenuItem}
						onClick={() => {
							handleDelete([contextMenu.itemId]);
							setContextMenu(null);
						}}
					>
						<Trash width="16" height="16" fill="var(--error-600)" />
						<span style={{ color: 'var(--error-600)' }}>Delete</span>
					</div>
				</div>
			)}
		</>
	);
};

export default TableData;
