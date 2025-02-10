'use client';

import { useState } from 'react';
import { signIn } from '@/lib/auth-clients';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Page() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/';

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	const handleSignIn = async () => {
		try {
			await signIn.email({
				email,
				password,
				callbackURL: decodeURIComponent(callbackUrl),
			});
		} catch (error) {
			console.error('Sign in failed:', error);
		}
	};

	return (
		<div>
			<p>sign up</p>

			<div>
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
				<Link href="#" className="ml-auto inline-block text-sm underline">
					Forgot your password?
				</Link>

				<input
					id="password"
					type="password"
					placeholder="password"
					autoComplete="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<input
					type="checkbox"
					id="remember"
					onClick={() => {
						setRememberMe(!rememberMe);
					}}
				/>
				<label htmlFor="remember">Remember me</label>

				<button type="submit" disabled={loading} onClick={handleSignIn}>
					{loading ? 'loading...' : 'Login'}
				</button>

				<div>
					<button
						onClick={async () => {
							await signIn.social({
								provider: 'google',
								callbackURL: '/dashboard',
							});
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M11.99 13.9v-3.72h9.36c.14.63.25 1.22.25 2.05c0 5.71-3.83 9.77-9.6 9.77c-5.52 0-10-4.48-10-10S6.48 2 12 2c2.7 0 4.96.99 6.69 2.61l-2.84 2.76c-.72-.68-1.98-1.48-3.85-1.48c-3.31 0-6.01 2.75-6.01 6.12s2.7 6.12 6.01 6.12c3.83 0 5.24-2.65 5.5-4.22h-5.51z"
							></path>
						</svg>
					</button>
					<button
						onClick={async () => {
							await signIn.social({
								provider: 'github',
								callbackURL: '/dashboard',
							});
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
							></path>
						</svg>
					</button>
					<button
						onClick={async () => {
							await signIn.social({
								provider: 'apple',
								callbackURL: '/dashboard',
							});
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M17.05 20.28c-.98.95-2.05.8-3.08.35c-1.09-.46-2.09-.48-3.24 0c-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8c1.18-.24 2.31-.93 3.57-.84c1.51.12 2.65.72 3.4 1.8c-3.12 1.87-2.38 5.98.48 7.13c-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25c.29 2.58-2.34 4.5-3.74 4.25"
							></path>
						</svg>
					</button>
					<button
						onClick={async () => {
							await signIn.social({
								provider: 'microsoft',
								callbackURL: '/dashboard',
							});
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M2 3h9v9H2zm9 19H2v-9h9zM21 3v9h-9V3zm0 19h-9v-9h9z"
							></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
