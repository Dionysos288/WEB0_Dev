import React, { useState, useRef, useEffect } from 'react';
import styles from './CoverImageUploader.module.scss';
import Image from 'next/image';

interface CoverImageUploaderProps {
	setCoverImage: (file: File | null) => void;
	coverImage: File | null;
}

const CoverImageUploader: React.FC<CoverImageUploaderProps> = ({
	setCoverImage,
	coverImage,
}) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Update preview URL when coverImage changes
	useEffect(() => {
		if (coverImage) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string);
			};
			reader.readAsDataURL(coverImage);
		} else {
			setPreviewUrl(null);
		}
	}, [coverImage]);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		if (file) {
			setCoverImage(file);
		}
	};

	const handleRemoveImage = () => {
		setCoverImage(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<div className={styles.coverImageUploader}>
			{previewUrl ? (
				<div className={styles.previewContainer}>
					<div className={styles.imagePreview}>
						<Image
							src={previewUrl}
							alt="Cover preview"
							fill
							style={{ objectFit: 'cover' }}
						/>
					</div>
					<button
						type="button"
						className={styles.removeButton}
						onClick={handleRemoveImage}
					>
						Remove
					</button>
				</div>
			) : (
				<div className={styles.uploadContainer}>
					<button
						type="button"
						className={styles.uploadButton}
						onClick={() => fileInputRef.current?.click()}
					>
						Select Image
					</button>
					<p className={styles.uploadHint}>Recommended size: 1200 x 630px</p>
				</div>
			)}

			<input
				type="file"
				ref={fileInputRef}
				onChange={handleImageSelect}
				accept="image/*"
				className={styles.fileInput}
			/>
		</div>
	);
};

export default CoverImageUploader;
