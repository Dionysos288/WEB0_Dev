type WeekDate = {
	weekday: string;
	day: string;
};

const getCurrentWeekDates = (locale: string): WeekDate[] => {
	const currentDate = new Date();
	let dayOfWeek = currentDate.getDay();
	if (dayOfWeek === 0) {
		dayOfWeek = 7;
	}
	const firstDayOfWeek = currentDate.getDate() - dayOfWeek + 1;
	const dates = Array.from({ length: 7 }, (_, i) => {
		const d = new Date(currentDate);
		d.setDate(firstDayOfWeek + i);
		return {
			weekday: d.toLocaleDateString(locale, { weekday: 'short' }),
			day: d.toLocaleDateString(locale, { day: 'numeric' }),
		};
	});
	return dates;
};

export default getCurrentWeekDates;
