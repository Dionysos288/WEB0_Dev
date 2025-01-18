interface projectType {
	id: string;
	title: string;
	start: string;
	due: string;
	team: string[];
	phase: 'progress' | 'rejected' | 'pending' | 'completed';
	budget: string;
	Alltasks: number;
	completed: number;
}
interface phaseType {
	id: number;
	name: string;
	description: string;
	startDate: string;
	endDate: string;
	status: 'Not Started' | 'Active' | 'Completed';
}

export type { projectType, phaseType };
