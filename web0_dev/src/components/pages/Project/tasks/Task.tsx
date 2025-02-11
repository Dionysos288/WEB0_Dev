import styles from './Task.module.scss';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { Phase, Task as TaskType } from '@prisma/client';
import Clock from '@/svgs/Clock';
import ChatText from '@/svgs/ChatText';
import PhaseIcon from '@/svgs/Phase';
import Text from '@/svgs/Text';

interface TaskProps {
	task: TaskType & { phase?: Phase };
}

const Task = ({ task }: TaskProps) => {
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
		>
			<div className={styles.row}>
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
				<div className={`${styles.wrapper} ${styles.low}`}>
					<p>Low</p>
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
