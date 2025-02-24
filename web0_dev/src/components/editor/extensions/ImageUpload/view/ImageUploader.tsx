import Spinner from '@/components/editor/components/Loader/Loader';
import { useDropZone, useFileUpload, useUploader } from './hooks';
import { Button } from '@/components/editor/components/Button/Button';
import { Icon } from '@/components/editor/components/Icon';
import { ChangeEvent, useCallback } from 'react';
import styles from './ImageUploader.module.css';

export const ImageUploader = ({
	onUpload,
}: {
	onUpload: (url: string) => void;
}) => {
	const { loading, uploadFile } = useUploader({ onUpload });
	const { handleUploadClick, ref } = useFileUpload();
	const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({
		uploader: uploadFile,
	});

	const onFileChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) =>
			e.target.files ? uploadFile(e.target.files[0]) : null,
		[uploadFile]
	);

	if (loading) {
		return (
			<div className={styles.loaderContainer}>
				<Spinner />
			</div>
		);
	}

	return (
		<div
			className={`${styles.wrapper} ${
				draggedInside ? styles.draggedInside : ''
			}`}
			onDrop={onDrop}
			onDragOver={onDragEnter}
			onDragLeave={onDragLeave}
			contentEditable={false}
		>
			<Icon name="Image" className={styles.icon} />
			<div className={styles.textContainer}>
				<div className={styles.text}>
					{draggedInside ? 'Drop image here' : 'Drag and drop or'}
				</div>
				<div>
					<Button
						disabled={draggedInside}
						onClick={handleUploadClick}
						variant="primary"
						buttonSize="small"
					>
						<Icon name="Upload" />
						Upload an image
					</Button>
				</div>
			</div>
			<input
				className={styles.fileInput}
				ref={ref}
				type="file"
				accept=".jpg,.jpeg,.png,.webp,.gif"
				onChange={onFileChange}
			/>
		</div>
	);
};

export default ImageUploader;
