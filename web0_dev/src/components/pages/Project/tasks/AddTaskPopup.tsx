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
import { getProjectsAndPhases } from '@/actions/ProjectActions';
import ProjectIcon from '@/svgs/Project';
import PhaseIcon from '@/svgs/Phase';
import Label from '@/svgs/Label';
import { getLabels } from '@/actions/LabelActions';
import Dismiss from '@/svgs/Dismiss';

interface OptionItem {
	label: string;
	value: string;
	icon?: React.ComponentType<{
		fill?: string;
		width?: string;
		height?: string;
	}>;
	color?: string;
}

interface AddTaskPopupProps {
	isOpen: boolean;
	onClose: () => void;
	projectId?: string;
	defaultStatus?: TaskStatus;
}

const AddTaskPopup = ({
	isOpen,
	onClose,
	projectId,
	defaultStatus,
}: AddTaskPopupProps) => {
	const router = useRouter();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [dueDate, setDueDate] = useState<Date>();
	const [isDateOpen, setIsDateOpen] = useState(false);
	const [organizationId, setOrganizationId] = useState('');
	const [orgUrl, setOrgUrl] = useState('');

	console.log(defaultStatus);

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
		defaultStatus
			? statusOptions.find((opt) => opt.value === defaultStatus) ||
					statusOptions[0]
			: statusOptions[0]
	);
	const [isStatusOpen, setIsStatusOpen] = useState(false);
	const statusRef = useRef(null);

	// Add effect to update status when defaultStatus changes
	useEffect(() => {
		if (defaultStatus) {
			const matchingStatus = statusOptions.find(
				(opt) => opt.value === defaultStatus
			);
			if (matchingStatus) {
				setChosenStatus(matchingStatus);
			}
		}
	}, []);

	// Project state
	const [projectQuery, setProjectQuery] = useState('');
	const [projectOptions, setProjectOptions] = useState<OptionItem[]>([]);
	const [oldProjectOptions, setOldProjectOptions] = useState<OptionItem[]>([]);
	const [chosenProject, setChosenProject] = useState<string | OptionItem>({
		label: 'Project',
		value: 'none',
		icon: ProjectIcon,
	});
	const [isProjectOpen, setIsProjectOpen] = useState(false);
	const projectRef = useRef(null);

	// Phase state
	const [phaseQuery, setPhaseQuery] = useState('');
	const [phaseOptions, setPhaseOptions] = useState<OptionItem[]>([]);
	const [oldPhaseOptions, setOldPhaseOptions] = useState<OptionItem[]>([]);
	const [chosenPhase, setChosenPhase] = useState<string | OptionItem>({
		label: 'Phase',
		value: 'none',
		icon: PhaseIcon,
	});
	const [isPhaseOpen, setIsPhaseOpen] = useState(false);
	const phaseRef = useRef(null);

	// Label state
	const [labelQuery, setLabelQuery] = useState('');
	const [labelOptions, setLabelOptions] = useState<OptionItem[]>([]);
	const [oldLabelOptions, setOldLabelOptions] = useState<OptionItem[]>([]);
	const [chosenLabel, setChosenLabel] = useState<string | OptionItem>({
		label: 'Labels',
		value: 'none',
		icon: Label,
	});
	const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
	const [isLabelOpen, setIsLabelOpen] = useState(false);
	const labelRef = useRef(null);

	// Project and phase data cache
	const [projectsWithPhases, setProjectsWithPhases] = useState<{
		[key: string]: OptionItem[];
	}>({});

	const [createAnother, setCreateAnother] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setTitle('');
			setDescription('');
			setDueDate(undefined);
			setChosenPriority(priorityOptions[0]);
			setChosenStatus(
				defaultStatus
					? statusOptions.find((opt) => opt.value === defaultStatus) ||
							statusOptions[0]
					: statusOptions[0]
			);
			setSelectedMembers([]);
			setChosenMember({
				label: 'Assignee',
				value: 'none',
				icon: Team,
			});
			setSelectedLabels([]);
			setChosenLabel({
				label: 'Labels',
				value: 'none',
				icon: Label,
			});
			if (!projectId) {
				setChosenProject({
					label: 'Project',
					value: 'none',
					icon: ProjectIcon,
				});
				setChosenPhase({
					label: 'Phase',
					value: 'none',
					icon: PhaseIcon,
				});
			}
			setCreateAnother(false);
		}
	}, [isOpen, projectId, priorityOptions, statusOptions, defaultStatus]);

	useEffect(() => {
		const fetchData = async () => {
			const { data: session } = await getUser();
			if (session?.session.activeOrganizationId) {
				setOrganizationId(session.session.activeOrganizationId);
				setOrgUrl(session.session.organizationSlug);

				const [membersResult, projectsResult, labelsResult] = await Promise.all(
					[
						getMembers(session.session.activeOrganizationId),
						getProjectsAndPhases(session.session.activeOrganizationId),
						getLabels(session.session.activeOrganizationId),
					]
				);

				if (membersResult.error) {
					console.error(membersResult.error);
				} else {
					const dataMapped =
						membersResult.data?.map((member) => ({
							label: member.user.email,
							value: member.id,
							icon: Team,
						})) || [];
					setMemberOptions(dataMapped);
					setOldMemberOptions(dataMapped);
				}

				if (projectsResult.data) {
					const projectsMapped = [
						{
							label: 'No Project',
							value: 'none',
							icon: ProjectIcon,
						},
						...projectsResult.data.projects.map((project) => ({
							label: project.title,
							value: project.id,
							icon: ProjectIcon,
						})),
					];
					setProjectOptions(projectsMapped);
					setOldProjectOptions(projectsMapped);

					const phasesMap: { [key: string]: OptionItem[] } = {};
					projectsResult.data.projects.forEach((project) => {
						if (project.phases && project.phases.length > 0) {
							phasesMap[project.id] = [
								{
									label: 'No Phase',
									value: 'none',
									icon: PhaseIcon,
								},
								...project.phases.map((phase) => ({
									label: phase.title,
									value: phase.id,
									icon: PhaseIcon,
								})),
							];
						}
					});
					setProjectsWithPhases(phasesMap);

					if (projectId) {
						const defaultProject = projectsMapped.find(
							(p) => p.value === projectId
						);
						if (defaultProject) {
							setChosenProject(
								typeof defaultProject === 'string'
									? defaultProject
									: {
											...defaultProject,
											label:
												defaultProject.value === 'none'
													? 'Project'
													: defaultProject.label,
									  }
							);
							if (phasesMap[projectId]) {
								setPhaseOptions(phasesMap[projectId]);
								setOldPhaseOptions(phasesMap[projectId]);
							}
						}
					}
				}

				if (labelsResult.data) {
					const labelsMapped = labelsResult.data.map((label) => ({
						label: label.title,
						value: label.id,
						icon: Label,
						color: label.color,
					}));
					setLabelOptions(labelsMapped);
					setOldLabelOptions(labelsMapped);
				}
			}
		};

		if (isOpen) {
			fetchData();
		}
	}, [isOpen, projectId]);

	const handleProjectChange = (project: string | OptionItem) => {
		setChosenProject(
			typeof project === 'string'
				? project
				: {
						...project,
						label: project.value === 'none' ? 'Project' : project.label,
				  }
		);
		setIsProjectOpen(false);

		setChosenPhase({
			label: 'Phase',
			value: 'none',
			icon: PhaseIcon,
		});

		if (typeof project !== 'string' && project.value !== 'none') {
			const projectPhases = projectsWithPhases[project.value];
			if (projectPhases) {
				setPhaseOptions(projectPhases);
				setOldPhaseOptions(projectPhases);
			}
		}
	};

	const getProjectColor = () => {
		if (typeof chosenProject === 'string' || chosenProject.value === 'none') {
			return 'var(--main-65)';
		}
		return 'var(--main)';
	};

	const getPhaseColor = () => {
		if (typeof chosenPhase === 'string' || chosenPhase.value === 'none') {
			return 'var(--main-65)';
		}
		return 'var(--main)';
	};

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

	const onProjectQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<OptionItem[]>>,
		oldData: OptionItem[]
	) => {
		const value = e.target.value.toLowerCase();
		setProjectQuery(value);
		setOptions(
			oldData.filter((item) => item.label.toLowerCase().includes(value))
		);
	};

	const onPhaseQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<OptionItem[]>>,
		oldData: OptionItem[]
	) => {
		const value = e.target.value.toLowerCase();
		setPhaseQuery(value);
		setOptions(
			oldData.filter((item) => item.label.toLowerCase().includes(value))
		);
	};

	const onLabelQueryChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setOptions: React.Dispatch<React.SetStateAction<OptionItem[]>>,
		oldData: OptionItem[]
	) => {
		const value = e.target.value.toLowerCase();
		setLabelQuery(value);
		setOptions(
			oldData.filter((item) => item.label.toLowerCase().includes(value))
		);
	};

	const getLabelColor = () => {
		return selectedLabels.length === 0 ? 'var(--main-65)' : 'var(--main)';
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
			labels: selectedLabels.length > 0 ? selectedLabels : undefined,
			projectId:
				typeof chosenProject === 'string'
					? chosenProject === 'none'
						? undefined
						: chosenProject
					: chosenProject.value === 'none'
					? undefined
					: chosenProject.value,
			phaseId:
				typeof chosenPhase === 'string'
					? chosenPhase === 'none'
						? undefined
						: chosenPhase
					: chosenPhase.value === 'none'
					? undefined
					: chosenPhase.value,
			organizationId,
		};

		// Reset form before server request if createAnother is true
		if (createAnother) {
			setTitle('');
			setDescription('');
			setDueDate(undefined);
			setChosenPriority(priorityOptions[0]);
			setChosenStatus(
				defaultStatus
					? statusOptions.find((opt) => opt.value === defaultStatus) ||
							statusOptions[0]
					: statusOptions[0]
			);
			setSelectedMembers([]);
			setChosenMember({
				label: 'Assignee',
				value: 'none',
				icon: Team,
			});
			setSelectedLabels([]);
			setChosenLabel({
				label: 'Labels',
				value: 'none',
				icon: Label,
			});
		}

		const { error } = await createTask(taskData, orgUrl);
		if (error) {
			console.error(error);
		} else {
			router.refresh();
			if (!createAnother) {
				onClose();
			}
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
					<button className={styles.dismissButton} onClick={onClose}>
						<Dismiss width="16" height="16" />
					</button>
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
								onClick={() => setIsProjectOpen(!isProjectOpen)}
							>
								{chosenProject && typeof chosenProject !== 'string' && (
									<>
										<ProjectIcon
											fill={getProjectColor()}
											width="16"
											height="16"
										/>
										<span style={{ color: getProjectColor() }}>
											{chosenProject.label}
										</span>
									</>
								)}
								{isProjectOpen && (
									<ClickOutsideWrapper onClose={() => setIsProjectOpen(false)}>
										<ButtonSelector<OptionItem>
											query={projectQuery}
											onQueryChange={onProjectQueryChange}
											inputRef={projectRef}
											options={projectOptions}
											placeholder="Select Project"
											oldData={oldProjectOptions}
											setOptions={setProjectOptions}
											setIsChosen={handleProjectChange}
											setIsOpenOption={setIsProjectOpen}
											isChosen={
												typeof chosenProject === 'string'
													? chosenProject
													: chosenProject.value
											}
										/>
									</ClickOutsideWrapper>
								)}
							</div>

							{typeof chosenProject !== 'string' &&
								chosenProject.value !== 'none' &&
								projectsWithPhases[chosenProject.value] && (
									<div
										className={styles.option}
										onClick={() => setIsPhaseOpen(!isPhaseOpen)}
									>
										{chosenPhase && typeof chosenPhase !== 'string' && (
											<>
												<PhaseIcon
													fill={getPhaseColor()}
													width="16"
													height="16"
												/>
												<span style={{ color: getPhaseColor() }}>
													{chosenPhase.label}
												</span>
											</>
										)}
										{isPhaseOpen && (
											<ClickOutsideWrapper
												onClose={() => setIsPhaseOpen(false)}
											>
												<ButtonSelector<OptionItem>
													query={phaseQuery}
													onQueryChange={onPhaseQueryChange}
													inputRef={phaseRef}
													options={phaseOptions}
													placeholder="Select Phase"
													oldData={oldPhaseOptions}
													setOptions={setPhaseOptions}
													setIsChosen={(phase) => {
														setChosenPhase(
															typeof phase === 'string'
																? phase
																: {
																		...phase,
																		label:
																			phase.value === 'none'
																				? 'Phase'
																				: phase.label,
																  }
														);
														setIsPhaseOpen(false);
													}}
													setIsOpenOption={setIsPhaseOpen}
													isChosen={
														typeof chosenPhase === 'string'
															? chosenPhase
															: chosenPhase.value
													}
												/>
											</ClickOutsideWrapper>
										)}
									</div>
								)}
							<div
								className={styles.option}
								onClick={() => setIsLabelOpen(!isLabelOpen)}
							>
								{chosenLabel && typeof chosenLabel !== 'string' && (
									<div className={styles.selectedLabels}>
										{selectedLabels.length > 0 ? (
											<>
												<div className={styles.labelPills}>
													{selectedLabels.map((labelId, index) => {
														const label = labelOptions.find(
															(l) => l.value === labelId
														);
														return label && index < 3 ? (
															<div
																key={labelId}
																className={styles.labelPill}
																style={{ backgroundColor: label.color }}
															/>
														) : null;
													})}
												</div>
												<span style={{ color: getLabelColor() }}>
													{selectedLabels.length === 1
														? labelOptions.find(
																(l) => l.value === selectedLabels[0]
														  )?.label
														: `${selectedLabels.length} labels`}
												</span>
											</>
										) : (
											<>
												<Label fill={getLabelColor()} width="12" height="12" />
											</>
										)}
									</div>
								)}
								{isLabelOpen && (
									<ClickOutsideWrapper onClose={() => setIsLabelOpen(false)}>
										<ButtonSelector<OptionItem>
											query={labelQuery}
											onQueryChange={onLabelQueryChange}
											inputRef={labelRef}
											options={labelOptions}
											placeholder="Select Labels"
											oldData={oldLabelOptions}
											setOptions={setLabelOptions}
											setIsChosen={setChosenLabel}
											setIsOpenOption={setIsLabelOpen}
											isChosen={
												typeof chosenLabel === 'string'
													? chosenLabel
													: chosenLabel.value
											}
											isComboBox={true}
											selectedItems={selectedLabels}
											onSelectedItemsChange={setSelectedLabels}
											showColorBadge={true}
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
						<div className={styles.leftActions}>
							<div
								className={styles.toggleWrapper}
								onClick={() => setCreateAnother(!createAnother)}
							>
								<div
									className={`${styles.toggle} ${
										createAnother ? styles.active : ''
									}`}
								>
									<div className={styles.circle} />
								</div>
								<span>Create Another</span>
							</div>
						</div>
						<div className={styles.rightActions}>
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
				</div>
			</ClickOutsideWrapper>
		</div>
	);
};

export default AddTaskPopup;
