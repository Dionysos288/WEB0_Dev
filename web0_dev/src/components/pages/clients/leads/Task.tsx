import styles from './Task.module.scss';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { clientType } from '@/components/types/types';
const Task = ({ task }: { task: clientType }) => {
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
				<p>{task.category}</p>
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
				<div className={styles.rightSide}>
					<h3>{task.name}</h3>{' '}
					{task.company !== null && <h3>| {task.company}</h3>}
				</div>
			</div>
		</div>
	);
};

export default Task;
