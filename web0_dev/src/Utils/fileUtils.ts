'use client';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Downloads a file from a URL with a specified filename
 *
 * @param url - The URL of the file to download
 * @param fileName - The name to save the file as
 */
export function downloadFile(url: string, fileName: string) {
	const link = document.createElement('a');
	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

/**
 * Downloads multiple files as a zip archive
 *
 * @param files - Array of file objects with url and name properties
 * @param zipName - Name of the zip file to be created
 */
export async function downloadFilesAsZip(
	files: { url: string; name: string }[],
	zipName: string = 'download.zip'
) {
	try {
		const zip = new JSZip();

		// Create a folder in the zip
		const folder = zip.folder('files');
		if (!folder) throw new Error('Failed to create folder in zip');

		// Add each file to the zip
		const filePromises = files.map(async (file) => {
			try {
				const response = await fetch(file.url);
				if (!response.ok) throw new Error(`Failed to fetch ${file.name}`);

				const blob = await response.blob();
				folder.file(file.name, blob);
				return { success: true, name: file.name };
			} catch (error) {
				console.error(`Error adding ${file.name} to zip:`, error);
				return { success: false, name: file.name };
			}
		});

		// Wait for all files to be processed
		const results = await Promise.all(filePromises);
		const failedFiles = results.filter((r) => !r.success).map((r) => r.name);

		if (failedFiles.length > 0) {
			console.warn('Some files could not be added to the zip:', failedFiles);
		}

		// Generate the zip file
		const content = await zip.generateAsync({ type: 'blob' });

		// Save the zip file
		saveAs(content, zipName);

		return {
			success: true,
			totalFiles: files.length,
			successfulFiles: files.length - failedFiles.length,
			failedFiles,
		};
	} catch (error) {
		console.error('Error creating zip file:', error);
		return {
			success: false,
			error: String(error),
			totalFiles: files.length,
			successfulFiles: 0,
			failedFiles: files.map((f) => f.name),
		};
	}
}

/**
 * Creates a test file and uploads it to test the upload functionality
 *
 * @param projectId - The project ID to associate with the test file
 * @returns Promise resolving to the response from the upload API
 */
export async function testUpload(projectId: string) {
	try {
		// Create a test file
		const content = 'Test file content';
		const blob = new Blob([content], { type: 'text/plain' });
		const file = new File([blob], 'test-upload.txt', { type: 'text/plain' });

		// Create form data
		const formData = new FormData();
		formData.append('file', file);
		formData.append('projectId', projectId);

		// Get the base URL
		const baseUrl = window.location.origin;

		// Send the upload request
		const response = await fetch(`${baseUrl}/api/upload-test`, {
			method: 'POST',
			body: formData,
		});

		// Return the response
		return await response.json();
	} catch (error) {
		console.error('Test upload error:', error);
		return { error: String(error) };
	}
}
