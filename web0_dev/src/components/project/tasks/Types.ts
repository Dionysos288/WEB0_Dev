type TaskType = {
	id: number;
	columnId: number;
	title: string;
};
type ColumnType = {
	id: number;
	title: string;
	tasks: TaskType[];
};
export type { TaskType, ColumnType };
