'use client';

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	Dispatch,
	SetStateAction,
} from 'react';
import { Comment, ActivityWithUser } from '@/types/comment';

interface CommentsContextType {
	comments: Comment[];
	activities: ActivityWithUser[];
	setComments: Dispatch<SetStateAction<Comment[]>>;
	setActivities: Dispatch<SetStateAction<ActivityWithUser[]>>;
	addComment: (content: string) => Promise<void>;
	addActivity: (activity: ActivityWithUser) => void;
}

const CommentsContext = createContext<CommentsContextType | null>(null);

export const CommentsProvider = ({ children }: { children: ReactNode }) => {
	const [comments, setComments] = useState<Comment[]>([]);
	const [activities, setActivities] = useState<ActivityWithUser[]>([]);

	const addComment = async (content: string) => {
		const newComment: Comment = {
			id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			content,
			createdAt: new Date(),
			author: {
				user: {
					name: 'Current User',
					id: 'temp-user',
					createdAt: new Date(),
					updatedAt: new Date(),
					email: '',
					emailVerified: false,
					image: null,
				},
			},
		};
		setComments((prev) => [...prev, newComment]);
	};

	const addActivity = (activity: ActivityWithUser) => {
		setActivities((prev) => [...prev, activity]);
	};

	return (
		<CommentsContext.Provider
			value={{
				comments,
				activities,
				setComments,
				setActivities,
				addComment,
				addActivity,
			}}
		>
			{children}
		</CommentsContext.Provider>
	);
};

export const useComments = () => {
	const context = useContext(CommentsContext);
	if (!context) {
		throw new Error('useComments must be used within a CommentsProvider');
	}
	return context;
};
