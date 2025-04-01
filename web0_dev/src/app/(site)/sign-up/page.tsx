'use client';

import { useState } from 'react';
import Image from 'next/image';
import { signUp, authClient } from '@/lib/auth-clients';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { convertImageToBase64 } from '@/utils/convertImageToBase64';

export default function Page() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div>
			<p>sign up</p>
			<label htmlFor="first-name">First name</label>
			<input
				id="first-name"
				placeholder="Max"
				required
				onChange={(e) => {
					setFirstName(e.target.value);
				}}
				value={firstName}
			/>

			<label htmlFor="last-name">Last name</label>
			<input
				id="last-name"
				placeholder="Robinson"
				required
				onChange={(e) => {
					setLastName(e.target.value);
				}}
				value={lastName}
			/>

			<label htmlFor="email">Email</label>
			<input
				id="email"
				type="email"
				placeholder="m@example.com"
				required
				onChange={(e) => {
					setEmail(e.target.value);
				}}
				value={email}
			/>

			<label htmlFor="password">Password</label>
			<input
				id="password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				autoComplete="new-password"
				placeholder="Password"
			/>

			<label htmlFor="password">Confirm Password</label>
			<input
				id="password_confirmation"
				type="password"
				value={passwordConfirmation}
				onChange={(e) => setPasswordConfirmation(e.target.value)}
				autoComplete="new-password"
				placeholder="Confirm Password"
			/>

			<label htmlFor="image">Profile Image (optional)</label>
			{imagePreview && (
				<div style={{ position: 'relative', width: '100px', height: '100px' }}>
					<Image
						src={imagePreview}
						alt="Profile preview"
						layout="fill"
						objectFit="cover"
					/>
				</div>
			)}
			<input
				id="image"
				type="file"
				accept="image/*"
				onChange={handleImageChange}
			/>
			{imagePreview && (
				<div
					className="cursor-pointer"
					onClick={() => {
						setImage(null);
						setImagePreview(null);
					}}
				/>
			)}

			<button
				type="submit"
				className="w-full"
				disabled={loading}
				onClick={async () => {
					await signUp.email({
						email,
						password,
						name: `${firstName} ${lastName}`,
						image: image ? await convertImageToBase64(image) : '',
						callbackURL: '/dashboard',
						fetchOptions: {
							onResponse: () => {
								setLoading(false);
							},
							onRequest: () => {
								setLoading(true);
							},
							onError: (ctx) => {
								toast.error(ctx.error.message);
							},
							onSuccess: async () => {
								router.push('/dashboard');
							},
						},
					});
					await authClient.organization.create({
						name: 'TEst123',
						slug: 'test123',
						logo: 'https://example.com/logo.png',
					});
					await authClient.organization.createTeam({
						name: 'Development Team',
					});
				}}
			>
				{loading ? 'loading...' : 'Create an account'}
			</button>
		</div>
	);
}
