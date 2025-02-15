import styles from './Task.module.scss';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { Phase, Task as TaskType, projectPriority } from '@prisma/client';
import Clock from '@/svgs/Clock';
import ChatText from '@/svgs/ChatText';
import PhaseIcon from '@/svgs/Phase';
import Text from '@/svgs/Text';
import { useRouter } from 'next/navigation';

interface TaskProps {
	task: TaskType & { phase?: Phase };
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

	const getPriorityClass = (priority: projectPriority) => {
		switch (priority) {
			case 'noPriority':
				return styles.noPriority;
			case 'low':
				return styles.low;
			case 'medium':
				return styles.medium;
			case 'high':
				return styles.high;
			case 'urgent':
				return styles.urgent;
			default:
				return styles.noPriority;
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
			<div className={styles.row} data-handle>
				{task.status === 'Backlog' && (
					<Text fill={'var(--main-70)'} width="14" height="14" />
				)}
				{task.status === 'todo' && (
					<Text fill={'var(--main-70)'} width="14" height="14" />
				)}
				{task.status === 'inProgress' && (
					<Text fill={'var(--main-70)'} width="14" height="14" />
				)}
				{task.status === 'inReview' && (
					<Text fill={'var(--main-70)'} width="14" height="14" />
				)}
				{task.status === 'Completed' && (
					<Text fill={'var(--main-70)'} width="14" height="14" />
				)}
				{task.status === 'canceled' && (
					<Text fill={'var(--main-70)'} width="14" height="14" />
				)}
				<h3>{task.title}</h3>
			</div>

			<div className={styles.bottom}>
				<div className={styles.imgWrapper}>
					<Image
						src={'https://placehold.co/24'}
						alt="profilePic"
						width={24}
						height={24}
					/>
				</div>
				<div className={`${styles.wrapper} ${getPriorityClass(task.priority)}`}>
					<p>{task.priority}</p>
				</div>
				<div className={styles.wrapper}>
					<PhaseIcon fill={'var(--main-70)'} width="12" height="12" />
					<p>{task.phase?.title}</p>
				</div>
				<div className={`${styles.wrapper} ${styles.full}`}>
					<Clock fill={'var(--main-70)'} width="12" height="12" />
					<p>6h</p>
				</div>
				<div className={`${styles.wrapper} ${styles.full}`}>
					<ChatText fill={'var(--main-70)'} width="12" height="12" />
					<p>8</p>
				</div>
			</div>
		</div>
	);
};

export default Task;
