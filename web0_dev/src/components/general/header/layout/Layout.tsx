'use client';

import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Footer from '../../Footer';
import Header from '../Header';
import styles from './Layout.module.scss';
import { Session } from '@/lib/auth';
import ClientSideBar from '../sidebar/ClientSideBar';
import ClientCommentsSidebar from '../comments/ClientCommentsSidebar';
import Sidebar from '@/components/pages/settings/sidebar/Sidebar';

interface FavoriteItem {
	id: string;
	title: string;
	pathname: string;
	type: 'project' | 'task' | 'note' | 'library' | 'files' | 'phase';
}

interface LayoutProps {
	children: React.ReactNode;
	isTaskDetailPage: boolean;
	isOpenLeftBar: boolean;
	setIsOpenLeftBar: Dispatch<SetStateAction<boolean>>;
	isOpenRightBarNotifications: boolean;
	isOpenRightBarComments: boolean;
	setIsOpenRightBarNotifications: Dispatch<SetStateAction<boolean>>;
	setIsOpenRightBarComments: Dispatch<SetStateAction<boolean>>;
	widthLeftbar: string;
	widthRightbar: string;
	initialLibraryItems: { slug: string }[];
	initialSession: Session;
	isSettingsPage: boolean;
}

const Layout = ({
	children,
	isSettingsPage,
	isTaskDetailPage,
	isOpenLeftBar,
	setIsOpenLeftBar,
	isOpenRightBarNotifications,
	isOpenRightBarComments,
	setIsOpenRightBarNotifications,
	setIsOpenRightBarComments,
	widthLeftbar,
	widthRightbar,
	initialLibraryItems,
	initialSession,
}: LayoutProps) => {
	const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
	const [isFavorite, setIsFavorite] = useState(false);
	const [overridePageInfo, setOverridePageInfo] = useState<FavoriteItem | null>(
		null
	);

	const pathname = usePathname();

	const getPageInfo = () => {
		if (overridePageInfo) {
			return overridePageInfo;
		}

		const parts = pathname
			.split('/')
			.filter(
				(part) => part && part !== initialSession.session.organizationSlug
			);

		// Default values
		let title = parts[parts.length - 1] || 'Home';
		let id = parts[parts.length - 1] || '';
		let type: 'project' | 'task' | 'note' = 'note';

		// Format title based on URL pattern
		if (parts.length === 0) {
			// Root organization URL: /orgSlug
			title = 'Home';
			id = 'home';
		} else if (parts[0] === 'projects' && parts.length === 1) {
			// Projects listing: /orgSlug/projects
			title = 'Projects';
			id = 'projects';
		} else if (parts[0] === 'projects' && parts.length >= 2) {
			// Project detail: /orgSlug/projects/projectId
			type = 'project';
			id = parts[1];

			// If this is a project tasks view: /orgSlug/projects/projectId/tasks
			if (parts.length >= 3 && parts[2] === 'tasks') {
				title = `${id}: Tasks`;
			}
			// If this is a specific task: /orgSlug/projects/projectId/tasks/taskId
			else if (parts.length >= 4 && parts[2] === 'tasks') {
				type = 'task';
				id = parts[3];
				// We should ideally fetch the task name from API or context here
				title = `Task ${id}`;
			}
			// Other project sections
			else if (parts.length >= 3) {
				title = `${id}: ${
					parts[2].charAt(0).toUpperCase() + parts[2].slice(1)
				}`;
			}
			// Just the project
			else {
				// We should ideally fetch the project name from API or context here
				title = `Project ${id}`;
			}
		} else if (parts[0] === 'library') {
			// Library section: /orgSlug/library
			type = 'note';

			if (parts.length === 1) {
				title = 'Library';
				id = 'library';
			}
			// Library category: /orgSlug/library/category/categoryName
			else if (parts.length >= 3 && parts[1] === 'category') {
				title = `Library: ${parts[2]}`;
				id = parts[2];
			}
			// Library item: /orgSlug/library/itemId
			else if (parts.length >= 2) {
				id = parts[1];
				// We should ideally fetch the item name from API or context here
				title = `Library: ${id}`;
			}
		} else if (parts[0] === 'clients') {
			// Clients section
			if (parts.length === 1) {
				title = 'Clients';
				id = 'clients';
			} else if (parts.length >= 2) {
				id = parts[1];
				title = `Client: ${id}`;

				// Client-portal files: /orgSlug/clients/clientId/files
				if (parts.length >= 3 && parts[2] === 'files') {
					title = `Client ${id}: Files`;
				}
			}
		} else if (parts[0] === 'notes') {
			type = 'note';

			if (parts.length === 1) {
				title = 'Notes';
				id = 'notes';
			} else if (parts.length >= 2) {
				id = parts[1];
				// We should ideally fetch the note name from API or context here
				title = `Note: ${id}`;
			}
		}
		// Format first character to uppercase for better display
		title = title.charAt(0).toUpperCase() + title.slice(1);

		return {
			id,
			title,
			pathname,
			type,
		};
	};

	// Listen for pageinfo events from components like TaskDetails
	useEffect(() => {
		const handlePageInfo = (e: CustomEvent<FavoriteItem>) => {
			if (e.detail) {
				setOverridePageInfo(e.detail);
			}
		};

		// Add event listener with type assertion
		window.addEventListener('pageinfo', handlePageInfo as EventListener);

		// Cleanup
		return () => {
			window.removeEventListener('pageinfo', handlePageInfo as EventListener);
		};
	}, []);

	// Check if current page is in favorites whenever page or favorites change
	useEffect(() => {
		// Get current page info
		const currentInfo = getPageInfo();

		if (currentInfo) {
			const isFav = favorites.some((fav) => {
				// Must match ID and type
				if (fav.id !== currentInfo.id || fav.type !== currentInfo.type) {
					return false;
				}

				// For exact path matches (exact same URL), it's definitely a favorite
				if (fav.pathname === currentInfo.pathname) {
					return true;
				}

				// Special case: Project root favorited, but we're on a subpage
				if (currentInfo.type === 'project') {
					// Check if the favorited path is a parent of the current path
					// i.e., the current path starts with the favorited path
					// AND the current path is longer (indicating it's a subpage)
					const isSubpage =
						currentInfo.pathname.startsWith(fav.pathname) &&
						currentInfo.pathname.length > fav.pathname.length &&
						// Ensure that the next character after the fav.pathname is a slash
						// to avoid matching partial paths
						currentInfo.pathname[fav.pathname.length] === '/';

					// If it's a subpage, it should NOT be marked as a favorite
					if (isSubpage) {
						return false;
					}
				}

				// If we got here and it's not an exact match, it's not a favorite
				return false;
			});

			setIsFavorite(isFav);
		} else {
			setIsFavorite(false);
		}
	}, [overridePageInfo, favorites, pathname]);

	// Current page info
	const currentPageInfo: FavoriteItem = getPageInfo();

	// Load favorites on mount
	useEffect(() => {
		try {
			const storedFavorites = localStorage.getItem('favorites') || '[]';
			const parsedFavorites = JSON.parse(storedFavorites);

			// Convert old favorites format if needed (path → pathname)
			const updatedFavorites = parsedFavorites.map(
				(fav: {
					id: string;
					title: string;
					path?: string;
					pathname?: string;
					type: string;
				}) => {
					if (fav.path && !fav.pathname) {
						return {
							...fav,
							pathname: fav.path,
							// Ensure type is one of the allowed types
							type: [
								'project',
								'task',
								'note',
								'library',
								'files',
								'phase',
							].includes(fav.type)
								? fav.type
								: 'note',
						};
					}
					return fav;
				}
			);

			setFavorites(updatedFavorites);

			// Save the updated format back to localStorage
			if (
				JSON.stringify(parsedFavorites) !== JSON.stringify(updatedFavorites)
			) {
				localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
			}
		} catch (error) {
			console.error('Failed to load favorites:', error);
			// Initialize with empty array if there's an error
			setFavorites([]);
		}
	}, []);

	// Update recent items whenever the pathname changes
	useEffect(() => {
		if (!currentPageInfo) return;

		try {
			const storedRecents = localStorage.getItem('recentItems') || '[]';
			const parsedRecents = JSON.parse(storedRecents);

			// Convert any old format items (path → pathname)
			const recentItems = parsedRecents.map(
				(item: {
					id: string;
					title: string;
					path?: string;
					pathname?: string;
					type: string;
				}) => {
					if (item.path && !item.pathname) {
						return {
							...item,
							pathname: item.path,
							// Ensure type is one of the allowed types
							type: [
								'project',
								'task',
								'note',
								'library',
								'files',
								'phase',
							].includes(item.type)
								? item.type
								: 'note',
						};
					}
					return item;
				}
			);

			// Add current page to recents if not already there, or update if it exists
			const existingIndex = recentItems.findIndex(
				(item: FavoriteItem) =>
					item.id === currentPageInfo.id && item.type === currentPageInfo.type
			);

			if (existingIndex >= 0) {
				// Remove existing item so we can move it to the top
				recentItems.splice(existingIndex, 1);
			}

			// Add to beginning
			recentItems.unshift(currentPageInfo);

			// Keep only the 5 most recent
			const updatedRecents = recentItems.slice(0, 5);

			// Save to localStorage
			localStorage.setItem('recentItems', JSON.stringify(updatedRecents));
		} catch (error) {
			console.error('Failed to update recent items:', error);
		}
	}, [pathname, currentPageInfo]);

	// Handle toggling favorite status
	const handleToggleFavorite = (value: boolean) => {
		if (!currentPageInfo) return;

		if (value) {
			// Only remove existing favorites with same type and ID
			const updatedFavorites = favorites.filter(
				(fav) =>
					!(fav.id === currentPageInfo.id && fav.type === currentPageInfo.type)
			);

			// Add new favorite
			const newFavorites = [...updatedFavorites, currentPageInfo];
			setFavorites(newFavorites);
			localStorage.setItem('favorites', JSON.stringify(newFavorites));
		} else {
			// Remove from favorites - only exact matches
			const updatedFavorites = favorites.filter(
				(fav) =>
					!(fav.id === currentPageInfo.id && fav.type === currentPageInfo.type)
			);
			setFavorites(updatedFavorites);
			localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
		}

		setIsFavorite(value);
	};

	return (
		<div className={styles.layout}>
			<nav
				className={`${styles.sidebar} ${
					!isOpenLeftBar ? styles.closedLeft : ''
				}`}
			>
				{isSettingsPage ? (
					<Sidebar session={initialSession} />
				) : (
					<ClientSideBar
						libraryItems={initialLibraryItems}
						session={initialSession}
						favorites={favorites}
					/>
				)}
			</nav>
			<div
				className={styles.main}
				style={{
					paddingLeft: isOpenLeftBar ? widthLeftbar : '0',
					paddingRight:
						isOpenRightBarNotifications || isOpenRightBarComments
							? widthRightbar
							: '0',
				}}
			>
				<Header
					isOpenLeftBar={isOpenLeftBar}
					onToggleLeftBar={setIsOpenLeftBar}
					isOpenRightBarNotifications={isOpenRightBarNotifications}
					isOpenRightBarComments={isOpenRightBarComments}
					isTaskDetailPage={isTaskDetailPage}
					widthLeftbar={widthLeftbar}
					widthRightbar={widthRightbar}
					onToggleNotifications={setIsOpenRightBarNotifications}
					onToggleComments={setIsOpenRightBarComments}
					onToggleFavorite={handleToggleFavorite}
					isFavorite={isFavorite}
				/>
				<main
					className={`${!isOpenLeftBar ? styles.leftOpen : styles.standard} ${
						isOpenRightBarNotifications || isOpenRightBarComments
							? styles.rightOpen
							: styles.standard
					}`}
				>
					<div className={styles.fakeHeader}></div>
					{children}
				</main>
				<Footer />
			</div>
			<div
				className={`${styles.rightBar} ${
					!isOpenRightBarComments ? styles.closedRight : ''
				}`}
			>
				<ClientCommentsSidebar
					isOpen={isOpenRightBarComments}
					onClose={() => setIsOpenRightBarComments(false)}
				/>
			</div>
		</div>
	);
};

export default Layout;
