const getTaskPriority = (priority: number) => {
	if (priority === 1) return 'Low';
	if (priority === 2) return 'Normal';
	if (priority === 3) return 'High';
	if (priority === 4) return 'Urgent';
};
export default getTaskPriority;
