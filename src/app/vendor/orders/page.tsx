import { updateOrderStatusAction } from "@/app/actions/marketplace";
import { requireApprovedVendor } from "@/lib/auth";
import { formatCurrency, getVendorOrders, orderStatuses } from "@/lib/marketplace";

export default async function VendorOrdersPage() {
  await requireApprovedVendor();
  const orders = await getVendorOrders();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <section className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <h1 className="text-4xl font-semibold tracking-tight text-brand-dark">
          Vendor orders
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          Process incoming orders, update fulfillment status, and complete COD deliveries.
        </p>

        <div className="mt-8 grid gap-4">
          {orders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-background p-8 text-muted">
              No orders yet.
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
                    {order.customer.user?.name ?? order.customer.user?.email ?? "Customer"}
                  </h2>
                </div>
                <p className="text-xl font-semibold text-brand-dark">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl bg-white p-4 text-sm">
                  <p className="text-muted">Status</p>
                  <p className="mt-1 font-semibold text-brand-dark">{order.status}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-sm">
                  <p className="text-muted">Payment</p>
                  <p className="mt-1 font-semibold text-brand-dark">{order.paymentStatus}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-sm">
                  <p className="text-muted">Fulfillment</p>
                  <p className="mt-1 font-semibold text-brand-dark">{order.fulfillmentType}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-sm">
                  <p className="text-muted">Items</p>
                  <p className="mt-1 font-semibold text-brand-dark">{order.items.length}</p>
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
                  Update status
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
