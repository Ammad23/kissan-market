import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "CUSTOMER" | "VENDOR" | "ADMIN";
    };
  }

  interface User {
    role: "CUSTOMER" | "VENDOR" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "CUSTOMER" | "VENDOR" | "ADMIN";
  }
}
