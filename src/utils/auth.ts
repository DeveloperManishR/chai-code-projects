import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./corsair";
import { user, session, account, verification } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";

const baseUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user,
            session,
            account,
            verification,
        },
    }),
    plugins: [nextCookies()],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            redirectURI: `${baseUrl}/api/auth/callback/google`,
        },
    },
});

export async function getServerSession() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session;
}
