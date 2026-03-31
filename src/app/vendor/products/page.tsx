import Link from "next/link";

import { requireApprovedVendor } from "@/lib/auth";
import { formatCurrency, formatNumber, getVendorProducts } from "@/lib/marketplace";

export default async function VendorProductsPage() {
  await requireApprovedVendor();
  const products = await getVendorProducts();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <section className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-brand-dark">
              Vendor products
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
              Manage localized product content, stock, and pricing from one place.
            </p>
          </div>
          <Link
            href="/vendor/products/new"
            className="rounded-full bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand-dark"
          >
            Add product
          </Link>
        </div>

        <div className="mt-8 grid gap-4">
          {products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-background p-8 text-muted">
              No products yet. Create your first listing to start selling.
            </div>
          ) : null}

          {products.map((product) => {
            const translation = product.translations.find((item) => item.locale === "EN") ?? product.translations[0];
            const categoryTranslation = product.category.translations.find((item) => item.locale === "EN") ?? product.category.translations[0];
            const price = product.currentPrices[0];

            return (
              <Link
                key={product.id}
                href={`/vendor/products/${product.id}`}
                className="grid gap-4 rounded-[28px] border border-border bg-background p-6 transition hover:shadow-sm md:grid-cols-[1.2fr_0.8fr]"
              >
                <div>
                  <p className="text-sm font-medium text-brand">
                    {categoryTranslation?.name ?? product.category.slug}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-brand-dark">
                    {translation?.name ?? product.slug}
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    SKU: {product.sku} · {product.defaultUnit} · {product.isActive ? "Active" : "Draft"}
                  </p>
                </div>

                <div className="grid gap-3 rounded-2xl bg-white p-4 text-sm">
                  <p>
                    Price:{" "}
                    <span className="font-semibold text-brand-dark">
                      {price ? formatCurrency(price.price) : "Pending"}
                    </span>
                  </p>
                  <p>
                    Stock:{" "}
                    <span className="font-semibold text-brand-dark">
                      {product.inventory
                        ? `${formatNumber(product.inventory.quantityAvailable)} ${product.inventory.unit}`
                        : "Missing"}
                    </span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
