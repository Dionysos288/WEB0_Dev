const getTimeAgo = (date: string) => {
	const currentDate = new Date();
	const fileDate = new Date(date);
	const diff = currentDate.getTime() - fileDate.getTime();
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	if (days > 1) {
		return fileDate.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	} else if (days === 1) {
		return `Yesterday`;
	} else if (hours > 0) {
		return `${hours} hour${hours > 1 ? 's' : ''} ago`;
	} else if (minutes > 2) {
		return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
	} else {
		return `Just Now`;
	}
};
const getDateFormat = (date: string) => {
	const fileDate = new Date(date);
	if (fileDate.getFullYear() === new Date().getFullYear()) {
		return fileDate.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		});
	} else {
		return fileDate.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	}
};

export { getTimeAgo, getDateFormat };
