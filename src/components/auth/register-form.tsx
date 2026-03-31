"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";

import {
  initialRegistrationState,
  registerUserAction,
} from "@/app/actions/auth";

type RegisterFormProps = {
  defaultRole?: "CUSTOMER" | "VENDOR";
};

export function RegisterForm({ defaultRole = "CUSTOMER" }: RegisterFormProps) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "VENDOR">(
    defaultRole,
  );
  const [state, formAction, isPending] = useActionState(
    registerUserAction,
    initialRegistrationState,
  );

  useEffect(() => {
    async function handleSuccessfulCustomerRegistration() {
      if (!state.success || state.role !== "CUSTOMER" || !state.email) {
        return;
      }

      const passwordInput = document.getElementById(
        "registration-password",
      ) as HTMLInputElement | null;
      const password = passwordInput?.value ?? "";

      if (!password) {
        router.push("/login?registered=customer");
        router.refresh();
        return;
      }

      const result = await signIn("credentials", {
        email: state.email,
        password,
        redirect: false,
        callbackUrl: "/account",
      });

      if (result?.error) {
        router.push("/login?registered=customer");
      } else {
        router.push(result?.url ?? "/account");
      }

      router.refresh();
    }

    if (state.success && state.role === "CUSTOMER") {
      void handleSuccessfulCustomerRegistration();
    }

    if (state.success && state.role === "VENDOR") {
      router.push("/login?registered=vendor");
      router.refresh();
    }
  }, [router, state]);

  return (
    <div className="space-y-5">
      <div className="inline-flex rounded-full border border-border bg-white p-1">
        {(["CUSTOMER", "VENDOR"] as const).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setSelectedRole(role)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedRole === role
                ? "bg-brand text-white"
                : "text-muted hover:text-brand-dark"
            }`}
          >
            {role === "CUSTOMER" ? "Customer" : "Vendor"}
          </button>
        ))}
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="role" value={selectedRole} />

        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-dark" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Muhammad Ali"
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-brand"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-dark" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="name@example.com"
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-brand"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-dark" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              placeholder="+92 300 0000000"
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-brand"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-brand-dark"
              htmlFor="registration-password"
            >
              Password
            </label>
            <input
              id="registration-password"
              type="password"
              name="password"
              placeholder="At least 8 characters"
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-brand"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-brand-dark"
            htmlFor="confirmPassword"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-brand"
            required
          />
        </div>

        {selectedRole === "VENDOR" ? (
          <>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-brand-dark"
                htmlFor="businessName"
              >
                Business name
              </label>
              <input
                id="businessName"
                name="businessName"
                placeholder="Kissan Fresh Farm"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-brand"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-brand-dark"
                htmlFor="address"
              >
                Business address
              </label>
              <textarea
                id="address"
                name="address"
                placeholder="Farm or business address"
                className="min-h-28 w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-brand"
              />
            </div>

            <p className="rounded-2xl bg-white px-4 py-3 text-sm text-muted">
              Vendor registrations stay pending until an admin approves the account.
            </p>
          </>
        ) : (
          <p className="rounded-2xl bg-white px-4 py-3 text-sm text-muted">
            Customer accounts become active immediately after registration.
          </p>
        )}

        {state.message ? (
          <p
            className={`rounded-2xl px-4 py-3 text-sm ${
              state.success
                ? "bg-[#edf7ea] text-[#2d6b3f]"
                : "bg-[#fff1ee] text-[#9b3d2e]"
            }`}
          >
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-2xl bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending
            ? "Creating account..."
            : selectedRole === "CUSTOMER"
              ? "Create customer account"
              : "Create vendor account"}
        </button>
      </form>

      <p className="text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-dark">
          Sign in
        </Link>
      </p>
    </div>
  );
}
