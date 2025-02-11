'use client';
import { motion } from 'motion/react';
import styles from './Timeline.module.scss';
import Spacing from '@/components/general/Spacing';
import React, { CSSProperties } from 'react';
import { Phase, Project } from '@prisma/client';

interface Day {
	id: number;
	label: number;
	month: number;
	year: number;
}
type projectAndPhases = Omit<Project, 'budget'> & {
	budget: number;
	phases: Phase[];
};
const Timeline = ({ project }: { project: projectAndPhases }) => {
	const { phases } = project;

	const earliestData = phases.reduce((prev, current) =>
		prev.startDate < current.startDate ? prev : current
	);
	const latestData = phases.reduce((prev, current) =>
		prev.endDate > current.endDate ? prev : current
	);

	const start = new Date(earliestData.startDate);
	start.setDate(start.getDate() - 4);

	const end = new Date(latestData.endDate);
	end.setDate(end.getDate() + 4);

	const calculateDaysDifference = (start: Date, end: Date): number => {
		const msPerDay = 1000 * 60 * 60 * 24;
		const diffInMs = end.getTime() - start.getTime();
		return Math.ceil(diffInMs / msPerDay);
	};

	const totalDuration = calculateDaysDifference(start, end);

	if (totalDuration < 50) {
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

	const taskSpecial = phases.map((phase) => {
		const matchingDay = days.find(
			(day) =>
				day.label === phase.startDate.getDate() &&
				day.month === phase.startDate.getMonth() &&
				day.year === phase.startDate.getFullYear()
		);
		const today = new Date();
		const startDate = phase.startDate;
		const endDate = phase.endDate;

		let state: [string, string];

		if (phase.status === 'Completed') {
			state = ['Completed', 'Completed'];
		} else if (today.getTime() < startDate.getTime()) {
			const daysBefore = calculateDaysDifference(today, startDate);
			state = [
				'Not_Started',
				`Starts in ${daysBefore} day${daysBefore > 1 ? 's' : ''}`,
			];
		} else if (today.getTime() <= endDate.getTime()) {
			const daysLeft = calculateDaysDifference(today, endDate);
			state = ['Active', `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`];
		} else {
			state = ['Completed', 'Completed'];
		}

		return {
			...phase,
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
	const colors = ['#E8B594', '#EDE9DD', '#E0E7FF'];

	interface CustomCSSProperties extends CSSProperties {
		'--amount'?: number;
		'--phases'?: number;
	}

	const customStyle: CustomCSSProperties = {
		'--amount': days.length,
		'--phases': phases.length + 2,
	};

	return (
		<div className={styles.timelineContainer}>
			<h2 className={styles.title}>Project Timeline</h2>
			<Spacing space={10} />
			<motion.div className={styles.timelineWrapper}>
				<div className={styles.days} style={customStyle}>
					{Array.from({ length: phases.length + 2 }).map((_, i) => (
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
								gridColumn: `${task.startIndex} / span ${
									calculateDaysDifference(task.startDate, task.endDate) + 1
								}`,
								gridRow: index + 3,
								zIndex: 1,
							}}
						>
							<div
								className={styles.task}
								style={{
									backgroundColor: colors[index % colors.length],
								}}
							>
								<p className={styles.leftSide}>{task.title}</p>
								<p className={styles.rightSide}>
									{task.state[0] === 'Not_Started' ? (
										<>{task.state[1]}</>
									) : task.state[0] === 'Active' ? (
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
								{Array.from({
									length:
										calculateDaysDifference(task.startDate, task.endDate) + 1,
								}).map((_, i) => (
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
