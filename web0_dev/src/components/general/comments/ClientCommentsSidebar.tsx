'use client';

import CommentsSidebar from './CommentsSidebar';
import { useComments } from '@/contexts/CommentsContext';

interface ClientCommentsSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function ClientCommentsSidebar({
	isOpen,
	onClose,
}: ClientCommentsSidebarProps) {
	const { comments, activities, addComment } = useComments();

	return (
		<CommentsSidebar
			isOpen={isOpen}
			onClose={onClose}
			comments={comments}
			activities={activities}
			onAddComment={addComment}
		/>
	);
}
