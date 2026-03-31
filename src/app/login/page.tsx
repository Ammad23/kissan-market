import { LoginForm } from "@/components/auth/login-form";
import { redirectAuthenticatedUser } from "@/lib/auth";

const accountTypes = [
  "Customers sign in to place and track orders",
  "Vendors sign in to manage catalog, pricing, and stock",
  "Admins sign in to manage vendors, commissions, and analytics",
];

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  await redirectAuthenticatedUser();
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl ?? "/auth/landing";

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12 lg:px-10">
      <div className="grid gap-8 rounded-[32px] border border-border bg-card p-8 shadow-sm lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
        <div>
          <span className="rounded-full bg-[#edf4df] px-4 py-2 text-sm font-semibold text-brand-dark">
            NextAuth entry point
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-brand-dark">
            Shared authentication for KISSAN
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            NextAuth will power customer, vendor, and admin sign-in flows on top
            of the Prisma schema added in this initial project setup.
          </p>

          <div className="mt-8 max-w-md rounded-[28px] border border-border bg-background p-6">
            <LoginForm callbackUrl={callbackUrl} />
          </div>
        </div>

        <div className="space-y-4 rounded-[28px] bg-background p-6">
          {accountTypes.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border bg-white p-4"
            >
              <p className="font-medium text-brand-dark">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
