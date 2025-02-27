import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn, signOut } from "next-auth/react";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials;
        const res = await fetch("http://127.0.0.1:8000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: username,
            password,
          }),
        });

        const result = await res.json();

        if (res.ok && result) {
          const user = result.user;
          const token = result.access_token;
          console.log("woooww", user);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            access_token: token, // Store the access token in the session
            twofa: true,
          };
        } else return null;
      },
    }),
    // ...add more providers here
  ],
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // JWT expiry (30 days)
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        console.log("udpate is triggered");
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.twofa = session.twofa;
      }
      // Persist the user and access token in JWT if the user is logged in
      if (user) {
        console.log("login is triggered", user);
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
        token.access_token = user.access_token; // Store the access token in JWT token
        token.twofa = user.twofa;
      }
      return token;
    },

    async session({ session, token }) {
      // Add the access token to the session object
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.phone = token.phone;
      session.access_token = token.access_token; // Include the access token in the session
      session.twofa = token.twofa;
      console.log("session", session);
      return session;
    },
  },

  pages: {
    signIn: "/",
    signOut: "/signout",
  },
};

export default NextAuth(authOptions);
