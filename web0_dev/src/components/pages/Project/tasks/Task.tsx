import Spacing from '@/components/General/Spacing';
import styles from './Task.module.scss';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { Clock, Message } from '@/svgs';
import { Task as TaskType } from '@prisma/client';
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
			<div className={styles.tooltip}>
				<p>Ui Design</p>
			</div>
			<div className={styles.middle}>
				<h3>{task.title}</h3>
				<Spacing space={4} />
				<p>
					First, a disclaimer – the entire process writing a blog post often
					takes a couple of hours if you can type
				</p>
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
						<Clock fill={'var(--main)'} opacity={'0.6'} />
						<p>6h</p>
					</div>
					<div>
						<Message />
						<p>8</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Task;
