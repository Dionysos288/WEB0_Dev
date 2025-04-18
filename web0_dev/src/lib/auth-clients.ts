import { createAuthClient } from 'better-auth/react';
import { organizationClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_APP_URL,
	plugins: [
		organizationClient({
			teams: {
				enabled: true,
			},
		}),
	],
});

export const { signIn, signOut, signUp, useSession } = authClient;
