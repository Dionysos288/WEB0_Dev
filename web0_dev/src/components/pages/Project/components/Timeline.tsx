'use client';
import { motion } from 'motion/react';
import styles from './Timeline.module.scss';
import Spacing from '@/components/General/Spacing';
import React, { CSSProperties } from 'react';

interface Day {
	id: number;
	label: number;
	month: number;
	year: number;
}
const Timeline = () => {
	const tasks = [
		{
			id: 1,
			name: 'Designing',
			startDay: new Date(2025, 0, 2),
			duration: 10,
			color: '#E8B594',
		},
		{
			id: 2,
			name: 'Reviewing',
			startDay: new Date(2025, 0, 11),
			duration: 15,
			color: '#EDE9DD',
		},
		{
			id: 3,
			name: 'Testing',
			startDay: new Date(2025, 0, 18),
			duration: 20,
			color: '#E0E7FF',
		},
		{
			id: 4,
			name: 'Testing',
			startDay: new Date(2025, 0, 22),
			duration: 20,
			color: '#E8B594',
		},
	];

	const start = new Date(tasks[0].startDay);
	start.setDate(start.getDate() - 4);

	const end = new Date(tasks[tasks.length - 1].startDay);
	end.setDate(end.getDate() + tasks[tasks.length - 1].duration);
	const calculateDaysDifference = (start: Date, end: Date): number => {
		const msPerDay = 1000 * 60 * 60 * 24;
		const diffInMs = end.getTime() - start.getTime();
		return Math.ceil(diffInMs / msPerDay);
	};
	const totalDuration = calculateDaysDifference(start, end);

	if (totalDuration < 60) {
		end.setDate(end.getDate() + 24);
	}

	const days: Day[] = [];
	for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
		days.push({
			id: days.length + 1,
			label: d.getDate(),
			month: d.getMonth(),
			year: d.getFullYear(),
		});
	}

	const taskSpecial = tasks.map((task) => {
		const matchingDay = days.find(
			(day) =>
				day.label === task.startDay.getDate() &&
				day.month === task.startDay.getMonth() &&
				day.year === task.startDay.getFullYear()
		);
		const today = new Date();
		const startDate = task.startDay;
		const endDate = new Date(task.startDay);
		endDate.setDate(endDate.getDate() + task.duration);

		let state: [string, string];

		if (today.getTime() < startDate.getTime()) {
			const daysBefore = calculateDaysDifference(today, startDate);
			state = [
				'before',
				`Starts in ${daysBefore} day${daysBefore > 1 ? 's' : ''}`,
			];
		} else if (today.getTime() <= endDate.getTime()) {
			const daysLeft = calculateDaysDifference(today, endDate);
			state = ['during', `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`];
		} else {
			state = ['complete', 'Completed'];
		}

		return {
			...task,
			startIndex: matchingDay ? matchingDay.id : 1,
			state,
		};
	});

	const specialMonths = () => {
		let amountMonth = 0;
		let month = start.getMonth();
		const filtered: string[] = [];
		days.map((day) => {
			if (day.month === month) {
				amountMonth++;
			} else {
				if (amountMonth >= 3) {
					filtered.push(String(month));
				}
				amountMonth = 1;
				month = day.month;
			}
		});
		return filtered;
	};
	const filteredMonths: string[] = specialMonths();

	const getPosToday = () => {
		const today = new Date();
		const todayIndex = days.find(
			(day) =>
				day.label === today.getDate() &&
				day.month === today.getMonth() &&
				day.year === today.getFullYear()
		);
		return todayIndex?.id !== -1 ? todayIndex?.id : 0;
	};
	const getPosTodaynow = getPosToday();
	const getMonthName = (month: number): string => {
		const isIncluded = filteredMonths.find((m) => Number(m) === month);
		console.log('Is Month Included:', isIncluded);

		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];

		return isIncluded !== undefined ? monthNames[month] : '';
	};
	interface CustomCSSProperties extends CSSProperties {
		'--amount'?: number;
		'--tasks'?: number;
	}

	const customStyle: CustomCSSProperties = {
		'--amount': days.length,
		'--tasks': tasks.length + 2,
	};

	return (
		<div className={styles.timelineContainer}>
			<h2 className={styles.title}>Project Timeline</h2>
			<Spacing space={10} />
			<motion.div className={styles.timelineWrapper}>
				<div className={styles.days} style={customStyle}>
					{Array.from({ length: tasks.length + 2 }).map((_, i) => (
						<React.Fragment key={i}>
							{i === 0 &&
								days.map((day, index) =>
									day.label === 1 ? (
										<div
											className={styles.month}
											key={index + 10}
											style={{
												gridColumn: `${index + 1}`,
												gridRow: '1',
											}}
										>
											<p>{getMonthName(day.month)}</p>
										</div>
									) : (
										<div key={index + 10} className={styles.borderno} />
									)
								)}
							{i === 1 &&
								days.map((day) => (
									<div key={day.id} className={styles.day}>
										{getPosTodaynow === 0 || getPosTodaynow !== day.id ? (
											<p>{day.label}</p>
										) : (
											<p className={styles.TodayRed}>{day.label}</p>
										)}
									</div>
								))}
							{i > 1 &&
								days.map((day) => (
									<div key={day.id} className={styles.border} />
								))}
						</React.Fragment>
					))}
					{taskSpecial.map((task, index) => (
						<div
							key={task.id}
							style={{
								gridColumn: `${task.startIndex} / span ${task.duration}`,
								gridRow: index + 3,
								zIndex: 1,
							}}
						>
							<div
								className={styles.task}
								style={{
									backgroundColor: task.color,
								}}
							>
								<p className={styles.leftSide}>{task.name}</p>
								<p className={styles.rightSide}>
									{task.state[0] === 'before' ? (
										<>{task.state[1]}</>
									) : task.state[0] === 'during' ? (
										<>{task.state[1]}</>
									) : (
										<>{task.state[1]}</>
									)}
								</p>
							</div>
							<div
								className={styles.borderSpecContainer}
								style={{
									height: '8px',
								}}
							>
								{Array.from({ length: task.duration }).map((_, i) => (
									<div key={i} className={styles.borderSpec} />
								))}
							</div>
						</div>
					))}
				</div>
			</motion.div>
		</div>
	);
};

export default Timeline;
