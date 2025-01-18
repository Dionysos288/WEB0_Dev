type ProjectStatus = 'progress' | 'rejected' | 'pending' | 'completed';
type PhaseStatus = 'Completed' | 'Active' | 'Not Started';

interface projectType {
	id: string;
	title: string;
	start: string;
	due: string;
	team: string[];
	phase: ProjectStatus;
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
	status: PhaseStatus;
}
interface fileType {
	id: number;
	name: string;
	description: string;
}

export type { projectType, phaseType, fileType, ProjectStatus, PhaseStatus };
