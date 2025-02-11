'use client';
import Image from 'next/image';
import styles from './AddProjectPopup.module.scss';
import Spacing from '@/components/general/Spacing';
import { useEffect, useMemo, useRef, useState } from 'react';
import ButtonSelector from './ButtonSelector';
import SingleDatePicker from '@/components/general/ui/date/SingleDatePicker';
import { getDateFormat } from '@/utils/DateHooks';
import StartDate from '@/svgs/StartDate';
import Text from '@/svgs/Text';
import Team from '@/svgs/Team';
import DatePickerOver from '@/svgs/DatePickerOver';
import DatePicker from '@/svgs/DatePicker';
import Lead from '@/svgs/lead';
import Phases from './Phases';
import NoPriority from '@/svgs/NoPriority';
import Phase from '@/svgs/Phase';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';

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
	const [phases, setPhases] = useState<[string, Date][]>();

	const [isStatusOpen, setIsStatusOpen] = useState(false);
	const [isPriorityOpen, setIsPriorityOpen] = useState(false);
	const [isLeadOpen, setIsLeadOpen] = useState(false);
	const [isMembersOpen, setIsMembersOpen] = useState(false);
	const [isStartDateOpen, setIsStartDateOpen] = useState(false);
	const [isEndDateOpen, setIsEndDateOpen] = useState(false);
	const [isPhasesOpen, setIsPhasesOpen] = useState(false);

	const [chosenStatus, setChosenStatus] = useState(statuses[0]);
	const [chosenPriority, setChosenPriority] = useState(priorities[0]);
	const [chosenLead, setChosenLead] = useState('Unassigned');
	const [chosenMembers, setChosenMembers] = useState('Members');
	const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

	const inputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const budgetRef = useRef<HTMLDivElement>(null);

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
		setInputSize(value.length * 6.7);
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

	const getMembersDisplayText = (selected: string[]) => {
		if (selected.length === 0) return 'Members';
		if (selected.length === 1) return '1 Member';
		return `${selected.length} Members`;
	};

	return (
		<>
			{isOpen && (
				<div className={styles.popupWrapper}>
					<ClickOutsideWrapper
						onClose={() => setIsopen(!isOpen)}
						closeOnEsc={true}
					>
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
										>
											<Text fill={'var(--main)'} width="16" height="16" />
											<span>{chosenStatus}</span>
											{isStatusOpen && (
												<ClickOutsideWrapper
													onClose={() => setIsStatusOpen(!isStatusOpen)}
												>
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
												</ClickOutsideWrapper>
											)}
										</div>
										<div
											className={styles.option}
											onClick={() => setIsPriorityOpen(!isPriorityOpen)}
										>
											<NoPriority fill={'var(--main)'} width="16" height="16" />
											<span>{chosenPriority}</span>
											{isPriorityOpen && (
												<ClickOutsideWrapper
													onClose={() => setIsPriorityOpen(!isPriorityOpen)}
												>
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
												</ClickOutsideWrapper>
											)}
										</div>

										<div
											className={styles.option}
											onClick={() => setIsLeadOpen(!isLeadOpen)}
										>
											<Lead
												fill={
													chosenLead === 'Unassigned'
														? 'var(--main-65)'
														: 'var(--main-90)'
												}
												width="15"
												height="15"
												style={{ transform: 'translateY(-0.5px)' }}
											/>
											<span
												style={{
													color:
														chosenLead === 'Unassigned'
															? 'var(--main-65)'
															: 'var(--main)',
												}}
											>
												{chosenLead === 'Unassigned' ? 'Lead' : chosenLead}
											</span>
											{isLeadOpen && (
												<ClickOutsideWrapper
													onClose={() => setIsLeadOpen(!isLeadOpen)}
												>
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
												</ClickOutsideWrapper>
											)}
										</div>

										<div
											className={styles.option}
											onClick={() => setIsMembersOpen(!isMembersOpen)}
										>
											<Team
												fill={
													selectedMembers.length === 0
														? 'var(--main-65)'
														: 'var(--main)'
												}
												width="16"
												height="16"
											/>
											<span
												style={{
													color:
														selectedMembers.length === 0
															? 'var(--main-65)'
															: 'var(--main)',
												}}
											>
												{getMembersDisplayText(selectedMembers)}
											</span>
											{isMembersOpen && (
												<ClickOutsideWrapper
													onClose={() => setIsMembersOpen(!isMembersOpen)}
												>
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
														isComboBox={true}
														selectedItems={selectedMembers}
														onSelectedItemsChange={setSelectedMembers}
													/>
												</ClickOutsideWrapper>
											)}
										</div>
										<div
											className={styles.option}
											onClick={() => budgetRef.current?.focus()}
										>
											<span
												className={styles.budgetSpan}
												style={{
													color:
														budget === 0 ? 'var(--main-65)' : 'var(--main)',
													fontSize: '14px',
												}}
											>
												$
											</span>

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
												<ClickOutsideWrapper
													onClose={() => setIsStartDateOpen(!isStartDateOpen)}
												>
													<SingleDatePicker
														date={startDate}
														setDate={setStartDate}
														setIsDateOpen={setIsStartDateOpen}
													/>
												</ClickOutsideWrapper>
											)}
										</div>
										<div
											className={styles.option}
											onClick={() => setIsEndDateOpen(!isEndDateOpen)}
										>
											{!endDate ? (
												<DatePicker
													fill={'var(--main-65)'}
													width="15"
													height="15"
												/>
											) : endDate < new Date() ? (
												<DatePickerOver
													fill={'var(--error-600)'}
													width="15"
													height="15"
												/>
											) : endDate <=
											  new Date(
													new Date().setDate(new Date().getDate() + 7)
											  ) ? (
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
												{endDate
													? getDateFormat(String(endDate))
													: 'Target Date'}
											</span>
											{isEndDateOpen && (
												<ClickOutsideWrapper
													onClose={() => setIsEndDateOpen(!isEndDateOpen)}
												>
													<SingleDatePicker
														date={endDate}
														limitDate={startDate}
														setDate={setEndDate}
														setIsDateOpen={setIsEndDateOpen}
													/>
												</ClickOutsideWrapper>
											)}
										</div>
										<div
											className={styles.option}
											onClick={() => {
												if (!isPhasesOpen) {
													setIsPhasesOpen(true);
												} else if (phases?.length === 0) {
													setIsPhasesOpen(false);
												}
											}}
										>
											{phases && phases?.length > 0 ? (
												<Phase fill={'var(--main)'} width="16" height="16" />
											) : (
												<Phase fill={'var(--main-65)'} width="16" height="16" />
											)}
											<span
												style={
													phases && phases?.length > 0
														? { color: 'var(--main)' }
														: { color: 'var(--main-65)' }
												}
											>
												{phases && phases?.length > 0
													? `${phases.length} Phase${
															phases && phases?.length > 1 ? 's' : ''
													  }`
													: 'Phases'}
											</span>
										</div>
									</div>
									<Spacing space={12} />
								</div>
								{isPhasesOpen && (
									<Phases
										phases={phases}
										setPhases={setPhases}
										setIsPhaseOpen={setIsPhasesOpen}
										isPhaseOpen={isPhasesOpen}
									/>
								)}
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
					</ClickOutsideWrapper>
				</div>
			)}
		</>
	);
};

export default AddProjectPopUp;
