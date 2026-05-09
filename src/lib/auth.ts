import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "username",
      credentials: {
        name: { label: "用户名", type: "text" },
      },
      authorize: async (credentials) => {
        const name = (credentials as { name?: string })?.name?.trim();
        if (!name || name.length < 2 || name.length > 20) return null;
        if (/[<>{}]/.test(name)) return null;

        // Find or create user by name
        let user = await prisma.user.findFirst({
          where: { name },
        });
        if (!user) {
          user = await prisma.user.create({
            data: { name, role: "user" },
          });
        }
        return { id: user.id, name: user.name, image: user.image };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/community/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
