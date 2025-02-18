import * as schema from "~/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { lazy } from "./util";

export const auth = lazy((env: Env) =>
  betterAuth({
    database: drizzleAdapter(drizzle(env.USERS_DATABASE), {
      provider: "sqlite",
      schema: {
        account: schema.account,
        session: schema.session,
        user: schema.user,
        verification: schema.verification,
      },
    }),
    secret: env.SECRET,
    user: {
      additionalFields: {
        username: {
          type: "string",
          required: true,
          input: false,
        },
      },
    },
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        redirectURI: `${env.BASE_URL}/api/auth/callback/github`,
        scope: ["read:user"],
        mapProfileToUser(profile) {
          return { username: profile.login };
        },
      },
    },
  }),
);
