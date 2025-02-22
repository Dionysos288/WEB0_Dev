import { NextResponse } from 'next/server';

const JUDGE0_API_URL = 'http://localhost:2359';

interface CompileRequest {
	source_code: string;
	language_id: number;
	stdin?: string;
	base64_encoded?: boolean;
	wait?: boolean;
}

interface CompileResponse {
	token: string;
	stdout?: string;
	stderr?: string;
	compile_output?: string;
	message?: string;
	status?: {
		id: number;
		description: string;
	};
	memory?: number;
	time?: number;
}

// Language IDs for Judge0
export const LANGUAGE_IDS = {
	CSHARP: 51, // C# (Mono 6.x)
	PYTHON: 71, // Python (3.8.1)
	JAVASCRIPT: 63, // JavaScript (Node.js 12.14.0)
	CPP: 54, // C++ (GCC 9.2.0)
	JAVA: 62, // Java (OpenJDK 13.0.1)
} as const;

// Status code mappings
const STATUS_MESSAGES: { [key: number]: string } = {
	1: 'In Queue',
	2: 'Processing',
	3: 'Accepted',
	4: 'Wrong Answer',
	5: 'Time Limit Exceeded',
	6: 'Compilation Error',
	7: 'Runtime Error (SIGSEGV)',
	8: 'Runtime Error (SIGXFSZ)',
	9: 'Runtime Error (SIGFPE)',
	10: 'Runtime Error (SIGABRT)',
	11: 'Runtime Error (NZEC)',
	12: 'Runtime Error (Other)',
	13: 'Internal Error',
	14: 'Exec Format Error',
};

async function getSubmissionStatus(
	token: string,
	base64_encoded: boolean = false
): Promise<CompileResponse> {
	const fields = 'stdout,stderr,status_id,compile_output,message,memory,time';
	const response = await fetch(
		`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=${base64_encoded}&fields=${fields}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);

	if (!response.ok) {
		throw new Error('Failed to get submission status');
	}

	const result = await response.json();
	return {
		token,
		stdout: result.stdout || '',
		stderr: result.stderr || '',
		compile_output: result.compile_output || '',
		message: result.message,
		status: {
			id: result.status_id,
			description: STATUS_MESSAGES[result.status_id] || 'Unknown',
		},
		memory: result.memory,
		time: result.time,
	};
}

export async function POST(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const base64_encoded = searchParams.get('base64_encoded') === 'true';
		const wait = searchParams.get('wait') === 'true';

		const body: CompileRequest = await request.json();

		// Submit the code to Judge0
		const submissionResponse = await fetch(
			`${JUDGE0_API_URL}/submissions?base64_encoded=${base64_encoded}&wait=${wait}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					source_code: body.source_code,
					language_id: body.language_id,
					stdin: body.stdin || '',
					wait: true, // Always wait for the result
					cpu_time_limit: 5,
					memory_limit: 512000,
					stack_limit: 64000,
					max_processes_and_or_threads: 60,
					enable_network: false,
				}),
			}
		);

		if (!submissionResponse.ok) {
			const errorText = await submissionResponse.text();
			throw new Error(`Failed to submit code: ${errorText}`);
		}

		const submission = await submissionResponse.json();
		return NextResponse.json(submission, { status: 201 });
	} catch (error) {
		console.error('Compilation error:', error);
		return NextResponse.json(
			{
				error: 'Failed to compile code',
				message:
					error instanceof Error ? error.message : 'Unknown error occurred',
			},
			{ status: 500 }
		);
	}
}

// GET endpoint for checking submission status
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const token = searchParams.get('token');
		const base64_encoded = searchParams.get('base64_encoded') === 'true';

		if (!token) {
			return NextResponse.json({ error: 'Token is required' }, { status: 400 });
		}

		const status = await getSubmissionStatus(token, base64_encoded);
		return NextResponse.json(status);
	} catch (error) {
		console.error('Error getting submission status:', error);
		return NextResponse.json(
			{
				error: 'Failed to get submission status',
				message:
					error instanceof Error ? error.message : 'Unknown error occurred',
			},
			{ status: 500 }
		);
	}
}
