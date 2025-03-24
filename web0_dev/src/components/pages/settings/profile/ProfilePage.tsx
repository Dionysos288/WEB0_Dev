'use client';
import Image from 'next/image';
import styles from './ProfilePage.module.scss';
import { Pencil } from 'lucide-react';
import { User } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import { updateUser } from '@/actions/AccountActions';
import { toast } from 'sonner';

const ProfilePage = ({ user }: { user: User }) => {
	const [firstName, setFirstName] = useState(user.name.split(' ')[0]);
	const [lastName, setLastName] = useState(user.name.split(' ')[1]);
	const [email, setEmail] = useState(user.email);
	const [image, setImage] = useState(user.image);
	const ref = useRef<HTMLInputElement>(null);
	const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleImageClick = () => {
		ref.current?.click();
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name === 'firstName') {
			setFirstName(e.target.value);
		} else if (e.target.name === 'lastName') {
			setLastName(e.target.value);
		} else if (e.target.name === 'email') {
			setEmail(e.target.value);
		}
	};

	useEffect(() => {
		if (updateTimeoutRef.current) {
			clearTimeout(updateTimeoutRef.current);
		}

		updateTimeoutRef.current = setTimeout(async () => {
			const { error } = await updateUser(
				user,
				firstName,
				lastName,
				email,
				image
			);
			if (error) {
				console.error(error);
				toast.error('Failed to update profile');
			} else {
				toast.success('Profile updated successfully');
			}
		}, 500);
		return () => {
			if (updateTimeoutRef.current) {
				clearTimeout(updateTimeoutRef.current);
			}
		};
	}, [firstName, lastName, email, user, image]);

	return (
		<div className={styles.profilePageWrapper}>
			<h2>Profile Details</h2>
			<div className={styles.profileDetails}>
				<div className={styles.profileImage} onClick={handleImageClick}>
					<Image src={image} alt={'Profile Image'} width={60} height={60} />
					<Pencil className={styles.pencilIcon} width={24} height={24} />
					<input
						type="file"
						id="profileImage"
						onChange={handleImageChange}
						ref={ref}
					/>
				</div>
				<div className={styles.profileDetailsRow}>
					<div className={styles.profileDetailsItem}>
						<input
							type="text"
							name="firstName"
							placeholder="First Name"
							value={firstName}
							onChange={handleChange}
						/>
					</div>
					<div className={styles.profileDetailsItem}>
						<input
							type="text"
							name="lastName"
							placeholder="Last Name"
							value={lastName}
							onChange={handleChange}
						/>
					</div>
				</div>
				<div className={styles.inputWrapper}>
					<label htmlFor="email" className={styles.label}>
						Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						className={styles.input}
						placeholder="test@email.com"
						value={email}
						onChange={handleChange}
					/>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
