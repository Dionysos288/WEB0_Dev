'use server';

import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { uploadToR2, deleteFromR2 } from '@/utils/cloudflareR2';

export async function uploadFile(formData: FormData) {
	try {
		const file = formData.get('file') as File;
		const projectId = formData.get('projectId') as string;
		const phaseId = formData.get('phaseId') as string | null;

		if (!file || !projectId) {
			return { error: 'Missing required fields' };
		}

		// Upload file to Cloudflare R2
		const filePath = `projects/${projectId}/${uuidv4()}.${file.name
			.split('.')
			.pop()}`;
		const url = await uploadToR2(file, filePath);

		// Create a record in the database
		const fileRecord = await prisma.file.create({
			data: {
				name: file.name,
				size: file.size,
				url: url,
				description: file.name,
				uploader: 'system',
				projectId,
				phaseId: phaseId || undefined,
			},
		});

		return { data: fileRecord };
	} catch (error) {
		console.error('Upload error:', error);
		return { error: 'Failed to process file upload' };
	}
}

export async function deleteFile(fileId: string) {
	try {
		// Get the file record
		const file = await prisma.file.findUnique({
			where: { id: fileId },
		});

		if (!file) {
			return { error: 'File not found' };
		}

		// Delete from Cloudflare R2
		try {
			await deleteFromR2(file.url);
		} catch (storageError) {
			console.error('Storage delete error:', storageError);
			// Continue with database deletion even if storage deletion fails
		}

		// Delete from database
		await prisma.file.delete({
			where: { id: fileId },
		});

		return { success: true };
	} catch (error) {
		console.error('Delete error:', error);
		return { error: 'Failed to delete file' };
	}
}

// Function to handle bulk file deletion
export async function bulkDeleteFiles(fileIds: string[]) {
	try {
		const results = await Promise.all(fileIds.map((id) => deleteFile(id)));
		const errors = results.filter((result) => result.error);

		if (errors.length > 0) {
			return {
				error: `Failed to delete ${errors.length} of ${fileIds.length} files`,
				partialSuccess: errors.length < fileIds.length,
			};
		}

		return { success: true };
	} catch (error) {
		console.error('Bulk delete error:', error);
		return { error: 'Failed to process bulk delete operation' };
	}
}
