'use client';
import styles from './AddTaskPopup.module.scss';
import { useEffect, useRef, useState, useCallback } from 'react';
import ButtonSelector from '@/components/pages/projects/addProject/ButtonSelector';
import SingleDatePicker from '@/components/general/ui/date/SingleDatePicker';
import Team from '@/svgs/Team';
import NoPriority from '@/svgs/NoPriority';
import LowPriority from '@/svgs/LowPriority';
import MediumPriority from '@/svgs/MediumPriority';
import HighPriority from '@/svgs/HighPriority';
import UrgentPriority from '@/svgs/UrgentPriority';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';
import { getMembers, getUser } from '@/actions/AccountActions';
import { getDateFormat } from '@/utils/DateHooks';
import { createTask } from '@/actions/TaskActions';
import { projectPriority, TaskStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';
import DatePicker from '@/svgs/DatePicker';

interface OptionItem {
	label: string;
	value: string;
	icon?: React.ComponentType<{
		fill?: string;
		width?: string;
		height?: string;
	}>;
}

interface AddTaskPopupProps {
	isOpen: boolean;
	onClose: () => void;
	projectId?: string;
}

const AddTaskPopup = ({ isOpen, onClose, projectId }: AddTaskPopupProps) => {
	const router = useRouter();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [dueDate, setDueDate] = useState<Date>();
	const [isDateOpen, setIsDateOpen] = useState(false);
	const [organizationId, setOrganizationId] = useState('');
	const [orgUrl, setOrgUrl] = useState('');

	console.log(isOpen);

	// Priority state
	const [priorityQuery, setPriorityQuery] = useState('');
	const [priorityOptions, setPriorityOptions] = useState<OptionItem[]>([
		{ label: 'No Priority', value: 'noPriority', icon: NoPriority },
		{ label: 'Low', value: 'low', icon: LowPriority },
		{ label: 'Medium', value: 'medium', icon: MediumPriority },
		{ label: 'High', value: 'high', icon: HighPriority },
		{ label: 'Urgent', value: 'urgent', icon: UrgentPriority },
	]);
	const OldPriorityOptions = [
		{ label: 'No Priority', value: 'noPriority', icon: NoPriority },
		{ label: 'Low', value: 'low', icon: LowPriority },
		{ label: 'Medium', value: 'medium', icon: MediumPriority },
		{ label: 'High', value: 'high', icon: HighPriority },
		{ label: 'Urgent', value: 'urgent', icon: UrgentPriority },
	];
	const [chosenPriority, setChosenPriority] = useState<string | OptionItem>(
		priorityOptions[0]
	);
	const [isPriorityOpen, setIsPriorityOpen] = useState(false);
	const priorityRef = useRef(null);

	// Members state
	const [memberQuery, setMemberQuery] = useState('');
	const [memberOptions, setMemberOptions] = useState<OptionItem[]>([]);
	const [OldMemberOptions, setOldMemberOptions] = useState<OptionItem[]>([]);
	const [chosenMember, setChosenMember] = useState<string | OptionItem>({
		label: 'Assignee',
		value: 'none',
		icon: Team,
	});
	const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
	const [isMemberOpen, setIsMemberOpen] = useState(false);
	const memberRef = useRef(null);

	// Status state
	const [statusQuery, setStatusQuery] = useState('');
	const [statusOptions, setStatusOptions] = useState<OptionItem[]>([
		{ label: 'Backlog', value: 'Backlog', icon: Team },
		{ label: 'To Do', value: 'todo', icon: Team },
		{ label: 'In Progress', value: 'inProgress', icon: Team },
		{ label: 'In Review', value: 'inReview', icon: Team },
		{ label: 'Completed', value: 'Completed', icon: Team },
		{ label: 'Canceled', value: 'canceled', icon: Team },
	]);
	const OldStatusOptions = [
		{ label: 'Backlog', value: 'Backlog', icon: Team },
		{ label: 'To Do', value: 'todo', icon: Team },
		{ label: 'In Progress', value: 'inProgress', icon: Team },
		{ label: 'In Review', value: 'inReview', icon: Team },
		{ label: 'Completed', value: 'Completed', icon: Team },
	];
	const [chosenStatus, setChosenStatus] = useState<string | OptionItem>(
		statusOptions[0]
	);
	const [isStatusOpen, setIsStatusOpen] = useState(false);
	const statusRef = useRef(null);

	useEffect(() => {
		const fetchMembers = async () => {
			const { data: session } = await getUser();
			if (session?.session.activeOrganizationId) {
				setOrganizationId(session.session.activeOrganizationId);
				setOrgUrl(session.session.organizationSlug);
				const { data, error } = await getMembers(
					session.session.activeOrganizationId
				);
				if (error) {
					console.error(error);
				} else {
					const dataMapped =
						data?.map((member) => ({
							label: member.user.email,
							value: member.id,
							icon: Team,
						})) || [];
					setMemberOptions(dataMapped);
					setOldMemberOptions(dataMapped);
				}
			}
		};
		if (isOpen) {
			fetchMembers();
		}
	}, [isOpen]);

	const onPriorityQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<OptionItem[]>>,
		oldData: OptionItem[]
	) => {
		const value = e.target.value.toLowerCase();
		setPriorityQuery(value);
		setOptions(
			oldData.filter((item) => item.label.toLowerCase().includes(value))
		);
	};

	const onMemberQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<OptionItem[]>>,
		oldData: OptionItem[]
	) => {
		const value = e.target.value.toLowerCase();
		setMemberQuery(value);
		setOptions(
			oldData.filter((item) => item.label.toLowerCase().includes(value))
		);
	};

	const onStatusQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<OptionItem[]>>,
		oldData: OptionItem[]
	) => {
		const value = e.target.value.toLowerCase();
		setStatusQuery(value);
		setOptions(
			oldData.filter((item) => item.label.toLowerCase().includes(value))
		);
	};

	const handleSubmit = async () => {
		if (!organizationId || !title) return;

		const taskData = {
			title,
			description: description || undefined,
			priority: (typeof chosenPriority === 'string'
				? chosenPriority
				: chosenPriority.value) as projectPriority,
			status: (typeof chosenStatus === 'string'
				? chosenStatus
				: chosenStatus.value) as TaskStatus,
			dueDate: dueDate || undefined,
			assignees: selectedMembers.length > 0 ? selectedMembers : undefined,
			projectId: projectId || undefined,
			organizationId,
		};

		const { error } = await createTask(taskData, orgUrl);
		if (error) {
			console.error(error);
		} else {
			router.refresh();
			onClose();
		}
	};

	const getDateColor = (date?: Date) => {
		if (!date) return 'var(--main-65)';

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const dueDate = new Date(date);
		dueDate.setHours(0, 0, 0, 0);

		if (dueDate < today) {
			return 'var(--error-600)';
		}

		const sevenDaysFromNow = new Date(today);
		sevenDaysFromNow.setDate(today.getDate() + 7);

		if (dueDate <= sevenDaysFromNow) {
			return 'var(--orange-90)';
		}

		return 'var(--main)';
	};

	const getAssigneeColor = () => {
		return selectedMembers.length === 0 ? 'var(--main-65)' : 'var(--main)';
	};

	const handleDateClose = useCallback(() => {
		setIsDateOpen(false);
	}, []);

	if (!isOpen) return null;

	return (
		<div className={styles.popupWrapper}>
			<ClickOutsideWrapper onClose={onClose} closeOnEsc={true}>
				<div className={styles.popup}>
					<div>
						<h2>New Task</h2>
					</div>
					<div className={styles.inputWrapper}>
						<input
							type="text"
							placeholder="Task Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className={styles.header}
						/>
						<textarea
							placeholder="Task Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className={styles.description}
						/>
						<div className={styles.optionWrapper}>
							<div
								className={styles.option}
								onClick={() => setIsStatusOpen(!isStatusOpen)}
							>
								{chosenStatus && typeof chosenStatus !== 'string' && (
									<>
										<Team fill={'var(--main)'} width="16" height="16" />
										<span>{chosenStatus.label}</span>
									</>
								)}
								{isStatusOpen && (
									<ClickOutsideWrapper onClose={() => setIsStatusOpen(false)}>
										<ButtonSelector<OptionItem>
											query={statusQuery}
											onQueryChange={onStatusQueryChange}
											inputRef={statusRef}
											options={statusOptions}
											placeholder="Select Status"
											oldData={OldStatusOptions}
											setOptions={setStatusOptions}
											setIsChosen={setChosenStatus}
											setIsOpenOption={setIsStatusOpen}
											isChosen={
												typeof chosenStatus === 'string'
													? chosenStatus
													: chosenStatus.value
											}
										/>
									</ClickOutsideWrapper>
								)}
							</div>
							<div
								className={styles.option}
								onClick={() => setIsPriorityOpen(!isPriorityOpen)}
							>
								{chosenPriority && typeof chosenPriority !== 'string' && (
									<>
										{chosenPriority.icon && (
											<chosenPriority.icon
												fill={'var(--main)'}
												width="16"
												height="16"
											/>
										)}
										<span>{chosenPriority.label}</span>
									</>
								)}
								{isPriorityOpen && (
									<ClickOutsideWrapper onClose={() => setIsPriorityOpen(false)}>
										<ButtonSelector<OptionItem>
											query={priorityQuery}
											onQueryChange={onPriorityQueryChange}
											inputRef={priorityRef}
											options={priorityOptions}
											placeholder="Select Priority"
											oldData={OldPriorityOptions}
											setOptions={setPriorityOptions}
											setIsChosen={setChosenPriority}
											setIsOpenOption={setIsPriorityOpen}
											isChosen={
												typeof chosenPriority === 'string'
													? chosenPriority
													: chosenPriority.value
											}
										/>
									</ClickOutsideWrapper>
								)}
							</div>

							<div
								className={styles.option}
								onClick={() => setIsMemberOpen(!isMemberOpen)}
							>
								{chosenMember && typeof chosenMember !== 'string' && (
									<>
										<Team fill={getAssigneeColor()} width="16" height="16" />
										<span style={{ color: getAssigneeColor() }}>
											{chosenMember.label}
										</span>
									</>
								)}
								{isMemberOpen && (
									<ClickOutsideWrapper onClose={() => setIsMemberOpen(false)}>
										<ButtonSelector<OptionItem>
											query={memberQuery}
											onQueryChange={onMemberQueryChange}
											inputRef={memberRef}
											options={memberOptions}
											placeholder="Assignee"
											oldData={OldMemberOptions}
											setOptions={setMemberOptions}
											setIsChosen={setChosenMember}
											setIsOpenOption={setIsMemberOpen}
											isChosen={
												typeof chosenMember === 'string'
													? chosenMember
													: chosenMember.value
											}
											isComboBox={true}
											selectedItems={selectedMembers}
											onSelectedItemsChange={setSelectedMembers}
										/>
									</ClickOutsideWrapper>
								)}
							</div>

							<div
								className={styles.option}
								onClick={() => setIsDateOpen(!isDateOpen)}
							>
								<DatePicker
									fill={getDateColor(dueDate)}
									width="16"
									height="16"
								/>
								<span style={{ color: getDateColor(dueDate) }}>
									{dueDate ? getDateFormat(String(dueDate)) : 'Due date'}
								</span>
								{isDateOpen && (
									<ClickOutsideWrapper onClose={handleDateClose}>
										<SingleDatePicker
											date={dueDate}
											setDate={setDueDate}
											setIsDateOpen={handleDateClose}
										/>
									</ClickOutsideWrapper>
								)}
							</div>
						</div>
					</div>
					<div className={styles.actions}>
						<button
							type="button"
							className={styles.cancelButton}
							onClick={onClose}
						>
							<span>Cancel</span>
						</button>
						<button
							type="button"
							className={styles.createButton}
							onClick={handleSubmit}
						>
							<span>Create Task</span>
						</button>
					</div>
				</div>
			</ClickOutsideWrapper>
		</div>
	);
};

export default AddTaskPopup;
