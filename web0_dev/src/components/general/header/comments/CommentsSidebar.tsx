import styles from './CommentsSidebar.module.scss';
import Image from 'next/image';
import ChatText from '@/svgs/ChatText';
import { FormEvent, useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import ButtonSelector from '@/components/pages/projects/addProject/ButtonSelector';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';
import Team from '@/svgs/Team';

interface Comment {
	id: string;
	content: string;
	createdAt: Date;
	author: {
		user: {
			name: string;
			image: string | null;
		};
	};
	attachment?: {
		name: string;
		size: string;
	};
}

interface ActivityWithUser {
	id: string;
	type: string;
	description: string;
	createdAt: Date;
	actor: {
		user: {
			name: string;
			image: string | null;
		};
	};
}

// Define a type that matches the structure of the items in the mentionOptions array
type MentionOption = {
	label: string;
	value: string;
	icon: typeof Team;
};

interface CommentsSidebarProps {
	onClose: () => void;
	comments: Comment[];
	activities: ActivityWithUser[];
	onAddComment: (content: string, attachment?: File) => Promise<void>;
}

interface Mention {
	id: string;
	text: string;
	startPos: number;
	endPos: number;
}

const MAX_TOTAL_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

const CommentsSidebar = ({
	onClose,
	comments,
	activities,
	onAddComment,
}: CommentsSidebarProps) => {
	const [newComment, setNewComment] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isMentionOpen, setIsMentionOpen] = useState(false);
	const [mentionQuery, setMentionQuery] = useState('');
	const [editingMentionId, setEditingMentionId] = useState<string | null>(null);
	const [selectionStart, setSelectionStart] = useState<number | null>(null);
	const mentionInputRef = useRef<HTMLInputElement>(null);
	const commentInputRef = useRef<HTMLTextAreaElement>(null);
	const [attachments, setAttachments] = useState<File[]>([]);
	const [totalAttachmentSize, setTotalAttachmentSize] = useState(0);
	const [mentions, setMentions] = useState<Mention[]>([]);
	const data = [
		{ label: 'John Doe', value: 'john', icon: Team },
		{ label: 'Jane Smith', value: 'jane', icon: Team },
		{ label: 'Alex Johnson', value: 'alex', icon: Team },
		{ label: 'Sarah Williams', value: 'sarah', icon: Team },
		{ label: 'notFound.tsx', value: 'notFound.tsx', icon: Team },
		{ label: 'TaskDetails.tsx', value: 'TaskDetails.tsx', icon: Team },
	];
	const [mentionOptions, setMentionOptions] = useState<MentionOption[]>(data);
	const mentionData = data;

	useEffect(() => {
		// Update total attachment size whenever attachments change
		const newTotalSize = attachments.reduce((sum, file) => sum + file.size, 0);
		setTotalAttachmentSize(newTotalSize);
	}, [attachments]);

	// Add auto-grow behavior for textarea
	useEffect(() => {
		if (commentInputRef.current) {
			// Reset height first to get accurate scrollHeight
			commentInputRef.current.style.height = 'auto';
			// Then set height to scrollHeight to fit content
			commentInputRef.current.style.height = `${commentInputRef.current.scrollHeight}px`;
		}
	}, [newComment]);

	const handleAddComment = async (e: FormEvent) => {
		e.preventDefault();
		if ((!newComment.trim() && attachments.length === 0) || isSubmitting)
			return;

		setIsSubmitting(true);
		try {
			// For multiple attachments, you would need to modify your backend to handle them
			// Here we're just sending the first attachment for compatibility
			const firstAttachment =
				attachments.length > 0 ? attachments[0] : undefined;
			await onAddComment(newComment, firstAttachment);
			setNewComment('');
			setAttachments([]);
			setMentions([]);
		} catch (error) {
			console.error('Failed to add comment:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleMentionSelect = (value: string | MentionOption) => {
		if (typeof value !== 'string' && commentInputRef.current) {
			const option = value;
			const mentionText = `@${option.label}`;

			if (editingMentionId) {
				// Replace existing mention
				const mentionToEdit = mentions.find((m) => m.id === editingMentionId);
				if (mentionToEdit) {
					const beforeMention = newComment.substring(0, mentionToEdit.startPos);
					const afterMention = newComment.substring(mentionToEdit.endPos);

					const updatedComment =
						beforeMention + mentionText + ' ' + afterMention;
					setNewComment(updatedComment);

					// Update mentions array
					const mentionEndPos = mentionToEdit.startPos + mentionText.length;
					const updatedMentions = mentions.map((m) =>
						m.id === editingMentionId
							? { ...m, text: mentionText, endPos: mentionEndPos }
							: m
					);
					setMentions(updatedMentions);

					// Adjust cursor position
					setTimeout(() => {
						if (commentInputRef.current) {
							commentInputRef.current.focus();
							commentInputRef.current.selectionStart = mentionEndPos + 1;
							commentInputRef.current.selectionEnd = mentionEndPos + 1;
						}
					}, 0);
				}
			} else if (selectionStart !== null) {
				// Insert new mention at @ position
				const beforeMention = newComment.substring(0, selectionStart);
				const afterMention = newComment.substring(selectionStart + 1); // +1 to remove the @ character

				const updatedComment = beforeMention + mentionText + ' ' + afterMention;
				setNewComment(updatedComment);

				// Add to mentions array
				const mentionId = `mention-${Date.now()}-${Math.random()
					.toString(36)
					.substr(2, 9)}`;
				const mentionStartPos = selectionStart;
				const mentionEndPos = mentionStartPos + mentionText.length;

				setMentions([
					...mentions,
					{
						id: mentionId,
						text: mentionText,
						startPos: mentionStartPos,
						endPos: mentionEndPos,
					},
				]);

				// Adjust cursor position after the mention
				setTimeout(() => {
					if (commentInputRef.current) {
						commentInputRef.current.focus();
						commentInputRef.current.selectionStart = mentionEndPos + 1;
						commentInputRef.current.selectionEnd = mentionEndPos + 1;
					}
				}, 0);
			}
		}

		setIsMentionOpen(false);
		setEditingMentionId(null);
		setSelectionStart(null);
	};

	const handleQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<MentionOption[]>>,
		oldData: MentionOption[]
	) => {
		const value = e.target.value;
		setMentionQuery(value);

		if (value.trim() === '') {
			setOptions(oldData);
		} else {
			setOptions(
				oldData.filter((option) =>
					option.label.toLowerCase().includes(value.toLowerCase())
				)
			);
		}
	};

	const handleCommentInputChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		const value = e.target.value;
		setNewComment(value);

		// Need to update mention positions when text changes
		updateMentionPositions(value);

		// Check for @ to trigger mentions
		if (e.target.selectionStart !== null) {
			const cursorPos = e.target.selectionStart;
			const textBeforeCursor = value.substring(0, cursorPos);
			const lastAtIndex = textBeforeCursor.lastIndexOf('@');

			if (
				lastAtIndex >= 0 &&
				(lastAtIndex === 0 ||
					value[lastAtIndex - 1] === ' ' ||
					value[lastAtIndex - 1] === '\n') &&
				!textBeforeCursor.substring(lastAtIndex + 1).includes(' ')
			) {
				const query = textBeforeCursor.substring(lastAtIndex + 1);
				setMentionQuery(query);
				setIsMentionOpen(true);
				setSelectionStart(lastAtIndex);

				// Filter options based on the query
				if (query) {
					setMentionOptions(
						mentionData.filter((option) =>
							option.label.toLowerCase().includes(query.toLowerCase())
						)
					);
				} else {
					setMentionOptions(mentionData);
				}
			} else {
				if (isMentionOpen && !editingMentionId) {
					setIsMentionOpen(false);
					setSelectionStart(null);
				}
			}
		}
	};

	const updateMentionPositions = (text: string) => {
		if (mentions.length === 0) return;

		// This is a simplified approach - for a production app, you would need
		// a more sophisticated algorithm to track mentions as the text changes
		const updatedMentions = mentions.filter((mention) => {
			const mentionText = text.substring(mention.startPos, mention.endPos);
			return mentionText === mention.text;
		});

		setMentions(updatedMentions);
	};

	const handleMentionClick = (mentionId: string) => {
		const mention = mentions.find((m) => m.id === mentionId);
		if (mention && commentInputRef.current) {
			// Extract the mention text without the @ symbol
			const mentionText = mention.text.substring(1); // Remove @ symbol
			const matchingOption = mentionData.find(
				(option) => option.label === mentionText
			);

			// Set selection at the mention
			commentInputRef.current.focus();
			commentInputRef.current.selectionStart = mention.startPos;
			commentInputRef.current.selectionEnd = mention.endPos;

			// Open mention selector for editing with the correct option highlighted
			setEditingMentionId(mentionId);
			setIsMentionOpen(true);
			setMentionOptions(mentionData);

			// Set the query to match the current mention text to ensure it's filtered correctly
			setMentionQuery(mentionText);

			// Allow the popup to render, then find and highlight the selected option
			setTimeout(() => {
				if (matchingOption) {
					const optionElements = document.querySelectorAll(
						`[data-value="${matchingOption.value}"]`
					);
					optionElements.forEach((element) => {
						element.classList.add(styles.selectedOption);
						element.scrollIntoView({ block: 'nearest' });
					});
				}
			}, 10);
		}
	};

	const handleAttachFile = () => {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.multiple = true; // Allow multiple files
		fileInput.click();

		fileInput.onchange = (e) => {
			const target = e.target as HTMLInputElement;
			if (target.files && target.files.length > 0) {
				const newFiles = Array.from(target.files);
				const newTotalSize =
					totalAttachmentSize +
					newFiles.reduce((sum, file) => sum + file.size, 0);

				// Check if adding these files would exceed the maximum size
				if (newTotalSize > MAX_TOTAL_FILE_SIZE) {
					alert(`Cannot add files. Total size exceeds the 25MB limit.`);
					return;
				}

				setAttachments([...attachments, ...newFiles]);
			}
		};
	};

	const removeAttachment = (index: number) => {
		setAttachments(attachments.filter((_, i) => i !== index));
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	const timelineItems = [...comments, ...activities].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);

	return (
		<div className={styles.sidebarWrapper}>
			<div className={styles.sidebar}>
				<div className={styles.header}>
					<h3>Comments & Activity</h3>
					<button onClick={onClose}>Close</button>
				</div>

				<div className={styles.content}>
					{timelineItems.length === 0 ? (
						<div className={styles.emptyState}>
							<ChatText fill={'var(--main-50)'} width="24" height="24" />
							<p>No comments or activity yet</p>
						</div>
					) : (
						<div className={styles.timeline}>
							{timelineItems.map((item) => {
								const isComment = 'content' in item;
								const user = isComment ? item.author.user : item.actor.user;
								const attachment =
									isComment && 'attachment' in item
										? (item as Comment).attachment
										: null;

								return (
									<div
										key={item.id}
										className={`${styles.timelineItem} ${
											isComment ? styles.comment : styles.activity
										}`}
									>
										<div className={styles.userAvatar}>
											<Image
												src={user.image || 'https://placehold.co/32'}
												alt={user.name || 'User'}
												width={32}
												height={32}
												className={styles.avatar}
											/>
										</div>
										<div className={styles.messageContent}>
											<div className={styles.messageHeader}>
												<span className={styles.userName}>{user.name}</span>
												<span className={styles.timeAgo}>
													{formatDistanceToNow(new Date(item.createdAt), {
														addSuffix: true,
													})}
												</span>
											</div>
											<div className={styles.messageBody}>
												{isComment ? (
													<>
														<p
															dangerouslySetInnerHTML={{
																__html: item.content.replace(
																	/@([a-zA-Z0-9 ]+)/g,
																	'<span class="' +
																		styles.mention +
																		'">@$1</span>'
																),
															}}
														></p>
														{attachment && (
															<div className={styles.fileAttachment}>
																<div className={styles.fileIcon}>
																	<svg
																		width="16"
																		height="16"
																		viewBox="0 0 24 24"
																		fill="none"
																		xmlns="http://www.w3.org/2000/svg"
																	>
																		<path
																			d="M14 3v4a1 1 0 0 0 1 1h4"
																			stroke="var(--main-50)"
																			strokeWidth="2"
																			strokeLinecap="round"
																			strokeLinejoin="round"
																		/>
																		<path
																			d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"
																			stroke="var(--main-50)"
																			strokeWidth="2"
																			strokeLinecap="round"
																			strokeLinejoin="round"
																		/>
																	</svg>
																</div>
																<div className={styles.fileInfo}>
																	<span className={styles.fileName}>
																		{attachment.name}
																	</span>
																	<span className={styles.fileSize}>
																		{attachment.size}
																	</span>
																</div>
															</div>
														)}
													</>
												) : (
													<p className={styles.activityText}>
														{item.description}
													</p>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				<div className={styles.commentInputContainer}>
					<form onSubmit={handleAddComment} className={styles.commentForm}>
						{attachments.length > 0 && (
							<div className={styles.attachmentsContainer}>
								{attachments.map((file, index) => (
									<div key={index} className={styles.fileAttachment}>
										<div className={styles.fileIcon}>
											<svg
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M14 3v4a1 1 0 0 0 1 1h4"
													stroke="var(--main-50)"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path
													d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"
													stroke="var(--main-50)"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</div>
										<div className={styles.fileInfo}>
											<span className={styles.fileName}>{file.name}</span>
											<span className={styles.fileSize}>
												{formatFileSize(file.size)}
											</span>
										</div>
										<button
											type="button"
											className={styles.removeFile}
											onClick={() => removeAttachment(index)}
										>
											&times;
										</button>
									</div>
								))}
								<div className={styles.totalFileSize}>
									Total: {formatFileSize(totalAttachmentSize)} / 25MB
								</div>
							</div>
						)}

						<div className={styles.inputWrapper}>
							<textarea
								value={newComment}
								onChange={handleCommentInputChange}
								placeholder="Add a comment..."
								className={styles.commentInput}
								ref={commentInputRef}
								onKeyUp={() => {
									// Handle clicking on a mention using keyboard
									if (mentions.length > 0 && commentInputRef.current) {
										const cursorPos =
											commentInputRef.current.selectionStart || 0;
										const clickedMention = mentions.find(
											(m) => cursorPos >= m.startPos && cursorPos <= m.endPos
										);
										if (clickedMention) {
											handleMentionClick(clickedMention.id);
										}
									}
								}}
								onClick={() => {
									// Handle clicking on a mention
									if (commentInputRef.current) {
										const cursorPos =
											commentInputRef.current.selectionStart || 0;
										const clickedMention = mentions.find(
											(m) => cursorPos >= m.startPos && cursorPos <= m.endPos
										);
										if (clickedMention) {
											handleMentionClick(clickedMention.id);
										}
									}
								}}
							/>

							<div className={styles.inputActions}>
								<button
									type="button"
									className={styles.actionButton}
									onClick={() => {
										if (commentInputRef.current) {
											const cursorPos =
												commentInputRef.current.selectionStart || 0;
											const updatedComment =
												newComment.substring(0, cursorPos) +
												'@' +
												newComment.substring(cursorPos);
											setNewComment(updatedComment);
											setIsMentionOpen(true);
											setSelectionStart(cursorPos);

											// Focus and position cursor after the @ symbol
											setTimeout(() => {
												if (commentInputRef.current) {
													commentInputRef.current.focus();
													const newPos = cursorPos + 1;
													commentInputRef.current.selectionStart = newPos;
													commentInputRef.current.selectionEnd = newPos;
												}
											}, 0);
										}
									}}
								>
									@
								</button>
								<button
									type="button"
									className={styles.actionButton}
									onClick={handleAttachFile}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M14 3v4a1 1 0 0 0 1 1h4"
											stroke="var(--main-50)"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"
											stroke="var(--main-50)"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
								<button
									type="submit"
									disabled={
										(!newComment.trim() && attachments.length === 0) ||
										isSubmitting
									}
									className={styles.sendButton}
								>
									Send
								</button>
							</div>
						</div>

						{isMentionOpen && (
							<div className={styles.mentionPopup}>
								<ClickOutsideWrapper onClose={() => setIsMentionOpen(false)}>
									<ButtonSelector
										query={mentionQuery}
										onQueryChange={(e) =>
											handleQueryChange(e, setMentionOptions, mentionOptions)
										}
										inputRef={mentionInputRef}
										options={mentionOptions}
										placeholder="Select user or file to mention"
										oldData={mentionData}
										setOptions={setMentionOptions}
										setIsChosen={handleMentionSelect}
										setIsOpenOption={setIsMentionOpen}
										isChosen=""
										isUpsideDown={true}
									/>
								</ClickOutsideWrapper>
							</div>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default CommentsSidebar;
