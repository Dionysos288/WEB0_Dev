import { CompilationResult } from '@/components/pages/library-items/code/types';

interface Judge0Response {
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

/**
 * Executes code using Judge0 API
 * @param code The source code to execute
 * @param languageId The Judge0 language ID
 * @param inputs Array of input strings to be provided to the program
 * @returns CompilationResult containing stdout, stderr, and execution details
 */
export async function runCode(
	code: string,
	languageId: number,
	inputs?: string[]
): Promise<CompilationResult> {
	try {
		// Join multiple inputs with newlines if provided
		const stdin = inputs ? inputs.join('\n') : '';

		// Submit code and get result
		const submitResponse = await fetch(
			'/api/compile?base64_encoded=false&wait=true',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					source_code: code,
					language_id: languageId,
					stdin: stdin || '',
				}),
			}
		);

		if (!submitResponse.ok) {
			throw new Error(`Failed to submit code: ${await submitResponse.text()}`);
		}

		const result: Judge0Response = await submitResponse.json();
		console.log(result);
		if (!result.status) {
			throw new Error('No status received from Judge0');
		}
		console.log(result);
		return {
			stdout: result.stdout || '',
			stderr: result.compile_output || result.stderr || '',
			isError: result.status.id !== 3, // Status 3 is "Accepted"
			status: result.status.description || 'Unknown status',
			memory: result.memory,
			time: result.time,
		};
	} catch (error) {
		console.error('Error running code:', error);
		throw error;
	}
}

// Language IDs for Judge0
export const LANGUAGE_IDS = {
	PYTHON: 71, // Python (3.8.1)
	CSHARP: 51, // C# (Mono 6.x)
	JAVA: 62, // Java (OpenJDK 13.0.1)
	JAVASCRIPT: 63, // JavaScript (Node.js 12.14.0)
	PHP: 68, // PHP (7.4.1)
	GO: 60, // Go (1.13.5)
	C: 50, // C (GCC 9.2.0)
	CPP: 54, // C++ (GCC 9.2.0)
	RUST: 73, // Rust (1.40.0)
	RUBY: 72, // Ruby (2.7.0)
} as const;

export type SupportedLanguage = keyof typeof LANGUAGE_IDS;
