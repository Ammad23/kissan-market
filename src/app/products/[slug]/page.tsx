import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { addToCartAction } from "@/app/actions/marketplace";
import { formatCurrency, formatNumber, getProductBySlug } from "@/lib/marketplace";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  const translation =
    product.translations.find((item) => item.locale === (locale === "ur" ? "UR" : "EN")) ??
    product.translations[0];
  const categoryTranslation = product.category.translations[0];
  const currentPrice = product.currentPrices[0];

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12 lg:px-10">
      <div className="grid gap-8 rounded-[32px] border border-border bg-card p-8 shadow-sm lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            {categoryTranslation?.name ?? product.category.slug}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-brand-dark">
            {translation?.name ?? product.slug}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            {translation?.description ||
              "Vendor-managed product with support for inventory, pricing history, and localized content."}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-background p-5">
              <p className="text-sm text-muted">Current price</p>
              <p className="mt-2 text-xl font-semibold text-brand-dark">
                {currentPrice ? formatCurrency(currentPrice.price) : "Not set"}
              </p>
            </div>
            <div className="rounded-2xl bg-background p-5">
              <p className="text-sm text-muted">Inventory</p>
              <p className="mt-2 text-xl font-semibold text-brand-dark">
                {product.inventory
                  ? `${formatNumber(product.inventory.quantityAvailable)} ${product.inventory.unit}`
                  : "Not set"}
              </p>
            </div>
            <div className="rounded-2xl bg-background p-5">
              <p className="text-sm text-muted">Vendor</p>
              <Link
                className="mt-2 block text-xl font-semibold text-brand-dark"
                href={`/vendors/${product.vendor.slug}`}
              >
                {product.vendor.businessName}
              </Link>
            </div>
          </div>

          <section className="mt-8 rounded-[28px] bg-background p-6">
            <h2 className="text-xl font-semibold text-brand-dark">Recent price history</h2>
            <div className="mt-4 grid gap-3">
              {product.priceHistory.length === 0 ? (
                <p className="text-sm text-muted">No price history yet.</p>
              ) : (
                product.priceHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-3 text-sm"
                  >
                    <span>{entry.unit}</span>
                    <span className="font-semibold text-brand-dark">
                      {formatCurrency(entry.price)}
                    </span>
                    <span className="text-muted">
                      {entry.effectiveFrom.toLocaleDateString("en-PK")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-5 rounded-[28px] bg-background p-6">
          <h2 className="text-2xl font-semibold text-brand-dark">Add to cart</h2>
          <form action={addToCartAction} className="space-y-4">
            <input type="hidden" name="productId" value={product.id} />
            <div>
              <label className="mb-2 block text-sm font-medium text-brand-dark">
                Unit
              </label>
              <select
                name="unit"
                defaultValue={currentPrice?.unit ?? product.defaultUnit}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none"
              >
                {product.currentPrices.map((price) => (
                  <option key={price.id} value={price.unit}>
                    {price.unit} - {formatCurrency(price.price)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-brand-dark">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                step="1"
                defaultValue="1"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none"
              />
            </div>
            <button className="w-full rounded-2xl bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-dark">
              Add to cart
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}
