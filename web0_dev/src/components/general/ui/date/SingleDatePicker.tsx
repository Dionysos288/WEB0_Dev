'use client';
import styles from './SingleDatePicker.module.scss';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import SVG from '@/components/general/SVG';
import { useState } from 'react';
import ArrowLineLeftFilled from '@/svgs/ArrowLineLeftFilled';
import Back from '@/svgs/Back';
import ArrowLineRightFilled from '@/svgs/ArrowLineRightFilled';

interface SingleDatePickerProps {
	setDate: (date: Date | undefined) => void;
	date: Date | undefined;
	limitDate?: Date;
	setIsDateOpen: (isOpen: boolean | string | number) => void;
}

const SingleDatePicker = ({
	setDate,
	limitDate,
	date,
	setIsDateOpen,
}: SingleDatePickerProps) => {
	const today = new Date();

	const [currentMonth, setCurrentMonth] = useState<Date>(date || today);

	const goToToday = () => {
		setCurrentMonth(today);
	};
	const goToPrevMonth = () => {
		const prev = new Date(currentMonth);
		prev.setMonth(currentMonth.getMonth() - 1);
		setCurrentMonth(prev);
	};

	const goToNextMonth = () => {
		const next = new Date(currentMonth);
		next.setMonth(currentMonth.getMonth() + 1);
		setCurrentMonth(next);
	};

	return (
		<div className={styles.datePicker} onClick={(e) => e.stopPropagation()}>
			<div className={styles.wrapper}>
				<DayPicker
					mode="single"
					required
					disabled={limitDate ? { before: limitDate } : undefined}
					showOutsideDays
					onDayClick={(day) => {
						setDate(day);
						setIsDateOpen(false);
					}}
					selected={date}
					modifiersClassNames={{
						today: 'rdp-day_today',
						selected: 'rdp-day_selected',
					}}
					className={styles.customDayPicker}
					month={currentMonth}
					onMonthChange={setCurrentMonth}
				/>
				<div className={styles.mover}>
					<SVG onClick={goToToday}>
						<Back fill={'var(--main-85)'} width="16" height="16" />
					</SVG>
					<SVG onClick={goToPrevMonth}>
						<ArrowLineLeftFilled
							fill={'var(--main-85)'}
							width="16"
							height="16"
						/>
					</SVG>
					<SVG onClick={goToNextMonth}>
						<ArrowLineRightFilled
							fill={'var(--main-85)'}
							width="16"
							height="16"
						/>
					</SVG>
				</div>
			</div>
		</div>
	);
};

export default SingleDatePicker;
