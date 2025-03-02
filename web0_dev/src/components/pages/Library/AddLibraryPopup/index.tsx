'use client';
import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';
import { createLibrary } from '@/actions/CRUDLibrary';
import { useRouter } from 'next/navigation';
import Dismiss from '@/svgs/Dismiss';
import { AddLibraryPopupProps, LibraryTypeOption } from './types';
import { DEFAULT_FILE_TEMPLATES } from './constants';
import { uploadMultipleToR2 } from '@/utils/cloudflareR2';

// Import SVG icons
import CodeSplit from '@/svgs/CodeSplit';
import CodeFull from '@/svgs/CodeFull';
import CodeCompiler from '@/svgs/CodeCompiler';
import ImageGallery from '@/svgs/ImageGallery';
import ImageCarousel from '@/svgs/ImageCarousel';
import ColorPalette from '@/svgs/ColorPalette';
import Label from '@/svgs/Label';
import Project from '@/svgs/Project';
import Category from '@/svgs/Category';
import Image from '@/svgs/Image';
import LibraryComponentSelector from './components/LibraryComponentSelector';
import CategorySelector from './components/CategorySelector';
import CoverImageUploader from './components/CoverImageUploader';
import TagSelector from './components/TagSelector';

const AddLibraryPopup: React.FC<AddLibraryPopupProps> = ({
	isOpen,
	onClose,
	categories,
	organizationId,
	projectId,
	libraryTags = [],
}) => {
	const router = useRouter();

	// Form data
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
	const [selectedComponentType, setSelectedComponentType] =
		useState<LibraryTypeOption['id']>('codeSplit');
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

	// Add upload progress state
	const [uploadProgress, setUploadProgress] = useState(0);

	// Tags state
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [isTagOpen, setIsTagOpen] = useState(false);
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);
	const [isComponentTypeOpen, setIsComponentTypeOpen] = useState(false);
	const [availableTags, setAvailableTags] = useState<string[]>(libraryTags);

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
			setSelectedCategoryId('');
			setSelectedComponentType('codeSplit');
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
					<div className={styles.tagPills}>
						<div
							className={styles.tagPill}
							style={{ backgroundColor: 'var(--orange-90)' }}
						/>
					</div>
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
			<>
				<span style={{ color: coverImage ? 'var(--main)' : 'var(--main-65)' }}>
					Cover Image
				</span>
			</>
		);
	};

	const getComponentTypeColor = () => {
		return 'var(--main)';
	};

	const getComponentTypeText = () => {
		const option = libraryTypeOptions.find(
			(opt) => opt.id === selectedComponentType
		);
		return option ? option.name : 'Select Component Type';
	};

	const handleAddNewTag = (tag: string) => {
		// First, add the tag client-side
		if (!availableTags.includes(tag)) {
			setAvailableTags([...availableTags, tag]);
		}
		// The server-side update will happen when the form is submitted via createLibrary action
	};

	const handleSubmit = async () => {
		if (!organizationId || !title || !selectedComponentType) return;

		setIsSubmitting(true);
		setUploadProgress(0);

		try {
			let imageUrls: string[] = [];
			let colorData: { name: string; hex: string }[] = [];
			let coverImageUrl: string | undefined;

			// Handle cover image upload
			if (coverImage) {
				try {
					const uploadResult = await uploadMultipleToR2(
						[coverImage],
						'library',
						(progress) => {
							setUploadProgress(progress * 0.3); // 30% of progress for cover image
						}
					);

					// Handle the upload result safely
					if (
						uploadResult &&
						typeof uploadResult === 'object' &&
						'urls' in uploadResult &&
						Array.isArray(uploadResult.urls)
					) {
						coverImageUrl = uploadResult.urls[0];
					}
				} catch (error) {
					console.error('Error uploading cover image:', error);
				}
			}

			// Handle image uploads for image-based components
			if (
				(selectedComponentType === 'imageV1' ||
					selectedComponentType === 'imageV2') &&
				selectedImages.length > 0
			) {
				try {
					const uploadResult = await uploadMultipleToR2(
						selectedImages,
						'library',
						(progress) => {
							setUploadProgress(30 + progress * 0.7); // Remaining 70% of progress
						}
					);

					// Handle the upload result safely
					if (
						uploadResult &&
						typeof uploadResult === 'object' &&
						'urls' in uploadResult &&
						Array.isArray(uploadResult.urls)
					) {
						imageUrls = uploadResult.urls;
					}
				} catch (error) {
					console.error('Error uploading images:', error);
				}
			}

			// Handle color palette data
			if (selectedComponentType === 'color' && extractedColors.length > 0) {
				colorData = extractedColors.map(([name, hex]) => ({ name, hex }));
			}

			// Create the library item with safe type handling
			// This will also update the organization's libraryTags on the server side
			const result = await createLibrary({
				title,
				description,
				categoryId: selectedCategoryId || undefined,
				componentType: selectedComponentType,
				organizationId,
				projectId: projectId || '',
				codeFiles: Object.keys(codeFiles).length > 0 ? codeFiles : undefined,
				imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
				colorPalette: colorData.length > 0 ? colorData : undefined,
				tags: selectedTags.length > 0 ? selectedTags : undefined,
				coverImageUrl,
			});

			if (result.error) {
				console.error('Error creating library item:', result.error);
			} else {
				// If we added new tags, update the organization's libraryTags
				if (selectedTags.some((tag) => !libraryTags.includes(tag))) {
					// This would be handled by the server action that updates the organization
					console.log(
						'New tags added:',
						selectedTags.filter((tag) => !libraryTags.includes(tag))
					);
				}

				router.refresh();
				onClose();
			}
		} catch (error) {
			console.error('Error in handleSubmit:', error);
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

							<div
								className={styles.option}
								onClick={() =>
									setIsCoverImageUploaderVisible(!isCoverImageUploaderVisible)
								}
							>
								<Image
									fill={coverImage ? 'var(--main)' : 'var(--main-65)'}
									width="16"
									height="16"
								/>
								{getCoverImageDisplay()}
							</div>

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

								{isCategoryOpen && (
									<CategorySelector
										categories={categories}
										selectedCategoryId={selectedCategoryId}
										setSelectedCategoryId={setSelectedCategoryId}
										setIsCategoryOpen={setIsCategoryOpen}
									/>
								)}
							</div>
						</div>
					</div>

					{isComponentTypeOpen && (
						<LibraryComponentSelector
							libraryTypeOptions={libraryTypeOptions}
							selectedComponentType={selectedComponentType}
							setSelectedComponentType={setSelectedComponentType}
							activeCategory={activeCategory}
							setActiveCategory={setActiveCategory}
							setIsComponentTypeOpen={setIsComponentTypeOpen}
						/>
					)}

					{isCoverImageUploaderVisible && (
						<CoverImageUploader
							setCoverImage={setCoverImage}
							coverImage={coverImage}
						/>
					)}

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
									{isSubmitting
										? `Creating... ${
												uploadProgress > 0
													? `(${Math.round(uploadProgress)}%)`
													: ''
										  }`
										: 'Create Library Item'}
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
