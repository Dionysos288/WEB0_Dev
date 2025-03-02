import { v4 as uuidv4 } from 'uuid';

/**
 * Base URL for the Cloudflare R2 bucket
 */
const R2_BASE_URL = 'https://pub-fd01615382d74cf9899aac2d87560049.r2.dev';

/**
 * Generates a unique file path for storing in R2
 *
 * @param file - The file to upload
 * @param prefix - Optional folder prefix (e.g., 'library/', 'users/')
 * @returns A unique file path
 */
export const generateR2FilePath = (
	file: File,
	prefix: string = 'library/'
): string => {
	// Extract file extension
	const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

	// Generate a UUID for the file name to ensure uniqueness
	const uniqueId = uuidv4();

	// Create a clean file name with the original extension
	return `${prefix}${uniqueId}.${fileExtension}`;
};

/**
 * Uploads a file to Cloudflare R2 storage
 *
 * @param file - The file to upload
 * @param path - The path where the file should be stored (if not provided, one will be generated)
 * @param onProgress - Optional callback for upload progress
 * @returns Promise resolving to the public URL of the uploaded file
 */
export const uploadToR2 = async (
	file: File,
	path?: string,
	onProgress?: (progress: number) => void
): Promise<string> => {
	try {
		// Generate a path if not provided
		const filePath = path || generateR2FilePath(file);

		// Create form data for the upload
		const formData = new FormData();
		formData.append('file', file);
		formData.append('path', filePath);

		// Send the file to your API endpoint that handles R2 uploads
		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData,
		});

		if (!response.ok) {
			let errorMessage = 'Failed to upload file';
			// Try to get error message from response
			const errorData = await response.json().catch(() => ({}));
			errorMessage = errorData.message || errorMessage;
			throw new Error(errorMessage);
		}

		// Ensure the request was successful
		await response.json();

		// Call progress callback with 100% when done
		if (onProgress) {
			onProgress(100);
		}

		// Return the public URL of the uploaded file
		return `${R2_BASE_URL}/${filePath}`;
	} catch (error) {
		console.error('Error uploading to R2:', error);
		throw error;
	}
};

/**
 * Uploads multiple files to Cloudflare R2 storage with progress tracking
 *
 * @param files - Array of files to upload
 * @param prefix - Optional folder prefix
 * @param onProgress - Optional callback for overall upload progress
 * @returns Promise resolving to an array of public URLs of the uploaded files
 */
export const uploadMultipleToR2 = async (
	files: File[],
	prefix: string = 'library/',
	onProgress?: (progress: number) => void
): Promise<string[]> => {
	try {
		if (files.length === 0) return [];

		// Track progress for each file
		const progressMap = new Map<string, number>();
		files.forEach((file) => progressMap.set(file.name, 0));

		// Function to update progress for a specific file
		const updateFileProgress = (fileName: string, progress: number) => {
			progressMap.set(fileName, progress);

			// Calculate overall progress
			if (onProgress) {
				const totalProgress = Array.from(progressMap.values()).reduce(
					(sum, p) => sum + p,
					0
				);
				const overallProgress = totalProgress / files.length;
				onProgress(Math.round(overallProgress));
			}
		};

		// Upload all files in parallel
		const uploadPromises = files.map((file) => {
			const path = generateR2FilePath(file, prefix);
			return uploadToR2(file, path, (progress) =>
				updateFileProgress(file.name, progress)
			);
		});

		// Wait for all uploads to complete
		return await Promise.all(uploadPromises);
	} catch (error) {
		console.error('Error uploading multiple files to R2:', error);
		throw error;
	}
};

/**
 * Deletes a file from Cloudflare R2 storage
 *
 * @param url - The full URL of the file to delete
 * @returns Promise resolving to a boolean indicating success
 */
export const deleteFromR2 = async (url: string): Promise<boolean> => {
	try {
		// Extract the file path from the URL
		const filePath = url.replace(`${R2_BASE_URL}/`, '');

		// Send the delete request to your API endpoint
		const response = await fetch('/api/upload', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ path: filePath }),
		});

		if (!response.ok) {
			let errorMessage = 'Failed to delete file';
			// Try to get error message from response
			const errorData = await response.json().catch(() => ({}));
			errorMessage = errorData.message || errorMessage;
			throw new Error(errorMessage);
		}

		return true;
	} catch (error) {
		console.error('Error deleting from R2:', error);
		throw error;
	}
};
