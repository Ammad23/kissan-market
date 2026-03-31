import Link from "next/link";

import { RegisterForm } from "@/components/auth/register-form";
import { redirectAuthenticatedUser } from "@/lib/auth";

type RegisterPageProps = {
  searchParams?: Promise<{
    role?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  await redirectAuthenticatedUser();
  const params = await searchParams;
  const defaultRole =
    params?.role?.toLowerCase() === "vendor" ? "VENDOR" : "CUSTOMER";

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <div className="grid gap-8 rounded-[32px] border border-border bg-card p-8 shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
        <div>
          <span className="rounded-full bg-[#edf4df] px-4 py-2 text-sm font-semibold text-brand-dark">
            Account registration
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-brand-dark">
            Join KISSAN as a customer or vendor
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            Customers can start shopping immediately after signup. Vendors can
            submit their business details and wait for admin approval before
            accessing the vendor panel.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] bg-background p-6">
              <h2 className="text-xl font-semibold text-brand-dark">
                Customer registration
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Create a buyer account, save addresses, shop the marketplace,
                and track your orders.
              </p>
              <Link
                href="/register?role=customer"
                className="mt-5 inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-white"
              >
                Register as customer
              </Link>
            </div>

            <div className="rounded-[28px] bg-background p-6">
              <h2 className="text-xl font-semibold text-brand-dark">
                Vendor registration
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Submit your shop details, then wait for admin approval before
                adding products, prices, and stock.
              </p>
              <Link
                href="/register?role=vendor"
                className="mt-5 inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-white"
              >
                Register as vendor
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-background p-6">
          <RegisterForm defaultRole={defaultRole} />
        </div>
      </div>
    </main>
  );
}
