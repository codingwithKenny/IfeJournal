import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          // ✅ Validate input first
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // ✅ Find user
          const user = await prisma.admin.findUnique({
            where: { email: credentials.email },
          });

          if (!user) return null;

          // ✅ Compare password
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) return null;

          // ✅ Return safe user object
          return {
            id: user.id,
            email: user.email,
          };

        } catch (error) {
          console.error("Auth error:", error);
          return null; // ✅ NEVER throw (prevents build crash)
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login", // optional but good
  },

  secret: process.env.NEXTAUTH_SECRET,
};