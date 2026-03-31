import { requireRole } from "@/lib/auth";

const adminModules = [
  "Vendor approval and lifecycle management",
  "Commission settings and payout reporting",
  "Platform-wide orders and payment monitoring",
  "Catalog governance and category management",
  "Growth, revenue, and vendor performance dashboards",
];

export default async function AdminPage() {
  const session = await requireRole(["ADMIN"]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <div className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <span className="rounded-full bg-[#fff1d8] px-4 py-2 text-sm font-semibold text-[#8a5a00]">
          Platform admin foundation
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-brand-dark">
          Admin control center
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          This area is reserved for internal KISSAN operators to manage vendors,
          commissions, categories, orders, and business intelligence.
        </p>
        <p className="mt-4 text-sm font-medium text-brand">
          Signed in as {session.user.email} with role {session.user.role}.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {adminModules.map((module) => (
            <div
              key={module}
              className="rounded-2xl border border-border bg-background p-5"
            >
              <p className="font-medium text-brand-dark">{module}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
