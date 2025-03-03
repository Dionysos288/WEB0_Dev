'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';
import { createLibrary } from '@/actions/CRUDLibrary';
import { useRouter } from 'next/navigation';
import Dismiss from '@/svgs/Dismiss';
import { AddLibraryPopupProps, LibraryTypeOption } from './types';
import { DEFAULT_FILE_TEMPLATES } from './constants';
import { uploadMultipleToR2 } from '@/utils/cloudflareR2';
import CodeSplit from '@/svgs/CodeSplit';
import CodeFull from '@/svgs/CodeFull';
import CodeCompiler from '@/svgs/CodeCompiler';
import ImageGallery from '@/svgs/ImageGallery';
import ImageCarousel from '@/svgs/ImageCarousel';
import ColorPalette from '@/svgs/ColorPalette';
import Label from '@/svgs/Label';
import Project from '@/svgs/Project';
import Category from '@/svgs/Category';
import ImageIcon from '@/svgs/Image';
import LibraryComponentSelector from './components/LibraryComponentSelector';
import CategorySelector from './components/CategorySelector';
import CoverImageUploader from './components/CoverImageUploader';
import TagSelector from './components/TagSelector';
import { libraryComponent } from '@prisma/client';
import Spacing from '@/components/general/Spacing';
import { toast } from 'sonner';
const AddLibraryPopup = ({
	isOpen,
	onClose,
	categories,
	organizationId,
	libraryTypeId,
	projectId,
	libraryTags = [],
}: AddLibraryPopupProps) => {
	const router = useRouter();

	// Form data
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [content, setContent] = useState('');
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
	const [selectedComponentType, setSelectedComponentType] =
		useState<LibraryTypeOption['id']>('');
	const [activeCategory, setActiveCategory] = useState<'code' | 'design'>(
		'code'
	);
	const [coverImage, setCoverImage] = useState<File | null>(null);
	const [isCoverImageUploaderVisible, setIsCoverImageUploaderVisible] =
		useState(false);

	// Additional configurations for each type
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [extractedColors, setExtractedColors] = useState<
		Array<[string, string]>
	>([]);

	// Code editor state
	const [codeFiles, setCodeFiles] = useState<Record<string, string>>({});

	// Add a loading state
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Tags state
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [isTagOpen, setIsTagOpen] = useState(false);
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);
	const [isComponentTypeOpen, setIsComponentTypeOpen] = useState(false);
	const [availableTags, setAvailableTags] = useState<string[]>(libraryTags);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const adjustTextareaHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';

			if (
				!isComponentTypeOpen &&
				!isCoverImageUploaderVisible &&
				textareaRef.current.scrollHeight < 300
			) {
				textareaRef.current.style.height = '300px';
			} else {
				textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
			}
		}
	};

	useEffect(() => {
		adjustTextareaHeight();
	}, [content, isComponentTypeOpen, isCoverImageUploaderVisible]);

	// Library component type options
	const libraryTypeOptions: LibraryTypeOption[] = [
		{
			id: 'codeSplit',
			name: 'Website Code Split',
			description:
				'Showcase frontend code with split views, perfect for HTML, CSS, and JavaScript examples.',
			icon: CodeSplit,
			category: 'code',
		},
		{
			id: 'codefull',
			name: 'Full Code Block',
			description:
				'Display entire code blocks without visual representation, ideal for algorithms and functions.',
			icon: CodeFull,
			category: 'code',
		},
		{
			id: 'codeCompiler',
			name: 'Code Compiler',
			description:
				'Interactive code with execution metrics and return values for Python, C#, and other languages.',
			icon: CodeCompiler,
			category: 'code',
		},
		{
			id: 'imageV1',
			name: 'Image Gallery',
			description:
				'Create a responsive grid gallery to showcase multiple design assets and images.',
			icon: ImageGallery,
			category: 'design',
		},
		{
			id: 'imageV2',
			name: 'Image Carousel',
			description:
				'Present images in an interactive carousel for sequential viewing of related designs.',
			icon: ImageCarousel,
			category: 'design',
		},
		{
			id: 'color',
			name: 'Color Palette',
			description:
				'Organize and showcase color schemes with automatic extraction from uploaded images.',
			icon: ColorPalette,
			category: 'design',
		},
	];

	// Reset form when modal is closed
	useEffect(() => {
		if (!isOpen) {
			setTitle('');
			setDescription('');
			setContent('');
			setSelectedCategoryId('');
			setSelectedComponentType('');
			setIsComponentTypeOpen(false);
			setActiveCategory('code');
			setSelectedImages([]);
			setExtractedColors([]);
			setCodeFiles({});
			setSelectedTags([]);
			setCoverImage(null);
			setIsCoverImageUploaderVisible(false);
		}
	}, [isOpen]);

	// Initialize code files based on selected component type
	useEffect(() => {
		if (selectedComponentType === 'codeSplit') {
			// For web-based code editors with split view
			const initialFiles = {
				'index.html': DEFAULT_FILE_TEMPLATES['index.html'],
				'styles.css': DEFAULT_FILE_TEMPLATES['styles.css'],
				'script.js': DEFAULT_FILE_TEMPLATES['script.js'],
			};
			setCodeFiles(initialFiles);
		} else if (selectedComponentType === 'codefull') {
			// For full code block, start with empty state
			setCodeFiles({});
		} else if (selectedComponentType === 'codeCompiler') {
			// For code compiler
			const initialFiles = {
				'main.py': DEFAULT_FILE_TEMPLATES['main.py'],
			};
			setCodeFiles(initialFiles);
		}
	}, [selectedComponentType]);

	const getTagsDisplay = () => {
		if (selectedTags.length === 0) {
			return (
				<>
					<span style={{ color: 'var(--main-65)' }}>Tags</span>
				</>
			);
		} else {
			return (
				<>
					<span style={{ color: 'var(--main)' }}>
						{selectedTags.length === 1
							? selectedTags[0]
							: `${selectedTags.length} tags`}
					</span>
				</>
			);
		}
	};

	const getCategoryDisplay = () => {
		if (!selectedCategoryId) {
			return (
				<>
					<span style={{ color: 'var(--main-65)' }}>Category</span>
				</>
			);
		} else {
			const selectedCategory = categories.find(
				(c) => c.id === selectedCategoryId
			);
			return (
				<>
					<span style={{ color: 'var(--main)' }}>
						{selectedCategory ? selectedCategory.name : 'Category'}
					</span>
				</>
			);
		}
	};

	const getCoverImageDisplay = () => {
		return (
			<div className={styles.coverImageOption}>
				<button
					className={styles.coverImageButton}
					onClick={() =>
						setIsCoverImageUploaderVisible(!isCoverImageUploaderVisible)
					}
				>
					<ImageIcon
						width="16"
						height="16"
						fill={coverImage ? 'var(--main)' : 'var(--main-65)'}
					/>
					<span
						style={{ color: coverImage ? 'var(--main)' : 'var(--main-65)' }}
					>
						Cover Image
					</span>
				</button>
				{isCoverImageUploaderVisible && (
					<ClickOutsideWrapper
						onClose={() => setIsCoverImageUploaderVisible(false)}
					>
						<div className={styles.coverImageModal}>
							<CoverImageUploader
								setCoverImage={setCoverImage}
								coverImage={coverImage}
							/>
						</div>
					</ClickOutsideWrapper>
				)}
			</div>
		);
	};

	const getComponentTypeColor = () => {
		if (selectedComponentType) {
			return 'var(--main)';
		} else {
			return 'var(--main-65)';
		}
	};

	const getComponentTypeText = () => {
		const option = libraryTypeOptions.find(
			(opt) => opt.id === selectedComponentType
		);
		return option ? option.name : 'Type';
	};

	const handleAddNewTag = (tag: string) => {
		if (!availableTags.includes(tag)) {
			setAvailableTags([...availableTags, tag]);
		}
	};

	const handleSubmit = async () => {
		if (
			!organizationId ||
			!title ||
			!selectedComponentType ||
			!coverImage ||
			!selectedCategoryId
		) {
			toast.error('Missing required fields');
			console.error('Missing required fields');
			return;
		}

		setIsSubmitting(true);

		try {
			let coverImageUrl = '';

			if (coverImage) {
				const coverImageResult = await uploadMultipleToR2(
					[coverImage],
					'library'
				);

				if (
					coverImageResult &&
					Array.isArray(coverImageResult) &&
					coverImageResult.length > 0
				) {
					coverImageUrl = coverImageResult[0];
				}
			}

			let imageUrls: string[] = [];

			if (selectedImages.length > 0) {
				const imagesToUpload = selectedImages.slice(0, 15);

				const imageUploadPromises = imagesToUpload.map((image) =>
					uploadMultipleToR2([image], 'library')
				);

				const imageResults = await Promise.all(imageUploadPromises);
				imageUrls = imageResults
					.filter((result) => Array.isArray(result) && result.length > 0)
					.map((result) => result[0]);
			}

			const result = await createLibrary({
				organizationId,
				title,
				description,
				content,
				libraryTypeId,
				component: selectedComponentType as libraryComponent,
				coverImageUrl,
				imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
				codeFiles: Object.keys(codeFiles).length > 0 ? codeFiles : undefined,
				colors: extractedColors,
				tags: selectedTags.length > 0 ? selectedTags : undefined,
				categoryId: selectedCategoryId || '',
				projectId: projectId,
			});

			if (!result.success) {
				console.error('Failed to create library item:', result.error);
			} else {
				router.refresh();
				onClose();
			}
		} catch (error) {
			console.error('Error creating library item:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className={styles.popupWrapper}>
			<ClickOutsideWrapper onClose={onClose} closeOnEsc={true}>
				<div className={styles.popup}>
					<button className={styles.dismissButton} onClick={onClose}>
						<Dismiss width="16" height="16" />
					</button>
					<div>
						<h2>New Library Item</h2>
					</div>
					<Spacing space={14} />
					<div className={styles.formWrapper}>
						<div className={styles.inputWrapper}>
							<input
								type="text"
								placeholder="Library Title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className={styles.header}
							/>
							<textarea
								placeholder="Library Description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className={styles.description}
							/>

							<div className={styles.optionWrapper}>
								<div
									className={styles.option}
									onClick={() => setIsComponentTypeOpen(!isComponentTypeOpen)}
								>
									<Project
										fill={getComponentTypeColor()}
										width="16"
										height="16"
									/>
									<span style={{ color: getComponentTypeColor() }}>
										{getComponentTypeText()}
									</span>
								</div>

								<div className={styles.option}>{getCoverImageDisplay()}</div>

								<div
									className={styles.option}
									onClick={() => setIsTagOpen(!isTagOpen)}
								>
									<Label
										fill={
											selectedTags.length > 0 ? 'var(--main)' : 'var(--main-65)'
										}
										width="16"
										height="16"
									/>
									<div className={styles.selectedTags}>{getTagsDisplay()}</div>

									{isTagOpen && (
										<TagSelector
											existingTags={availableTags}
											selectedTags={selectedTags}
											setSelectedTags={setSelectedTags}
											onAddNewTag={handleAddNewTag}
											isOpen={isTagOpen}
											setIsOpen={setIsTagOpen}
										/>
									)}
								</div>

								<div
									className={styles.option}
									onClick={() => setIsCategoryOpen(!isCategoryOpen)}
								>
									<Category
										fill={selectedCategoryId ? 'var(--main)' : 'var(--main-65)'}
										width="16"
										height="16"
									/>
									{getCategoryDisplay()}
								</div>
							</div>
						</div>
						<Spacing space={18} />
						<div className={styles.line} />
						<Spacing space={18} />

						<textarea
							ref={textareaRef}
							className={styles.content}
							value={content}
							placeholder="Write a description, instructions, or notes for this library item."
							onChange={(e) => {
								setContent(e.target.value);
								adjustTextareaHeight();
							}}
						/>
						{isComponentTypeOpen && (
							<LibraryComponentSelector
								libraryTypeOptions={libraryTypeOptions}
								selectedComponentType={selectedComponentType}
								setSelectedComponentType={setSelectedComponentType}
								activeCategory={activeCategory}
								setActiveCategory={setActiveCategory}
								setIsComponentTypeOpen={setIsComponentTypeOpen}
								selectedImages={selectedImages}
								setSelectedImages={setSelectedImages}
								coverImage={coverImage}
								setCoverImage={setCoverImage}
								extractedColors={extractedColors}
								setExtractedColors={setExtractedColors}
							/>
						)}
						{isCategoryOpen && (
							<CategorySelector
								categories={categories}
								selectedCategoryId={selectedCategoryId}
								setSelectedCategoryId={setSelectedCategoryId}
								setIsCategoryOpen={setIsCategoryOpen}
							/>
						)}
					</div>
					<div className={styles.actions}>
						<div className={styles.rightActions}>
							<button
								type="button"
								className={styles.cancelButton}
								onClick={onClose}
							>
								<span>Cancel</span>
							</button>
							<button
								type="button"
								className={styles.createButton}
								onClick={handleSubmit}
								disabled={isSubmitting}
							>
								<span>
									{isSubmitting ? 'Creating...' : 'Create Library Item'}
								</span>
							</button>
						</div>
					</div>
				</div>
			</ClickOutsideWrapper>
		</div>
	);
};

export default AddLibraryPopup;
