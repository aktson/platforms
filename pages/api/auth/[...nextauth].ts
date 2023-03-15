import NextAuth, { Account, Profile, User, type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { LOCAL_URL } from "@/components/constants/local";
import { AdapterUser } from "next-auth/adapters";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;
let userAccount = null;
if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET)
	throw new Error("Failed to initialize Github authentication");

export const authOptions: NextAuthOptions = {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
			profile(profile) {
				return {
					id: profile.id.toString(),
					name: profile.name || profile.login,
					gh_username: profile.login,
					email: profile.email,
					image: profile.avatar_url,
				};
			},
		}),
		// CredentialsProvider({
		// 	// The name to display on the sign in form (e.g. "Sign in with...")
		// 	name: "credentials",
		// 	// `credentials` is used to generate a form on the sign in page.
		// 	// You can specify which fields should be submitted, by adding keys to the `credentials` object.
		// 	// e.g. domain, username, password, 2FA token, etc.
		// 	// You can pass any HTML attribute to the <input> tag through the object.
		// 	credentials: {
		// 		email: { label: "email", type: "email", placeholder: "jsmith" },
		// 		password: { label: "Password", type: "password" }
		// 	},
		// 	async authorize(credentials, req) {
		// 		const user = { id: "1", name: "J Smith", email: "jsmith@example.com", password: "ankit" }

		// 		try {
		// 			const user = await fetch(
		// 				`${process.env.NEXTAUTH_URL}/api/user/check-credentials`,
		// 				{
		// 					method: "POST",
		// 					headers: {
		// 						"Content-Type": "application/x-www-form-urlencoded",
		// 						accept: "application/json",
		// 					},
		// 					body: Object.entries(credentials?.password)
		// 						.map((e) => e.join("="))
		// 						.join("&"),
		// 				},
		// 			)

		// 			if (user) {
		// 				// Any object returned will be saved in `user` property of the JWT
		// 				console.log("user returned", user)
		// 				console.log("request", req)

		// 				return user
		// 			} else {
		// 				// If you return null then an error will be displayed advising the user to check their details.
		// 				return null

		// 				// You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
		// 			}
		// 		} catch (error) {
		// 			console.log("EROOR FROM AUTHORIZE", error)
		// 		}


		// 	}
		// })
	],
	pages: {
		signIn: `/login`,
		verifyRequest: `/login`,
		error: "/login", // Error code passed in query string as ?error=
	},
	adapter: PrismaAdapter(prisma),
	cookies: {
		sessionToken: {
			name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				// When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
				domain: VERCEL_DEPLOYMENT ? `.${LOCAL_URL}` : undefined,
				secure: VERCEL_DEPLOYMENT,
			},
		},
	},
	callbacks: {
		session: ({ session, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
				username: user.username,
			},
		}),
	},
};

export default NextAuth(authOptions);
