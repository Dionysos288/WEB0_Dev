import * as React from 'react';
import { toast } from 'sonner';

export interface UploadedFile {
	url: string;
	name: string;
	size: number;
	type: string;
}

interface UseUploadFileProps {
	onUploadComplete?: (file: UploadedFile) => void;
	onUploadError?: (error: unknown) => void;
	onUploadProgress?: (progress: number) => void;
}

export function useUploadFile({
	onUploadComplete,
	onUploadError,
	onUploadProgress,
}: UseUploadFileProps = {}) {
	const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
	const [uploadingFile, setUploadingFile] = React.useState<File>();
	const [progress, setProgress] = React.useState<number>(0);
	const [isUploading, setIsUploading] = React.useState(false);

	async function uploadToR2(file: File, path: string) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('path', path);

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`Upload failed: ${response.statusText}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			throw error;
		}
	}

	async function uploadFile(file: File) {
		setIsUploading(true);
		setUploadingFile(file);

		try {
			// Simulate upload progress since R2 doesn't provide progress
			const progressInterval = setInterval(() => {
				setProgress((prev) => {
					const next = Math.min(prev + 10, 90);
					onUploadProgress?.(next);
					return next;
				});
			}, 100);

			// Generate a unique path for the file
			const timestamp = Date.now();
			const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
			const path = `uploads/${timestamp}-${safeName}`;

			const result = await uploadToR2(file, path);

			clearInterval(progressInterval);

			if (!result.success) {
				throw new Error(result.message || 'Upload failed');
			}

			const uploadedFile: UploadedFile = {
				url: result.url,
				name: file.name,
				size: file.size,
				type: file.type,
			};

			setUploadedFile(uploadedFile);
			setProgress(100);
			onUploadProgress?.(100);
			onUploadComplete?.(uploadedFile);

			return uploadedFile;
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			toast.error(errorMessage);
			onUploadError?.(error);
			throw error;
		} finally {
			setProgress(0);
			setIsUploading(false);
			setUploadingFile(undefined);
		}
	}

	return {
		isUploading,
		progress,
		uploadedFile,
		uploadFile,
		uploadingFile,
	};
}

export function getErrorMessage(err: unknown): string {
	if (err instanceof Error) {
		return err.message;
	}
	return 'Something went wrong, please try again later.';
}

export function showErrorToast(err: unknown) {
	const errorMessage = getErrorMessage(err);
	return toast.error(errorMessage);
}
