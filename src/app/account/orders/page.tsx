import { requireRole } from "@/lib/auth";
import { formatCurrency, getCustomerOrders } from "@/lib/marketplace";

export default async function AccountOrdersPage() {
  await requireRole(["CUSTOMER", "ADMIN"]);
  const orders = await getCustomerOrders();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <section className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <h1 className="text-4xl font-semibold tracking-tight text-brand-dark">
          Your orders
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          Review order statuses, payment states, and vendor fulfillment progress.
        </p>

        <div className="mt-8 grid gap-4">
          {orders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-background p-8 text-muted">
              No orders yet. Add products to cart and complete checkout to create
              your first order.
            </div>
          ) : null}

          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-[28px] border border-border bg-background p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-brand">{order.orderNumber}</p>
                  <h2 className="mt-1 text-2xl font-semibold text-brand-dark">
                    {order.vendor.businessName}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
                    {order.status}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-brand-dark">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-white p-4 text-sm">
                  <p className="text-muted">Fulfillment</p>
                  <p className="mt-1 font-semibold text-brand-dark">{order.fulfillmentType}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-sm">
                  <p className="text-muted">Payment</p>
                  <p className="mt-1 font-semibold text-brand-dark">{order.paymentStatus}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-sm">
                  <p className="text-muted">Items</p>
                  <p className="mt-1 font-semibold text-brand-dark">{order.items.length}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-sm">
                  <p className="text-muted">Placed</p>
                  <p className="mt-1 font-semibold text-brand-dark">
                    {order.placedAt.toLocaleDateString("en-PK")}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
