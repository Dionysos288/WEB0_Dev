import Spacing from '@/components/General/Spacing';
import styles from './Task.module.scss';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { Task as TaskType } from '@prisma/client';
import getTaskPriority from '@/utils/GetTaskPriority';
import Clock from '@/svgs/Clock';
import ChatText from '@/svgs/ChatText';
const Task = ({ task }: { task: TaskType }) => {
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
				<div className={styles.tooltip}>
					<p>Ui Design</p>
				</div>
				<div className={styles.tooltip}>
					<p>{getTaskPriority(task.priority)}</p>
				</div>
			</div>
			<div className={styles.middle}>
				<h3>{task.title}</h3>
				<Spacing space={4} />
				<p>{task.description}</p>
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
				<div className={styles.emojiWrapper}>
					<div>
						<Clock fill={'var(--main-60)'} width="12" height="12" />
						<p>6h</p>
					</div>
					<div>
						<ChatText fill={'var(--main-60)'} width="12" height="12" />
						<p>8</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Task;
