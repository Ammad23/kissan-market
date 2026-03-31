import Link from "next/link";

import { updateCartItemAction } from "@/app/actions/marketplace";
import { formatCurrency, formatNumber, getCustomerCart } from "@/lib/marketplace";

export default async function CartPage() {
  const cart = await getCustomerCart();
  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.priceAtTime) * Number(item.quantity),
    0,
  );

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12 lg:px-10">
      <section className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="rounded-full bg-[#edf4df] px-4 py-2 text-sm font-semibold text-brand-dark">
              Cart
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-brand-dark">
              Review your cart
            </h1>
          </div>
          <div className="rounded-2xl bg-background px-5 py-4 text-right">
            <p className="text-sm text-muted">Subtotal</p>
            <p className="mt-1 text-2xl font-semibold text-brand-dark">
              {formatCurrency(subtotal)}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-background p-8 text-muted">
              Your cart is empty. Browse the <Link href="/shop" className="font-semibold text-brand">storefront</Link> to add products.
            </div>
          ) : null}

          {items.map((item) => {
            const translation = item.product.translations.find((entry) => entry.locale === "EN") ?? item.product.translations[0];

            return (
              <article
                key={item.id}
                className="rounded-[28px] border border-border bg-background p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-brand-dark">
                      {translation?.name ?? item.product.slug}
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                      {item.product.vendor.businessName} · {item.unit} · {formatCurrency(item.priceAtTime)} each
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Stock:{" "}
                      {item.product.inventory
                        ? `${formatNumber(item.product.inventory.quantityAvailable)} ${item.product.inventory.unit}`
                        : "Not configured"}
                    </p>
                  </div>

                  <form action={updateCartItemAction} className="flex items-center gap-3">
                    <input type="hidden" name="itemId" value={item.id} />
                    <input
                      type="number"
                      name="quantity"
                      min="0"
                      step="1"
                      defaultValue={Number(item.quantity)}
                      className="w-24 rounded-full border border-border bg-white px-4 py-2 text-sm outline-none"
                    />
                    <button className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-white">
                      Update
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>

        {items.length > 0 ? (
          <div className="mt-8 flex justify-end">
            <Link
              href="/checkout"
              className="rounded-full bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand-dark"
            >
              Continue to checkout
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
