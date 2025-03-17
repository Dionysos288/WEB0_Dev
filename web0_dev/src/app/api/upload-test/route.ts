import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/actions/FileActions';

/**
 * API route handler for testing file uploads
 */
export async function POST(request: NextRequest) {
	try {
		// Parse the form data
		const formData = await request.formData();

		// Log the keys for debugging
		console.log('Form data keys:', Array.from(formData.keys()));

		// Process the upload using the existing uploadFile action
		const result = await uploadFile(formData);

		// Log the result
		console.log('Upload result:', result);

		// Return the result
		return NextResponse.json(result);
	} catch (error) {
		console.error('Error in upload-test API route:', error);
		return NextResponse.json(
			{
				success: false,
				message: 'Failed to process test upload',
				error: String(error),
			},
			{ status: 500 }
		);
	}
}
