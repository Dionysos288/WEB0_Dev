'use client';
import styles from './AddLibraryPopup.module.scss';
import React, { useEffect, useState, useRef } from 'react';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';
import { createLibrary } from '@/actions/CRUDLibrary';
import { useRouter } from 'next/navigation';
import Dismiss from '@/svgs/Dismiss';
import { motion, AnimatePresence } from 'motion/react';
import ArrowLineRight from '@/svgs/ArrowLineRight';
import { ExtendedCategory } from '@/components/types/types';
import ClipboardText from '@/svgs/ClipboardText';
import CodeSplit from '@/svgs/CodeSplit';
import CodeFull from '@/svgs/CodeFull';
import CodeCompiler from '@/svgs/CodeCompiler';
import ImageGallery from '@/svgs/ImageGallery';
import ImageCarousel from '@/svgs/ImageCarousel';
import ColorPalette from '@/svgs/ColorPalette';
import Image from 'next/image';

interface AddLibraryPopupProps {
	isOpen: boolean;
	onClose: () => void;
	libraryTypeId: string;
	categories: ExtendedCategory[];
	organizationId: string;
	projectId?: string;
}

// Library component type definition
interface LibraryTypeOption {
	id:
		| 'imageV1'
		| 'imageV2'
		| 'color'
		| 'codefull'
		| 'codeSplit'
		| 'codeCompiler';
	name: string;
	description: string;
	icon: React.FC<{ width?: string; height?: string; fill?: string }>;
	category: 'code' | 'design';
}

