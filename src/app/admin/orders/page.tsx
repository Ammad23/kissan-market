import { updateOrderStatusAction } from "@/app/actions/marketplace";
import { requireRole } from "@/lib/auth";
import { formatCurrency, getAdminOrders, orderStatuses } from "@/lib/marketplace";

export default async function AdminOrdersPage() {
  await requireRole(["ADMIN"]);
  const orders = await getAdminOrders();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <section className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <h1 className="text-4xl font-semibold tracking-tight text-brand-dark">
          Platform orders
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          Monitor order states, payment status, and vendor fulfillment progress.
        </p>

        <div className="mt-8 grid gap-4">
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
                  <p className="mt-2 text-sm text-muted">
                    {order.customer.user?.email ?? "Customer"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-brand-dark">
                    {formatCurrency(order.totalAmount)}
                  </p>
                  <p className="mt-1 text-sm text-muted">{order.paymentStatus}</p>
                </div>
              </div>

              <form action={updateOrderStatusAction} className="mt-5 flex flex-wrap items-center gap-3">
                <input type="hidden" name="orderId" value={order.id} />
                <select
                  name="status"
                  defaultValue={order.status}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm outline-none"
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark">
                  Update
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
