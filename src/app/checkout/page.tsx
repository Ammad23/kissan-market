import { createAddressAction, createCodOrderAction } from "@/app/actions/marketplace";
import { formatCurrency, getCustomerAddresses, getCustomerCart } from "@/lib/marketplace";

export default async function CheckoutPage() {
  const [cart, addresses] = await Promise.all([getCustomerCart(), getCustomerAddresses()]);
  const items = cart?.items ?? [];
  const vendorId = items[0]?.vendorId;
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.priceAtTime) * Number(item.quantity),
    0,
  );

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] border border-border bg-card p-8 shadow-sm">
          <h1 className="text-4xl font-semibold tracking-tight text-brand-dark">Checkout</h1>
          <p className="mt-4 text-lg leading-8 text-muted">
            Start with cash on delivery, pickup, or vendor delivery for the first MVP release.
          </p>

          <div className="mt-8 rounded-[28px] bg-background p-6">
            <h2 className="text-xl font-semibold text-brand-dark">Delivery addresses</h2>
            <div className="mt-4 grid gap-3">
              {addresses.map((address) => (
                <div key={address.id} className="rounded-2xl bg-white p-4 text-sm">
                  <p className="font-semibold text-brand-dark">{address.fullName}</p>
                  <p className="mt-1 text-muted">
                    {address.addressLine1}, {address.city}
                  </p>
                </div>
              ))}
              {addresses.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">
                  Add your first delivery address below.
                </p>
              ) : null}
            </div>

            <form action={createAddressAction} className="mt-6 grid gap-3 md:grid-cols-2">
              <input name="label" placeholder="Label" className="rounded-2xl border border-border bg-white px-4 py-3 outline-none" />
              <input name="fullName" placeholder="Full name" className="rounded-2xl border border-border bg-white px-4 py-3 outline-none" required />
              <input name="phone" placeholder="Phone" className="rounded-2xl border border-border bg-white px-4 py-3 outline-none" required />
              <input name="city" placeholder="City" className="rounded-2xl border border-border bg-white px-4 py-3 outline-none" required />
              <input name="area" placeholder="Area" className="rounded-2xl border border-border bg-white px-4 py-3 outline-none" />
              <input name="postalCode" placeholder="Postal code" className="rounded-2xl border border-border bg-white px-4 py-3 outline-none" />
              <input name="addressLine1" placeholder="Address line 1" className="rounded-2xl border border-border bg-white px-4 py-3 outline-none md:col-span-2" required />
              <input name="addressLine2" placeholder="Address line 2" className="rounded-2xl border border-border bg-white px-4 py-3 outline-none md:col-span-2" />
              <label className="flex items-center gap-2 text-sm font-medium text-brand-dark">
                <input type="checkbox" name="isDefault" />
                Set as default
              </label>
              <button className="rounded-2xl bg-brand px-4 py-3 font-semibold text-white md:justify-self-start">
                Save address
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-[32px] border border-border bg-card p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-brand-dark">Order review</h2>
          <div className="mt-6 grid gap-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-background p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-brand-dark">
                    {item.product.translations[0]?.name ?? item.product.slug}
                  </p>
                  <p className="font-semibold text-brand-dark">
                    {formatCurrency(Number(item.priceAtTime) * Number(item.quantity))}
                  </p>
                </div>
                <p className="mt-1 text-muted">
                  {item.vendorId === vendorId ? item.product.vendor.businessName : "Vendor"} · {Number(item.quantity)} {item.unit}
                </p>
              </div>
            ))}
            {items.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted">
                Your cart is empty.
              </p>
            ) : null}
          </div>

          <form action={createCodOrderAction} className="mt-8 grid gap-4 rounded-[28px] bg-background p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-brand-dark">
                Fulfillment type
              </label>
              <select
                name="fulfillmentType"
                defaultValue="PICKUP"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none"
              >
                <option value="PICKUP">Pickup</option>
                <option value="VENDOR_DELIVERY">Vendor delivery</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-brand-dark">
                Shipping address
              </label>
              <select
                name="shippingAddressId"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none"
                defaultValue={addresses[0]?.id ?? ""}
              >
                <option value="">Select address</option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.fullName} - {address.city}
                  </option>
                ))}
              </select>
            </div>

            <input type="hidden" name="deliveryFee" value="250" />

            <div className="rounded-2xl bg-white p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold text-brand-dark">{formatCurrency(subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted">Payment method</span>
                <span className="font-semibold text-brand-dark">Cash on Delivery</span>
              </div>
            </div>

            <button
              disabled={items.length === 0}
              className="rounded-2xl bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              Place COD order
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
