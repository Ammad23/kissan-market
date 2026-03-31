import Link from "next/link";

import { StatusChart } from "@/components/charts/status-chart";
import { requireRole } from "@/lib/auth";
import { formatCurrency, getAdminChartData, getAdminSummary } from "@/lib/marketplace";

export default async function AdminPage() {
  const session = await requireRole(["ADMIN"]);
  const [summary, chartData] = await Promise.all([getAdminSummary(), getAdminChartData()]);

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

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-border bg-background p-5">
            <p className="text-sm text-muted">Vendors</p>
            <p className="mt-2 text-2xl font-semibold text-brand-dark">{summary.vendors}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5">
            <p className="text-sm text-muted">Pending approvals</p>
            <p className="mt-2 text-2xl font-semibold text-brand-dark">{summary.pendingVendors}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5">
            <p className="text-sm text-muted">Orders</p>
            <p className="mt-2 text-2xl font-semibold text-brand-dark">{summary.orders}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5">
            <p className="text-sm text-muted">Commission earned</p>
            <p className="mt-2 text-2xl font-semibold text-brand-dark">
              {formatCurrency(summary.commissionTotal)}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] bg-background p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-brand-dark">Revenue by order status</h2>
              <Link className="text-sm font-semibold text-brand" href="/admin/orders">
                Review orders
              </Link>
            </div>
            <div className="mt-4">
              <StatusChart data={chartData} color="#33427c" />
            </div>
          </div>

          <div className="rounded-[28px] bg-background p-6">
            <h2 className="text-xl font-semibold text-brand-dark">Admin modules</h2>
            <div className="mt-4 grid gap-3">
              {[
                { href: "/admin/vendors", label: "Vendor approvals and lifecycle management" },
                { href: "/admin/categories", label: "Category governance and catalog management" },
                { href: "/admin/orders", label: "Platform orders and payment monitoring" },
                { href: "/vendor", label: "Preview vendor panel" },
              ].map((module) => (
                <Link
                  key={module.href}
                  href={module.href}
                  className="rounded-2xl border border-border bg-white p-4 font-medium text-brand-dark transition hover:bg-[#eef1fb]"
                >
                  {module.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {summary.recentOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-border bg-background p-5"
            >
              <p className="font-medium text-brand-dark">
                {order.orderNumber} · {order.vendor.businessName}
              </p>
              <p className="mt-2 text-sm text-muted">
                {order.customer.user?.email ?? "Customer"} · {order.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
