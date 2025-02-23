import styles from './Task.module.scss';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import {
	Phase,
	Task as TaskType,
	TimeLog,
	Comment,
	Label,
	Member,
} from '@prisma/client';
import Clock from '@/svgs/Clock';
import ChatText from '@/svgs/ChatText';
import PhaseIcon from '@/svgs/Phase';
import { useRouter } from 'next/navigation';
import Team from '@/svgs/Team';
import NoPriority from '@/svgs/NoPriority';
import MediumPriority from '@/svgs/MediumPriority';
import HighPriority from '@/svgs/HighPriority';
import UrgentPriority from '@/svgs/UrgentPriority';
import LowPriority from '@/svgs/LowPriority';
import { getDateFormat } from '@/utils/DateHooks';
import DatePicker from '@/svgs/DatePicker';

interface TaskProps {
	task: TaskType & {
		Phase?: Phase;
		Comment?: Comment[];
		timeLogs?: TimeLog[];
		labels?: Label[];
		assignees?: Member[];
	};
	orgUrl?: string;
}

const Task = ({ task, orgUrl }: TaskProps) => {
	const router = useRouter();
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: { type: 'task', task },
	});
	const style = { transition, transform: CSS.Transform.toString(transform) };

	const handleClick = (e: React.MouseEvent) => {
		// Prevent click when dragging
		if (isDragging) return;

		// Don't navigate if we're clicking on a draggable handle
		if ((e.target as HTMLElement).closest('[data-handle]')) return;

		if (orgUrl) {
			router.push(`/${orgUrl}/projects/${task.projectId}/tasks/${task.id}`);
		}
	};

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				{...attributes}
				{...listeners}
				style={style}
				className={`${styles.task} ${styles.dragging}`}
			></div>
		);
	}

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			style={style}
			className={styles.task}
			onClick={handleClick}
		>
			<div className={styles.topRow}>
				<p>{task.customId}</p>
			</div>
			<div className={styles.row} data-handle>
				{task.status === 'Backlog' && (
					<Team fill={'var(--main-70)'} width="14" height="14" />
				)}
				{task.status === 'todo' && (
					<Team fill={'var(--main-70)'} width="14" height="14" />
				)}
				{task.status === 'inProgress' && (
					<Team fill={'var(--main-70)'} width="14" height="14" />
				)}
				{task.status === 'inReview' && (
					<Team fill={'var(--main-70)'} width="14" height="14" />
				)}
				{task.status === 'Completed' && (
					<Team fill={'var(--main-70)'} width="14" height="14" />
				)}
				{task.status === 'canceled' && (
					<Team fill={'var(--main-70)'} width="14" height="14" />
				)}
				<h3>{task.title}</h3>
			</div>

			<div className={styles.bottom}>
				{task.assignees && task.assignees.length > 0 && (
					<div className={styles.assignees}>
						{task.assignees.map((assignee) => (
							<div className={styles.imgWrapper} key={assignee.id}>
								<Image
									src={'https://placehold.co/24'}
									alt={`User's profile picture`}
									width={24}
									height={24}
									className={styles.profileImage}
								/>
							</div>
						))}
					</div>
				)}
				<div className={`${styles.wrapper} `}>
					{task.priority === 'noPriority' && (
						<NoPriority fill={'var(--main)'} width="12" height="12" />
					)}
					{task.priority === 'low' && (
						<LowPriority fill={'var(--main)'} width="12" height="12" />
					)}
					{task.priority === 'medium' && (
						<MediumPriority fill={'var(--main)'} width="12" height="12" />
					)}
					{task.priority === 'high' && (
						<HighPriority fill={'var(--main)'} width="12" height="12" />
					)}
					{task.priority === 'urgent' && (
						<UrgentPriority fill={'var(--orange-90)'} width="12" height="12" />
					)}
				</div>
				{task.Phase && (
					<div className={styles.wrapper}>
						<PhaseIcon fill={'var(--main-70)'} width="12" height="12" />
						<p>{task.Phase?.title}</p>
					</div>
				)}
				{task.dueDate && (
					<div className={`${styles.wrapper} `}>
						<DatePicker fill={'var(--main-90)'} width="12" height="12" />
						<p>{getDateFormat(String(task.dueDate))}</p>
					</div>
				)}
				{(task.estimatedTime ||
					(task.timeLogs && task.timeLogs.length > 0)) && (
					<div className={`${styles.wrapper} `}>
						<Clock fill={'var(--main)'} width="12" height="12" />
						<p>{`${
							task.estimatedTime && task.timeLogs && task.timeLogs.length > 0
								? `${
										task.timeLogs.reduce((acc, log) => acc + log.duration, 0) /
										60
								  }h / ${task.estimatedTime / 60}h`
								: task.estimatedTime
								? `${task.estimatedTime / 60}h`
								: `${
										(task.timeLogs || []).reduce(
											(acc, log) => acc + log.duration,
											0
										) / 60
								  }h`
						}`}</p>
					</div>
				)}
				{task.labels && task.labels.length > 0 && (
					<>
						{task.labels.map((label) => (
							<div key={label.id} className={`${styles.wrapper}`}>
								<div
									className={styles.label}
									style={{ backgroundColor: label.color }}
								></div>
								<p>{label.name}</p>
							</div>
						))}
					</>
				)}
				{task.Comment && task.Comment.length > 0 && (
					<div className={`${styles.wrapper} ${styles.full}`}>
						<ChatText fill={'var(--main-70)'} width="12" height="12" />
						<p>{task.Comment.length}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Task;
