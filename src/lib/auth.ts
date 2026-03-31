import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cache } from "react";

import { getDefaultRouteForRole } from "@/lib/navigation";
import { prisma } from "@/lib/prisma";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash || !user.isActive) {
          return null;
        }

        const isValidPassword = await compare(password, user.passwordHash);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            role: true,
            isActive: true,
            name: true,
            email: true,
          },
        });

        if (!dbUser || !dbUser.isActive) {
          return {};
        }

        token.role = dbUser.role;
        token.name = dbUser.name;
        token.email = dbUser.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role ?? "CUSTOMER";
      }

      return session;
    },
  },
} satisfies NextAuthOptions;

export const getCurrentSession = cache(async () => {
  return getServerSession(authConfig);
});

export const getCurrentUser = cache(async () => {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      vendorProfile: true,
      customerProfile: true,
    },
  });
});

export async function requireRole(allowedRoles: Array<"CUSTOMER" | "VENDOR" | "ADMIN">) {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect("/");
  }

  return session;
}

export async function requireApprovedVendor() {
  const session = await requireRole(["VENDOR", "ADMIN"]);
  const user = await getCurrentUser();

  if (!user?.vendorProfile) {
    redirect("/");
  }

  if (session.user.role === "VENDOR" && user.vendorProfile.status !== "APPROVED") {
    redirect("/vendor?status=pending");
  }

  return { session, user };
}

export async function redirectAuthenticatedUser() {
  const session = await getCurrentSession();

  if (session?.user?.role) {
    redirect(getDefaultRouteForRole(session.user.role));
  }
}
