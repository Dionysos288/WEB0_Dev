import { NextRequest, NextResponse } from 'next/server';
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3';

// Initialize the S3 client for Cloudflare R2
const s3Client = new S3Client({
	region: 'auto',
	endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
	credentials: {
		accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
	},
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || '';
const R2_PUBLIC_URL = 'https://pub-fd01615382d74cf9899aac2d87560049.r2.dev';

/**
 * API route handler for file uploads to Cloudflare R2
 */
export async function POST(request: NextRequest) {
	try {
		// For now, we'll skip authentication and assume all requests are authenticated
		// In a production environment, you should implement proper authentication

		// Parse the form data
		const formData = await request.formData();
		const file = formData.get('file') as File | null;
		const path = formData.get('path') as string | null;

		if (!file || !path) {
			return NextResponse.json(
				{ success: false, message: 'File and path are required' },
				{ status: 400 }
			);
		}

		// Convert the file to a buffer
		const buffer = Buffer.from(await file.arrayBuffer());

		// Upload to R2
		const command = new PutObjectCommand({
			Bucket: BUCKET_NAME,
			Key: path,
			Body: buffer,
			ContentType: file.type,
			// Make the file publicly accessible
			ACL: 'public-read',
		});

		await s3Client.send(command);

		return NextResponse.json({
			success: true,
			url: `${R2_PUBLIC_URL}/${path}`,
		});
	} catch (error) {
		console.error('Error uploading file:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to upload file' },
			{ status: 500 }
		);
	}
}

/**
 * API route handler for file deletion from Cloudflare R2
 */
export async function DELETE(request: NextRequest) {
	try {
		// For now, we'll skip authentication and assume all requests are authenticated
		// In a production environment, you should implement proper authentication

		// Parse the request body
		const body = await request.json();
		const { path } = body;

		if (!path) {
			return NextResponse.json(
				{ success: false, message: 'Path is required' },
				{ status: 400 }
			);
		}

		// Delete from R2
		const command = new DeleteObjectCommand({
			Bucket: BUCKET_NAME,
			Key: path,
		});

		await s3Client.send(command);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting file:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to delete file' },
			{ status: 500 }
		);
	}
}
