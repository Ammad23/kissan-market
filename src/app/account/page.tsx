import Link from "next/link";

import { getCurrentUser, requireRole } from "@/lib/auth";
import { formatCurrency, getCustomerAddresses, getCustomerOrders } from "@/lib/marketplace";

export default async function AccountPage() {
  await requireRole(["CUSTOMER", "ADMIN"]);
  const user = await getCurrentUser();
  const [orders, addresses] = await Promise.all([
    getCustomerOrders(),
    getCustomerAddresses(),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <section className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <span className="rounded-full bg-[#edf4df] px-4 py-2 text-sm font-semibold text-brand-dark">
          Customer account
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-brand-dark">
          Welcome back, {user?.name ?? user?.email ?? "Customer"}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          Manage your delivery addresses, review your recent orders, and continue
          through checkout.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-background p-5">
            <p className="text-sm text-muted">Recent orders</p>
            <p className="mt-2 text-2xl font-semibold text-brand-dark">{orders.length}</p>
          </div>
          <div className="rounded-2xl bg-background p-5">
            <p className="text-sm text-muted">Saved addresses</p>
            <p className="mt-2 text-2xl font-semibold text-brand-dark">{addresses.length}</p>
          </div>
          <div className="rounded-2xl bg-background p-5">
            <p className="text-sm text-muted">Last order total</p>
            <p className="mt-2 text-2xl font-semibold text-brand-dark">
              {orders[0] ? formatCurrency(orders[0].totalAmount) : "No orders yet"}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] bg-background p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-brand-dark">Saved addresses</h2>
              <Link className="text-sm font-semibold text-brand" href="/checkout">
                Add address at checkout
              </Link>
            </div>
            <div className="mt-4 grid gap-3">
              {addresses.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">
                  No addresses saved yet.
                </p>
              ) : (
                addresses.map((address) => (
                  <div key={address.id} className="rounded-2xl bg-white p-4 text-sm">
                    <p className="font-semibold text-brand-dark">{address.fullName}</p>
                    <p className="mt-1 text-muted">
                      {address.addressLine1}, {address.city}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[28px] bg-background p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-brand-dark">Recent orders</h2>
              <Link className="text-sm font-semibold text-brand" href="/account/orders">
                View all
              </Link>
            </div>
            <div className="mt-4 grid gap-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="rounded-2xl bg-white p-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-brand-dark">{order.orderNumber}</p>
                    <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-muted">{order.vendor.businessName}</p>
                  <p className="mt-1 font-medium text-brand-dark">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              ))}
              {orders.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">
                  Your orders will appear here after checkout.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
