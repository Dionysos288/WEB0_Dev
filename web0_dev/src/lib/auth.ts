import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";
import { customSession, organization } from "better-auth/plugins";
import { getSlug } from "@/actions/AccountActions";
const prisma = new PrismaClient();

const options = {
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization(),
    nextCookies(),
    customSession(async ({ user, session }) => {
      const organizationSlug = await getSlug(session.activeOrganizationId);
      return {
        user,
        session: {
          ...session,
          organizationSlug,
        },
      };
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth(options);

export type Session = typeof auth.$Infer.Session;
