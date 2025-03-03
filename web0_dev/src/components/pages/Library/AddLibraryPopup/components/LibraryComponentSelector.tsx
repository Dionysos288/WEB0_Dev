import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './LibraryComponentSelector.module.scss';
import { LibraryTypeOption } from '../types';
import ImageIcon from '@/svgs/Image';
import ColorPalette from '@/svgs/ColorPalette';

interface LibraryComponentSelectorProps {
	libraryTypeOptions: LibraryTypeOption[];
	selectedComponentType: string;
	setSelectedComponentType: (id: LibraryTypeOption['id']) => void;
	activeCategory: 'code' | 'design';
	setActiveCategory: (category: 'code' | 'design') => void;
	setIsComponentTypeOpen: React.Dispatch<React.SetStateAction<boolean>>;
	selectedImages?: File[];
	setSelectedImages?: (files: File[]) => void;
	coverImage?: File | null;
	setCoverImage?: (file: File | null) => void;
	extractedColors?: Array<[string, string]>;
	setExtractedColors?: (colors: Array<[string, string]>) => void;
}

const LibraryComponentSelector: React.FC<LibraryComponentSelectorProps> = ({
	libraryTypeOptions,
	selectedComponentType,
	setSelectedComponentType,
	activeCategory,
	setActiveCategory,
	setIsComponentTypeOpen,
	selectedImages = [],
	setSelectedImages = () => {},
	coverImage = null,
	setCoverImage = () => {},
	extractedColors = [],
	setExtractedColors = () => {},
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const selectorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (selectorRef.current) {
			selectorRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, []);

	// Determine initial step based on whether a design component is already selected
	const isDesignComponent =
		libraryTypeOptions.find((opt) => opt.id === selectedComponentType)
			?.category === 'design';

	const [currentStep, setCurrentStep] = useState<1 | 2>(
		isDesignComponent && selectedComponentType ? 2 : 1
	);
	const [selectedType, setSelectedType] = useState<string | null>(null);
	const [transitioning, setTransitioning] = useState(false);
	const [editingColorIndex, setEditingColorIndex] = useState<number | null>(
		null
	);
	const [editingColorName, setEditingColorName] = useState('');
	const [editingColorHex, setEditingColorHex] = useState('');
	const colorInputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	// Update selectedType when selectedComponentType changes
	useEffect(() => {
		if (selectedComponentType) {
			setSelectedType(selectedComponentType);
		}
	}, [selectedComponentType]);

	const handleSelectType = (typeId: LibraryTypeOption['id']) => {
		setSelectedType(typeId);

		// If it's a code component, finish immediately
		const option = libraryTypeOptions.find((opt) => opt.id === typeId);
		if (option?.category === 'code') {
			setSelectedComponentType(typeId);
			setIsComponentTypeOpen(false);
		}
	};

	const handleNextStep = () => {
		if (currentStep === 1 && selectedType) {
			// Only proceed to step 2 if a design component is selected
			const option = libraryTypeOptions.find((opt) => opt.id === selectedType);
			if (option?.category === 'design') {
				setTransitioning(true);
				setTimeout(() => {
					setCurrentStep(2);
					setSelectedComponentType(selectedType);
					setTransitioning(false);
				}, 150);
			} else {
				// For code components, just close the selector
				setSelectedComponentType(selectedType);
				setIsComponentTypeOpen(false);
			}
		} else if (currentStep === 2) {
			// Finish the selection process
			setIsComponentTypeOpen(false);
		}
	};

	const handleBackStep = () => {
		if (currentStep === 2) {
			setTransitioning(true);
			// Reset images when going back
			setSelectedImages([]);
			setCoverImage(null);
			setExtractedColors([]);

			setTimeout(() => {
				setCurrentStep(1);
				setTransitioning(false);
			}, 150);
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const newFiles = Array.from(e.target.files);

			// Limit to 15 images total
			const totalImages = [...selectedImages, ...newFiles];
			if (totalImages.length > 15) {
				const remainingSlots = Math.max(0, 15 - selectedImages.length);
				const filesToAdd = newFiles.slice(0, remainingSlots);

				setSelectedImages([...selectedImages, ...filesToAdd]);

				if (remainingSlots === 0) {
					alert('Maximum of 15 images reached. No more images can be added.');
				} else {
					alert(
						`Maximum of 15 images allowed. Only added ${remainingSlots} of ${newFiles.length} selected images.`
					);
				}
			} else {
				setSelectedImages(totalImages);
			}

			// If it's a color palette component, extract colors from the first image
			if (
				selectedType === 'color' &&
				newFiles.length > 0 &&
				extractedColors.length === 0
			) {
				extractColorsFromImage(newFiles[0]);
			}
		}
	};

	const extractColorsFromImage = (file: File) => {
		const img = document.createElement('img');
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		img.onload = () => {
			if (!ctx) return;

			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0, img.width, img.height);

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const pixels = imageData.data;

			// Count color occurrences
			const colorCount: Record<string, number> = {};

			for (let i = 0; i < pixels.length; i += 4) {
				const r = pixels[i];
				const g = pixels[i + 1];
				const b = pixels[i + 2];

				// Skip transparent pixels
				if (pixels[i + 3] < 128) continue;

				// Convert to hex
				const hex = rgbToHex(r, g, b);

				// Count occurrences
				colorCount[hex] = (colorCount[hex] || 0) + 1;
			}

			// Sort colors by occurrence and take top 6
			const sortedColors = Object.entries(colorCount)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 6)
				.map(([hex]) => hex);

			// Generate color names
			const colors: Array<[string, string]> = sortedColors.map((hex, index) => {
				return [`Color ${index + 1}`, hex];
			});

			setExtractedColors(colors);
		};

		img.src = URL.createObjectURL(file);
	};

	const rgbToHex = (r: number, g: number, b: number): string => {
		return (
			'#' +
			[r, g, b]
				.map((x) => {
					const hex = x.toString(16);
					return hex.length === 1 ? '0' + hex : hex;
				})
				.join('')
		);
	};

	const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragging(false);

			if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
				const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
					file.type.startsWith('image/')
				);

				if (newFiles.length > 0) {
					// Limit to 15 images total
					const totalImages = [...selectedImages, ...newFiles];
					if (totalImages.length > 15) {
						const remainingSlots = Math.max(0, 15 - selectedImages.length);
						const filesToAdd = newFiles.slice(0, remainingSlots);

						setSelectedImages([...selectedImages, ...filesToAdd]);

						if (remainingSlots === 0) {
							alert(
								'Maximum of 15 images reached. No more images can be added.'
							);
						} else {
							alert(
								`Maximum of 15 images allowed. Only added ${remainingSlots} of ${newFiles.length} dropped images.`
							);
						}
					} else {
						setSelectedImages(totalImages);
					}

					// If it's a color palette component, extract colors from the first image
					if (
						selectedType === 'color' &&
						newFiles.length > 0 &&
						extractedColors.length === 0
					) {
						extractColorsFromImage(newFiles[0]);
					}
				}
			}
		},
		[
			selectedImages,
			setSelectedImages,
			selectedType,
			extractedColors,
			setExtractedColors,
		]
	);

	const handleRemoveImage = (index: number) => {
		const newImages = [...selectedImages];
		newImages.splice(index, 1);
		setSelectedImages(newImages);

		// If the removed image was the cover image, reset the cover image
		if (coverImage && selectedImages[index] === coverImage) {
			setCoverImage(null);
		}
	};

	const handleSetAsCover = (file: File) => {
		// If the file is already the cover image, deselect it
		if (coverImage === file) {
			setCoverImage(null);
		} else {
			setCoverImage(file);
		}
	};

	const handleAddColor = () => {
		if (extractedColors.length < 10) {
			setExtractedColors([
				...extractedColors,
				[`Color ${extractedColors.length + 1}`, '#CCCCCC'],
			]);
		}
	};

	const handleRemoveColor = (index: number) => {
		const newColors = [...extractedColors];
		newColors.splice(index, 1);
		setExtractedColors(newColors);
	};

	const handleEditColor = (index: number) => {
		setEditingColorIndex(index);
		setEditingColorName(extractedColors[index][0]);
		setEditingColorHex(extractedColors[index][1]);
	};

	const handleSaveColor = () => {
		if (editingColorIndex !== null) {
			const newColors = [...extractedColors];
			newColors[editingColorIndex] = [editingColorName, editingColorHex];
			setExtractedColors(newColors);
			setEditingColorIndex(null);
		}
	};

	const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditingColorHex(e.target.value);
	};

	const renderStep1 = () => (
		<>
			<div className={styles.topPart}>
				<h3>Component Type</h3>
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
			</div>

			<div className={styles.componentOptions}>
				{libraryTypeOptions
					.filter((option) => option.category === activeCategory)
					.map((option) => (
						<div
							key={option.id}
							className={`${styles.componentOption} ${
								selectedType === option.id ? styles.selected : ''
							}`}
							onClick={() => handleSelectType(option.id)}
						>
							<div className={styles.optionIcon}>
								<option.icon
									width="24"
									height="24"
									fill={
										selectedType === option.id
											? 'var(--orange-90)'
											: 'var(--main-75)'
									}
								/>
							</div>
							<div className={styles.optionContent}>
								<h4>{option.name}</h4>
								<p>{option.description}</p>
							</div>
						</div>
					))}
			</div>
		</>
	);

	const renderStep2 = () => {
		const isColorPalette = selectedType === 'color';

		return (
			<>
				<div className={styles.topPart}>
					<h3>
						{selectedType === 'imageV1' || selectedType === 'imageV2'
							? 'Upload Images'
							: 'Color Palette'}
					</h3>
					{selectedImages.length > 0 && (
						<div className={styles.imageCounter}>
							{selectedImages.length} / 15 images
						</div>
					)}
				</div>

				<div
					className={`${styles.uploadArea} ${
						isDragging ? styles.dragging : ''
					}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					{selectedImages.length === 0 ? (
						<div className={styles.emptyUpload}>
							{selectedType === 'color' ? (
								<ColorPalette width="32" height="32" fill="var(--main-65)" />
							) : (
								<ImageIcon width="32" height="32" fill="var(--main-65)" />
							)}
							<p>
								{selectedType === 'color'
									? 'Upload an image to extract colors'
									: 'Upload images for your gallery'}
							</p>
							{selectedType === 'color' && (
								<p className={styles.colorHint}>
									Colors will be automatically extracted from your image
								</p>
							)}
							<button
								className={styles.uploadButton}
								onClick={() => fileInputRef.current?.click()}
							>
								Select Files
							</button>
						</div>
					) : (
						<div className={styles.imageGrid}>
							{selectedImages.map((file, index) => (
								<div
									key={`${file.name}-${index}`}
									className={`${styles.imageItem} ${
										coverImage === file ? styles.coverImage : ''
									}`}
								>
									<div className={styles.imagePreview}>
										<img
											src={URL.createObjectURL(file)}
											alt={`Upload ${index + 1}`}
										/>
										{coverImage === file && (
											<div className={styles.coverBadge}>Cover</div>
										)}
									</div>
									<div className={styles.imageActions}>
										<button
											className={styles.setCoverButton}
											onClick={() => handleSetAsCover(file)}
										>
											{coverImage === file ? 'Remove Cover' : 'Set as Cover'}
										</button>
										<button
											className={styles.removeButton}
											onClick={() => handleRemoveImage(index)}
										>
											Remove
										</button>
									</div>
								</div>
							))}
							{selectedImages.length < 15 ? (
								<div
									className={styles.addMoreItem}
									onClick={() => fileInputRef.current?.click()}
									onDrop={handleDrop}
									onDragOver={handleDragOver}
								>
									<div className={styles.addMoreIcon}>
										<span>+</span>
									</div>
									<p>Add More</p>
								</div>
							) : null}
						</div>
					)}

					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileSelect}
						accept="image/*"
						multiple
						className={styles.fileInput}
					/>
				</div>

				{selectedImages.length === 0 && (
					<div className={styles.warningMessage}>
						Please upload at least one image to continue
					</div>
				)}

				{selectedImages.length >= 15 && (
					<div className={styles.warningMessage}>
						Maximum of 15 images reached. No more images allowed.
					</div>
				)}

				{isColorPalette && (
					<div className={styles.colorPaletteSection}>
						<div className={styles.colorPaletteHeader}>
							<h3>Color Palette</h3>
							{extractedColors.length < 10 && (
								<button
									className={styles.addColorButton}
									onClick={handleAddColor}
								>
									Add Color
								</button>
							)}
						</div>

						{extractedColors.length > 0 ? (
							<div className={styles.colorGrid}>
								{extractedColors.map(([name, hex], index) => (
									<div
										key={`color-${index}`}
										className={styles.colorItem}
										onClick={() => handleEditColor(index)}
									>
										<div
											className={styles.colorSwatch}
											style={{ backgroundColor: hex }}
										/>
										<div className={styles.colorInfo}>
											<span className={styles.colorName}>{name}</span>
											<span className={styles.colorHex}>{hex}</span>
										</div>
										<button
											className={styles.removeColorButton}
											onClick={(e) => {
												e.stopPropagation();
												handleRemoveColor(index);
											}}
										>
											×
										</button>
									</div>
								))}
							</div>
						) : (
							<div className={styles.emptyColors}>
								<ColorPalette width="32" height="32" fill="var(--main-40)" />
								<p>No colors added yet</p>
								<button
									className={styles.addColorButton}
									onClick={handleAddColor}
								>
									Add Color Manually
								</button>
							</div>
						)}

						{editingColorIndex !== null && (
							<div className={styles.colorEditor}>
								<div className={styles.colorEditorHeader}>
									<h4>Edit Color</h4>
									<button
										className={styles.closeEditorButton}
										onClick={() => setEditingColorIndex(null)}
									>
										×
									</button>
								</div>
								<div className={styles.colorEditorForm}>
									<div className={styles.formGroup}>
										<label>Color Name</label>
										<input
											type="text"
											value={editingColorName}
											onChange={(e) => setEditingColorName(e.target.value)}
										/>
									</div>
									<div className={styles.formGroup}>
										<label>Color Value</label>
										<div className={styles.colorPickerWrapper}>
											<input
												type="color"
												ref={colorInputRef}
												value={editingColorHex}
												onChange={handleColorPickerChange}
											/>
											<input
												type="text"
												value={editingColorHex}
												onChange={(e) => setEditingColorHex(e.target.value)}
											/>
										</div>
									</div>
									<button
										className={styles.saveColorButton}
										onClick={handleSaveColor}
									>
										Save Color
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</>
		);
	};

	return (
		<div
			className={`${styles.componentSelector} ${
				transitioning ? styles.transitioning : ''
			}`}
			ref={selectorRef}
		>
			<div className={styles.contentWrapper}>
				{currentStep === 1 ? renderStep1() : renderStep2()}
			</div>

			<div className={styles.selectorFooter}>
				{currentStep === 2 && (
					<button className={styles.backButton} onClick={handleBackStep}>
						Back
					</button>
				)}

				{(currentStep === 2 ||
					(currentStep === 1 &&
						selectedType &&
						libraryTypeOptions.find((opt) => opt.id === selectedType)
							?.category === 'design')) && (
					<button
						className={styles.nextButton}
						onClick={handleNextStep}
						disabled={
							(currentStep === 1 && !selectedType) ||
							(currentStep === 2 && selectedImages.length === 0) ||
							(currentStep === 2 &&
								selectedType === 'color' &&
								extractedColors.length === 0)
						}
					>
						{currentStep === 1 ? 'Next' : 'Done'}
					</button>
				)}
			</div>
		</div>
	);
};

export default LibraryComponentSelector;