const AddLibraryPopup: React.FC<AddLibraryPopupProps> = ({
	isOpen,
	onClose,
	libraryTypeId,
	categories,
	organizationId,
	projectId,
}) => {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Step management
	const [currentStep, setCurrentStep] = useState(1);
	const totalSteps = 4;

	// Form data
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
	const [selectedComponentType, setSelectedComponentType] =
		useState<LibraryTypeOption['id']>('codeSplit');
	const [activeCategory, setActiveCategory] = useState<'code' | 'design'>(
		'code'
	);

	// Additional configurations for each type
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
	const [extractedColors, setExtractedColors] = useState<
		Array<[string, string]>
	>([]);

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
			setCurrentStep(1);
			setTitle('');
			setDescription('');
			setSelectedCategoryId('');
			setSelectedComponentType('codeSplit');
			setActiveCategory('code');
			setSelectedImages([]);
			setImagePreviewUrls([]);
			setExtractedColors([]);
		}
	}, [isOpen]);

	// Handle step navigation
	const nextStep = () => {
		if (currentStep < totalSteps) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	// Handle image selection
	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const fileArray = Array.from(e.target.files).slice(0, 15);
			setSelectedImages(fileArray);

			const fileURLs = fileArray.map((file) => URL.createObjectURL(file));
			setImagePreviewUrls(fileURLs);

			// If color type is selected, extract colors from the first image
			if (selectedComponentType === 'color' && fileArray.length > 0) {
				extractColorsFromImage(fileURLs[0]);
			}
		}
	};

	// Simulate color extraction from image
	const extractColorsFromImage = (imageURL: string) => {
		// In a real implementation, this would use a color extraction algorithm or API
		// For now, we'll simulate with some predefined colors
		console.log(`Extracting colors from image: ${imageURL}`);
		const sampleColors: Array<[string, string]> = [
			['Primary', '#3B82F6'],
			['Secondary', '#10B981'],
			['Accent', '#F59E0B'],
			['Background', '#F3F4F6'],
			['Text', '#1F2937'],
		];

		setExtractedColors(sampleColors);
	};

	// Add a new color to the palette
	const addNewColor = () => {
		setExtractedColors([...extractedColors, ['New Color', '#CCCCCC']]);
	};

	// Update color name or hex value
	const updateColor = (index: number, field: 'name' | 'hex', value: string) => {
		const updatedColors = [...extractedColors];
		if (field === 'name') {
			updatedColors[index][0] = value;
		} else {
			updatedColors[index][1] = value;
		}
		setExtractedColors(updatedColors);
	};

	// Remove a color from the palette
	const removeColor = (index: number) => {
		const updatedColors = [...extractedColors];
		updatedColors.splice(index, 1);
		setExtractedColors(updatedColors);
	};

	// Category rendering helper
	const renderCategoryOptions = (cats: ExtendedCategory[], depth = 0) => {
		return cats.map((category) => (
			<div key={category.id} className={styles.categoryGroup}>
				<div
					className={`${styles.categoryOption} ${
						selectedCategoryId === category.id ? styles.selected : ''
					}`}
					onClick={() => setSelectedCategoryId(category.id)}
					style={{ paddingLeft: `${depth * 16 + 12}px` }}
				>
					<span>{category.name}</span>
				</div>

				{category.subcategories && category.subcategories.length > 0 && (
					<div className={styles.subcategories}>
						{renderCategoryOptions(category.subcategories, depth + 1)}
					</div>
				)}
			</div>
		));
	};

	// Handle form submission
	const handleSubmit = async () => {
		if (!title || !selectedCategoryId || !selectedComponentType) return;

		// For a real implementation, you would upload images and save color data here
		const libraryData = {
			title,
			description,
			url: '', // No longer collecting URL in first step
			libraryTypeId,
			categoryId: selectedCategoryId,
			component: selectedComponentType as
				| 'imageV1'
				| 'imageV2'
				| 'color'
				| 'codefull'
				| 'codeSplit', // Cast to the expected type
			organizationId,
			projectId,
			// In a real implementation, you would include:
			// images: selectedImages (after uploading to storage)
			// colors: extractedColors (if color type selected)
		};

		const { success, error } = await createLibrary(libraryData);

		if (success) {
			router.refresh();
			onClose();
		} else {
			console.error('Error creating library item:', error);
			// Could add error handling UI here
		}
	};

	// Determine if we can proceed to next step
	const canProceedToNextStep = () => {
		if (currentStep === 1) {
			return title.trim().length > 0;
		}
		if (currentStep === 2) {
			return true; // Component type is pre-selected
		}
		if (currentStep === 3) {
			// Type-specific validation
			if (
				selectedComponentType === 'imageV1' ||
				selectedComponentType === 'imageV2'
			) {
				return selectedImages.length > 0;
			}
			if (selectedComponentType === 'color') {
				return extractedColors.length > 0;
			}
			return true;
		}
		if (currentStep === 4) {
			return selectedCategoryId !== '';
		}
		return true;
	};

	// Render type-specific configuration options for images
	const renderImageUploader = () => {
		return (
			<div className={styles.imageUploader}>
				<h3>Upload Images</h3>
				<p>
					Select up to 15 images for your{' '}
					{selectedComponentType === 'imageV1' ? 'gallery' : 'carousel'}
				</p>

				<div className={styles.uploadControls}>
					<button
						type="button"
						className={styles.uploadButton}
						onClick={() => fileInputRef.current?.click()}
					>
						Select Images
					</button>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						multiple
						onChange={handleImageSelect}
						style={{ display: 'none' }}
					/>
					<span className={styles.selectedCount}>
						{selectedImages.length === 0
							? 'No images selected'
							: `${selectedImages.length} image${
									selectedImages.length > 1 ? 's' : ''
							  } selected`}
					</span>
				</div>

				{imagePreviewUrls.length > 0 && (
					<div className={styles.imagePreviewGrid}>
						{imagePreviewUrls.map((url, index) => (
							<div key={index} className={styles.previewItem}>
								<Image src={url} alt={`Preview ${index + 1}`} fill />
								<button
									type="button"
									className={styles.removeButton}
									onClick={() => {
										setImagePreviewUrls(
											imagePreviewUrls.filter((_, i) => i !== index)
										);
										setSelectedImages(
											selectedImages.filter((_, i) => i !== index)
										);
									}}
								>
									×
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		);
	};

	// Render type-specific configuration options for colors
	const renderColorExtractor = () => {
		return (
			<div className={styles.colorExtractor}>
				<h3>Color Palette</h3>

				<div className={styles.colorTools}>
					<div>
						<p>
							Upload an image to extract colors or create a palette manually
						</p>
						<button
							type="button"
							className={styles.uploadButton}
							onClick={() => fileInputRef.current?.click()}
						>
							Upload Image for Colors
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageSelect}
							style={{ display: 'none' }}
						/>
					</div>

					<button
						type="button"
						className={styles.addColorButton}
						onClick={addNewColor}
					>
						Add Color
					</button>
				</div>

				{imagePreviewUrls.length > 0 && (
					<div className={styles.sourceImagePreview}>
						<h4>Source Image</h4>
						<img src={imagePreviewUrls[0]} alt="Source for colors" />
					</div>
				)}

				{extractedColors.length > 0 && (
					<div className={styles.colorWrapper}>
						<h4>Colors</h4>
						<div className={styles.colorContainer}>
							{extractedColors.map((item, index) => (
								<div key={index} className={styles.color}>
									<div
										className={styles.background}
										style={{ backgroundColor: item[1] }}
									/>
									<div className={styles.info}>
										<div className={styles.leftSide}>
											<input
												type="text"
												value={item[0]}
												onChange={(e) =>
													updateColor(index, 'name', e.target.value)
												}
												className={styles.colorNameInput}
											/>
											<div className={styles.hexField}>
												<input
													type="text"
													value={item[1]}
													onChange={(e) =>
														updateColor(index, 'hex', e.target.value)
													}
													className={styles.colorHexInput}
												/>
												<button
													className={styles.copyButton}
													onClick={() => navigator.clipboard.writeText(item[1])}
												>
													<ClipboardText
														width="18"
														height="18"
														fill="var(--main-60)"
													/>
												</button>
											</div>
										</div>
										<button
											className={styles.removeColorButton}
											onClick={() => removeColor(index)}
										>
											×
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		);
	};

	// Render type-specific configuration options for code
	const renderCodeConfig = () => {
		return (
			<div className={styles.codeConfig}>
				<h3>Code Configuration</h3>
				<p>
					Your{' '}
					{selectedComponentType === 'codeSplit'
						? 'website code split view'
						: selectedComponentType === 'codeCompiler'
						? 'interactive code compiler'
						: 'full code block'}{' '}
					will be set up after creation.
				</p>

				<div className={styles.codePreview}>
					<div className={styles.previewContent}>
						{selectedComponentType === 'codeSplit' && (
							<div className={styles.splitPreview}>
								<div className={styles.codeSection}>
									<div className={styles.codeLine}>
										<span className={styles.keyword}>function</span>{' '}
										<span className={styles.funcName}>App</span>() {`{`}
									</div>
									<div className={styles.codeLine}>
										{' '}
										<span className={styles.keyword}>return</span> (
									</div>
									<div className={styles.codeLine}>
										{' '}
										{`<`}
										<span className={styles.component}>div</span>
										{` className="app">`}
									</div>
									<div className={styles.codeLine}>
										{' '}
										{`<`}
										<span className={styles.component}>h1</span>
										{`>`}React Counter{`</`}
										<span className={styles.component}>h1</span>
										{`>`}
									</div>
								</div>
								<div className={styles.resultSection}>
									<div className={styles.previewHeader}>Result</div>
									<div className={styles.previewResult}>
										<h3>React Counter</h3>
									</div>
								</div>
							</div>
						)}

						{selectedComponentType === 'codefull' && (
							<div className={styles.fullPreview}>
								<div className={styles.codeLine}>
									<span className={styles.keyword}>function</span>{' '}
									<span className={styles.funcName}>calculateTotal</span>(
									<span className={styles.param}>items</span>) {`{`}
								</div>
								<div className={styles.codeLine}>
									{' '}
									<span className={styles.keyword}>return</span>{' '}
									items.reduce((sum, item) {`=>`} {`{`}
								</div>
								<div className={styles.codeLine}>
									{' '}
									<span className={styles.keyword}>return</span> sum +
									item.price * item.quantity;
								</div>
								<div className={styles.codeLine}> {`}`}, 0);</div>
								<div className={styles.codeLine}>{`}`}</div>
							</div>
						)}

						{selectedComponentType === 'codeCompiler' && (
							<div className={styles.compilerPreview}>
								<div className={styles.codeSection}>
									<div className={styles.codeLine}>
										<span className={styles.keyword}>def</span>{' '}
										<span className={styles.funcName}>fibonacci</span>(n):
									</div>
									<div className={styles.codeLine}>
										{' '}
										<span className={styles.keyword}>if</span> n {`<=`} 1:
									</div>
									<div className={styles.codeLine}>
										{' '}
										<span className={styles.keyword}>return</span> n
									</div>
									<div className={styles.codeLine}>
										{' '}
										<span className={styles.keyword}>return</span>{' '}
										fibonacci(n-1) + fibonacci(n-2)
									</div>
								</div>
								<div className={styles.resultSection}>
									<div className={styles.previewHeader}>Output</div>
									<div className={styles.executionResult}>
										<div>fibonacci(10) = 55</div>
										<div className={styles.executionStats}>
											<span>Execution time: 0.002s</span>
											<span>Memory used: 42KB</span>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	};

	// Render type-specific configuration options
	const renderTypeSpecificConfig = () => {
		if (
			selectedComponentType === 'imageV1' ||
			selectedComponentType === 'imageV2'
		) {
			return renderImageUploader();
		}

		if (selectedComponentType === 'color') {
			return renderColorExtractor();
		}

		return renderCodeConfig();
	};

	if (!isOpen) return null;

	return (
		<div className={styles.popupWrapper}>
			<ClickOutsideWrapper onClose={onClose} closeOnEsc={true}>
				<div className={styles.popup}>
					<button className={styles.dismissButton} onClick={onClose}>
						<Dismiss width="16" height="16" />
					</button>

					<div className={styles.header}>
						<h2>Add Library Item</h2>
						<div className={styles.stepIndicator}>
							<span>
								Step {currentStep} of {totalSteps}
							</span>
							<div className={styles.dots}>
								{Array.from({ length: totalSteps }).map((_, i) => (
									<div
										key={i}
										className={`${styles.dot} ${
											i + 1 === currentStep ? styles.active : ''
										}`}
									/>
								))}
							</div>
						</div>
					</div>

					<AnimatePresence mode="wait">
						{currentStep === 1 && (
							<motion.div
								key="step1"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{ duration: 0.2 }}
								className={styles.stepContent}
							>
								<div className={styles.inputWrapper}>
									<input
										type="text"
										placeholder="Library Item Title"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										className={styles.header}
										autoFocus
									/>
									<textarea
										placeholder="Library Item Description (Optional)"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										className={styles.description}
										rows={3}
									/>
								</div>
							</motion.div>
						)}

						{currentStep === 2 && (
							<motion.div
								key="step2"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.2 }}
								className={styles.stepContent}
							>
								<div className={styles.typeSelector}>
									<h3>Choose Library Type</h3>

									<div className={styles.categoryTabs}>
										<button
											className={`${styles.categoryTab} ${
												activeCategory === 'code' ? styles.active : ''
											}`}
											onClick={() => setActiveCategory('code')}
										>
											Code
										</button>
										<button
											className={`${styles.categoryTab} ${
												activeCategory === 'design' ? styles.active : ''
											}`}
											onClick={() => setActiveCategory('design')}
										>
											Design
										</button>
									</div>

									<div className={styles.typeOptions}>
										{libraryTypeOptions
											.filter((option) => option.category === activeCategory)
											.map((option) => (
												<div
													key={option.id}
													className={`${styles.typeOption} ${
														selectedComponentType === option.id
															? styles.selected
															: ''
													}`}
													onClick={() => setSelectedComponentType(option.id)}
												>
													<div className={styles.typeHeader}>
														<div className={styles.iconContainer}>
															<option.icon width="28" height="28" />
														</div>
														<h4>{option.name}</h4>
													</div>
													<p>{option.description}</p>
												</div>
											))}
									</div>
								</div>
							</motion.div>
						)}

						{currentStep === 3 && (
							<motion.div
								key="step3"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.2 }}
								className={styles.stepContent}
							>
								{renderTypeSpecificConfig()}
							</motion.div>
						)}

						{currentStep === 4 && (
							<motion.div
								key="step4"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.2 }}
								className={styles.stepContent}
							>
								<div className={styles.categorySelector}>
									<h3>Select Category</h3>
									<div className={styles.categoriesList}>
										{renderCategoryOptions(categories)}
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					<div className={styles.actions}>
						<div className={styles.navigation}>
							{currentStep > 1 && (
								<button
									type="button"
									className={styles.prevButton}
									onClick={prevStep}
								>
									<span>Back</span>
								</button>
							)}
						</div>

						<div className={styles.rightActions}>
							<button
								type="button"
								className={styles.cancelButton}
								onClick={onClose}
							>
								<span>Cancel</span>
							</button>

							{currentStep < totalSteps ? (
								<button
									type="button"
									className={`${styles.nextButton} ${
										!canProceedToNextStep() ? styles.disabled : ''
									}`}
									onClick={nextStep}
									disabled={!canProceedToNextStep()}
								>
									<span>Next</span>
									<ArrowLineRight width="16" height="16" fill="var(--white)" />
								</button>
							) : (
								<button
									type="button"
									className={`${styles.createButton} ${
										!canProceedToNextStep() ? styles.disabled : ''
									}`}
									onClick={handleSubmit}
									disabled={!canProceedToNextStep()}
								>
									<span>Create Item</span>
								</button>
							)}
						</div>
					</div>
				</div>
			</ClickOutsideWrapper>
		</div>
	);
};

export default AddLibraryPopup;
