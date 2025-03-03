import React, { useState, useRef, useEffect } from 'react';
import styles from './CoverImageUploader.module.scss';
import Image from 'next/image';
import { toast } from 'sonner';

interface CoverImageUploaderProps {
	setCoverImage: (file: File | null) => void;
	coverImage: File | null;
}

const CoverImageUploader: React.FC<CoverImageUploaderProps> = ({
	setCoverImage,
	coverImage,
}) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const dropZoneRef = useRef<HTMLDivElement>(null);

	const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
	const ALLOWED_TYPES = [
		'image/jpeg',
		'image/png',
		'image/gif',
		'video/mp4',
		'video/quicktime',
		'video/webm',
	];

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

	const validateFile = (file: File): boolean => {
		if (file.size > MAX_FILE_SIZE) {
			toast.error('File size must be less than 5MB');
			return false;
		}

		if (!ALLOWED_TYPES.includes(file.type)) {
			toast.error(
				'Only images (JPEG, PNG, GIF) and videos (MP4, MOV, WebM) are allowed'
			);
			return false;
		}

		return true;
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		if (file && validateFile(file)) {
			setCoverImage(file);
		}
	};

	const handleRemoveFile = () => {
		setCoverImage(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const file = e.dataTransfer.files[0];
		if (file && validateFile(file)) {
			setCoverImage(file);
		}
	};

	const isVideo = coverImage?.type.startsWith('video/');

	return (
		<div
			className={styles.coverImageUploader}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			ref={dropZoneRef}
		>
			{previewUrl ? (
				<div className={`${styles.previewContainer} `}>
					<div className={styles.mediaPreview}>
						{isVideo ? (
							<video
								ref={videoRef}
								src={previewUrl}
								controls
								muted
								loop
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						) : (
							<Image
								src={previewUrl}
								alt="Cover preview"
								fill
								style={{ objectFit: 'cover' }}
							/>
						)}
					</div>
					<button
						type="button"
						className={styles.removeButton}
						onClick={handleRemoveFile}
					>
						Remove
					</button>
				</div>
			) : (
				<div
					className={`${styles.uploadContainer} ${
						isDragging ? styles.dragging : ''
					}`}
				>
					<button
						type="button"
						className={styles.uploadButton}
						onClick={() => fileInputRef.current?.click()}
					>
						Select Media
					</button>
					<p className={styles.uploadHint}>
						Images or videos up to 5MB
						<br />
						Recommended size: 1200 x 630px
					</p>
				</div>
			)}

			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileSelect}
				accept="image/*,video/*"
				className={styles.fileInput}
			/>
		</div>
	);
};

export default CoverImageUploader;
