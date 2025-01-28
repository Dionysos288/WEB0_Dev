'use client';
import Image from 'next/image';
import styles from './AddProjectPopup.module.scss';
import Spacing from '@/components/General/Spacing';
import { useEffect, useMemo, useRef, useState } from 'react';
import ButtonSelector from './ButtonSelector';
import SingleDatePicker from '@/components/general/ui/date/SingleDatePicker';
import useOutsideClick from '@/utils/useOutSideClick';
import { getDateFormat } from '@/utils/DateHooks';
import StartDate from '@/svgs/StartDate';
import Text from '@/svgs/Text';
import Team from '@/svgs/Team';
import DatePickerOver from '@/svgs/DatePickerOver';
import DatePicker from '@/svgs/DatePicker';
import Lead from '@/svgs/lead';

const AddProjectPopUp = ({
	isOpen,
	setIsopen,
}: {
	isOpen: boolean;
	setIsopen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const [query, setQuery] = useState('');
	const statuses = useMemo(
		() => ['Backlog', 'Planned', 'In Progress', 'Completed'],
		[]
	);
	const priorities = useMemo(
		() => ['no Priority', 'Low', 'Medium', 'High', 'Urgent'],
		[]
	);
	const leads = useMemo(
		() => ['Unassigned', 'dion', 'dren', 'Driton', 'Mili'],
		[]
	);
	const memberss = useMemo(
		() => ['zenelidion288@gmail.com', 'dizeniyo@gmail.com', 'mdbvba@gmail.Com'],
		[]
	);

	const [status, setStatus] = useState(statuses);
	const [priority, setPriority] = useState(priorities);
	const [lead, setLead] = useState(leads);
	const [members, setMembers] = useState(memberss);
	const [budget, setBudget] = useState(0);
	const [inputSize, setInputSize] = useState(0);
	const [startDate, setStartDate] = useState<Date>();
	const [endDate, setEndDate] = useState<Date>();

	const [isStatusOpen, setIsStatusOpen] = useState(false);
	const [isPriorityOpen, setIsPriorityOpen] = useState(false);
	const [isLeadOpen, setIsLeadOpen] = useState(false);
	const [isMembersOpen, setIsMembersOpen] = useState(false);
	const [isStartDateOpen, setIsStartDateOpen] = useState(false);
	const [isEndDateOpen, setIsEndDateOpen] = useState(false);

	const [chosenStatus, setChosenStatus] = useState(statuses[0]);
	const [chosenPriority, setChosenPriority] = useState(priorities[0]);
	const [chosenLead, setChosenLead] = useState('Unassigned');
	const [chosenMembers, setChosenMembers] = useState('Members');

	const inputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const statusRef = useRef<HTMLDivElement>(null);
	const priorityRef = useRef<HTMLDivElement>(null);
	const leadRef = useRef<HTMLDivElement>(null);
	const membersRef = useRef<HTMLDivElement>(null);
	const startDateRef = useRef<HTMLDivElement>(null);
	const endDateRef = useRef<HTMLDivElement>(null);
	const budgetRef = useRef<HTMLDivElement>(null);

	useOutsideClick(statusRef, () => setIsStatusOpen(false));
	useOutsideClick(priorityRef, () => setIsPriorityOpen(false));
	useOutsideClick(leadRef, () => setIsLeadOpen(false));
	useOutsideClick(membersRef, () => setIsMembersOpen(false));
	useOutsideClick(startDateRef, () => setIsStartDateOpen(false));
	useOutsideClick(endDateRef, () => setIsEndDateOpen(false));

	useEffect(() => {
		if (isStatusOpen && inputRef.current) {
			inputRef.current.focus();
		}
		if (!isStatusOpen) {
			setQuery('');
			setStatus(statuses);
		}
		if (isPriorityOpen && inputRef.current) {
			inputRef.current.focus();
		}
		if (!isPriorityOpen) {
			setQuery('');
			setPriority(priorities);
		}
		if (isLeadOpen && inputRef.current) {
			inputRef.current.focus();
		}
		if (!isLeadOpen) {
			setQuery('');
			setLead(leads);
		}
		if (isMembersOpen && inputRef.current) {
			inputRef.current.focus();
		}
		if (!isMembersOpen) {
			setQuery('');
			setMembers(memberss);
		}
	}, [
		isStatusOpen,
		isPriorityOpen,
		isLeadOpen,
		isMembersOpen,
		leads,
		memberss,
		priorities,
		statuses,
	]);

	const onQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<string[]>>,
		oldData: string[]
	) => {
		const value = e.target.value;
		setQuery(value);
		if (value === '') {
			setOptions(oldData);
		} else {
			setOptions(
				oldData.filter((option) =>
					option.toLowerCase().includes(value.toLowerCase())
				)
			);
		}
	};
	const onBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value;
		value = value.replace(/^0+(?=\d)/, '');

		e.target.value = value;
		setInputSize(value.length * 8);
		setBudget(value === '' ? 0 : Number(value));
	};
	const handleTextareaInput = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};
	return (
		<>
			{isOpen && (
				<div className={styles.popupWrapper}>
					<div className={styles.popup}>
						<div>
							<h2>New Project</h2>
						</div>
						<form style={{ display: 'contents' }} onSubmit={handleSubmit}>
							<div>
								<div className={styles.imageWrapper}>
									<Image
										src="https://placehold.co/60"
										alt="project"
										width={60}
										height={60}
									/>
								</div>
								<Spacing space={20} />

								<div className={styles.inputWrapper}>
									<input
										className={styles.header}
										type="text"
										id="projectName"
										placeholder="Project name"
									/>
									<textarea
										ref={textareaRef}
										onInput={handleTextareaInput}
										className={styles.description}
										id="projectName"
										placeholder="Write a description.."
									/>
								</div>
								<Spacing space={6} />
								<div className={styles.optionWrapper}>
									<div
										className={styles.option}
										onClick={() => setIsStatusOpen(!isStatusOpen)}
										ref={statusRef}
									>
										<Text fill={'var(--main)'} width="16" height="16" />
										<span>{chosenStatus}</span>
										{isStatusOpen && (
											<ButtonSelector
												query={query}
												onQueryChange={onQueryChange}
												oldData={statuses}
												placeholder="Change project status.."
												inputRef={inputRef}
												options={status}
												setOptions={setStatus}
												setIsChosen={setChosenStatus}
												isChosen={chosenStatus}
												setIsOpenOption={setIsStatusOpen}
											/>
										)}
									</div>
									<div
										className={styles.option}
										onClick={() => setIsPriorityOpen(!isPriorityOpen)}
										ref={priorityRef}
									>
										<Text fill={'var(--main)'} />
										<span>{chosenPriority}</span>
										{isPriorityOpen && (
											<ButtonSelector
												query={query}
												onQueryChange={onQueryChange}
												placeholder="Change project priority.."
												oldData={priorities}
												inputRef={inputRef}
												options={priority}
												setOptions={setPriority}
												setIsChosen={setChosenPriority}
												isChosen={chosenPriority}
												setIsOpenOption={setIsPriorityOpen}
											/>
										)}
									</div>
									<div
										className={styles.option}
										onClick={() => setIsLeadOpen(!isLeadOpen)}
										ref={leadRef}
									>
										<Lead
											fill={'var(--main-90)'}
											width="15"
											height="15"
											style={{ transform: 'translateY(-0.5px)' }}
										/>
										<span>
											{chosenLead === 'Unassigned' ? 'Lead' : chosenLead}
										</span>
										{isLeadOpen && (
											<ButtonSelector
												query={query}
												onQueryChange={onQueryChange}
												oldData={leads}
												placeholder="Set project lead.."
												inputRef={inputRef}
												options={lead}
												setOptions={setLead}
												setIsChosen={setChosenLead}
												isChosen={chosenLead}
												setIsOpenOption={setIsLeadOpen}
											/>
										)}
									</div>
									<div
										className={styles.option}
										onClick={() => setIsMembersOpen(!isMembersOpen)}
										ref={membersRef}
									>
										<Team fill={'var(--main)'} width="16" height="16" />
										<span>{chosenMembers}</span>
										{isMembersOpen && (
											<ButtonSelector
												query={query}
												onQueryChange={onQueryChange}
												oldData={memberss}
												inputRef={inputRef}
												placeholder="Change project members.."
												options={members}
												setOptions={setMembers}
												setIsChosen={setChosenMembers}
												isChosen={chosenMembers}
												setIsOpenOption={setIsMembersOpen}
											/>
										)}
									</div>
									<div
										className={styles.option}
										onClick={() => budgetRef.current?.focus()}
									>
										{budget === 0 ? (
											<Text fill={'var(--main-65)'} width="16" height="16" />
										) : (
											<Text fill={'var(--main)'} width="16" height="16" />
										)}
										<input
											style={{
												...(budget === 0
													? { color: 'var(--main-65)' }
													: { color: 'var(--main)' }),
												width: `calc(10px + ${inputSize}px)`,
											}}
											className={styles.budget}
											type="number"
											step="0.01"
											placeholder="Insert budget.."
											value={budget}
											onChange={onBudgetChange}
											ref={budgetRef}
										/>
									</div>
									<div
										className={styles.option}
										onClick={() => setIsStartDateOpen(!isStartDateOpen)}
										ref={startDateRef}
									>
										{!startDate ? (
											<StartDate
												fill={'var(--main-65)'}
												width="15"
												height="15"
											/>
										) : (
											<StartDate
												fill={'var(--main-90)'}
												width="15"
												height="15"
											/>
										)}

										<span
											style={
												startDate
													? { color: 'var(--main)' }
													: { color: 'var(--main-65)' }
											}
										>
											{startDate
												? getDateFormat(String(startDate))
												: 'Start Date'}
										</span>
										{isStartDateOpen && (
											<SingleDatePicker
												date={startDate}
												setDate={setStartDate}
												setIsDateOpen={setIsStartDateOpen}
											/>
										)}
									</div>
									<div
										className={styles.option}
										onClick={() => setIsEndDateOpen(!isEndDateOpen)}
										ref={endDateRef}
									>
										{!endDate ? (
											<DatePicker
												fill={'var(--main-65)'}
												width="15"
												height="15"
											/>
										) : endDate < new Date() ? (
											<DatePickerOver
												fill={'lch(58 73 29)'}
												width="15"
												height="15"
											/>
										) : endDate <=
										  new Date(new Date().setDate(new Date().getDate() + 7)) ? (
											<DatePicker
												fill={'var(--orange-90)'}
												width="15"
												height="15"
											/>
										) : (
											<DatePicker
												fill={'var(--main-90)'}
												width="15"
												height="15"
											/>
										)}
										<span
											style={
												endDate
													? { color: 'var(--main)' }
													: { color: 'var(--main-65)' }
											}
										>
											{endDate ? getDateFormat(String(endDate)) : 'Target Date'}
										</span>
										{isEndDateOpen && (
											<SingleDatePicker
												date={endDate}
												limitDate={startDate}
												setDate={setEndDate}
												setIsDateOpen={setIsEndDateOpen}
											/>
										)}
									</div>
								</div>
								<Spacing space={12} />
							</div>
							<div className={styles.buttonWrapper}>
								<button
									className={styles.cancel}
									onClick={() => {
										setIsopen(!isOpen);
									}}
								>
									<span>Cancel</span>
								</button>
								<button type="submit" className={styles.submit}>
									<span>Add Project</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default AddProjectPopUp;
