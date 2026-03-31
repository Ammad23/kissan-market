import Link from "next/link";

import { StatusChart } from "@/components/charts/status-chart";
import { requireApprovedVendor } from "@/lib/auth";
import {
  formatCurrency,
  getVendorChartData,
  getVendorOrders,
  getVendorProducts,
} from "@/lib/marketplace";

export default async function VendorPage() {
  const { session, user } = await requireApprovedVendor();
  const [products, orders, chartData] = await Promise.all([
    getVendorProducts(),
    getVendorOrders(),
    getVendorChartData(),
  ]);
  const lowStock = products.filter((product) => {
    const threshold = Number(product.inventory?.lowStockThreshold ?? 0);
    return product.inventory && Number(product.inventory.quantityAvailable) <= threshold;
  });
  const revenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <div className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <span className="rounded-full bg-[#eef1fb] px-4 py-2 text-sm font-semibold text-[#33427c]">
          Vendor dashboard foundation
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-brand-dark">
          Seller operations for KISSAN vendors
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          This section will evolve into the vendor panel where sellers manage
          products, stock, prices, orders, and sales performance.
        </p>
        <p className="mt-4 text-sm font-medium text-brand">
          Signed in as {session.user.email} with role {session.user.role}.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-border bg-background p-5">
            <p className="text-sm text-muted">Products</p>
            <p className="mt-2 text-2xl font-semibold text-brand-dark">{products.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5">
            <p className="text-sm text-muted">Orders</p>
            <p className="mt-2 text-2xl font-semibold text-brand-dark">{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5">
            <p className="text-sm text-muted">Low stock items</p>
            <p className="mt-2 text-2xl font-semibold text-brand-dark">{lowStock.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5">
            <p className="text-sm text-muted">Revenue</p>
            <p className="mt-2 text-2xl font-semibold text-brand-dark">{formatCurrency(revenue)}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] bg-background p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-brand-dark">Order pipeline</h2>
              <Link className="text-sm font-semibold text-brand" href="/vendor/orders">
                Manage orders
              </Link>
            </div>
            <div className="mt-4">
              <StatusChart data={chartData} />
            </div>
          </div>

          <div className="rounded-[28px] bg-background p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-brand-dark">Quick actions</h2>
              <span className="text-sm text-muted">{user.vendorProfile?.businessName}</span>
            </div>
            <div className="mt-4 grid gap-3">
              {[
                { href: "/vendor/products", label: "View products" },
                { href: "/vendor/products/new", label: "Add product" },
                { href: "/vendor/orders", label: "Process orders" },
                { href: "/shop", label: "Preview storefront" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="rounded-2xl border border-border bg-white px-4 py-3 font-medium text-brand-dark transition hover:bg-[#eef3e4]"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {products.slice(0, 6).map((product) => (
            <Link
              key={product.id}
              href={`/vendor/products/${product.id}`}
              className="rounded-2xl border border-border bg-background p-5 transition hover:shadow-sm"
            >
              <p className="font-medium text-brand-dark">
                {product.translations.find((item) => item.locale === "EN")?.name ?? product.slug}
              </p>
              <p className="mt-2 text-sm text-muted">
                {product.inventory
                  ? `${product.inventory.quantityAvailable.toString()} ${product.inventory.unit} in stock`
                  : "Inventory not configured"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
