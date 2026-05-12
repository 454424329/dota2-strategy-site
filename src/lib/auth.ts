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
        password: { label: "密码（仅管理员需要）", type: "password" },
      },
      authorize: async (credentials) => {
        const { name, password } = credentials as { name?: string; password?: string };
        const trimmedName = name?.trim();
        if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 20) return null;
        if (/[<>{}]/.test(trimmedName)) return null;

        const adminUser = process.env.ADMIN_USERNAME || "admin";
        const adminPass = process.env.ADMIN_PASSWORD;

        // Admin login: requires matching username + password
        if (trimmedName === adminUser && adminPass && password === adminPass) {
          let user = await prisma.user.findFirst({ where: { name: trimmedName } });
          if (!user) {
            user = await prisma.user.create({ data: { name: trimmedName, role: "admin" } });
          } else if (user.role !== "admin") {
            user = await prisma.user.update({ where: { id: user.id }, data: { role: "admin" } });
          }
          return { id: user.id, name: user.name, role: "admin" };
        }

        // Regular user login: no password needed for community features
        let user = await prisma.user.findFirst({
          where: { name: trimmedName },
        });
        if (!user) {
          user = await prisma.user.create({
            data: { name: trimmedName, role: "user" },
          });
        }
        return { id: user.id, name: user.name, role: user.role };
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
        token.role = (user as { role?: string }).role ?? "user";
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        (session.user as { role?: string }).role = (token.role as string) ?? "user";
      }
      return session;
    },
  },
});
