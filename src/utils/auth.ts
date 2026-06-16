import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./corsair";
import { user, session, account, verification } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";

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
    emailAndPassword: {
        enabled: true,
    },
});

export async function getServerSession() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session;
}
