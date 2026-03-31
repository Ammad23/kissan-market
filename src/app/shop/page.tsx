import Link from "next/link";
import { getLocale } from "next-intl/server";

import { addToCartAction } from "@/app/actions/marketplace";
import {
  formatCurrency,
  formatNumber,
  getActiveCategories,
  getProductPrimaryImage,
  getStorefrontProducts,
} from "@/lib/marketplace";

type ShopPageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    vendor?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const q = params?.q?.trim();
  const category = params?.category?.trim();
  const vendor = params?.vendor?.trim();
  const [categories, products] = await Promise.all([
    getActiveCategories(locale),
    getStorefrontProducts({
      locale,
      search: q,
      categorySlug: category,
      vendorSlug: vendor,
    }),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <section className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="rounded-full bg-[#edf4df] px-4 py-2 text-sm font-semibold text-brand-dark">
              Storefront
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-brand-dark">
              Browse fresh produce, vendor catalogs, and daily pricing
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
              Search across categories, compare vendors, and add unit-based items
              directly to your cart.
            </p>
          </div>

          <form className="grid gap-3 rounded-[28px] bg-background p-4 md:grid-cols-[1.5fr_1fr_auto]">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search tomatoes, onions, vendors..."
              className="rounded-2xl border border-border bg-white px-4 py-3 outline-none"
            />
            <select
              name="category"
              defaultValue={category ?? ""}
              className="rounded-2xl border border-border bg-white px-4 py-3 outline-none"
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.translations[0]?.name ?? item.slug}
                </option>
              ))}
            </select>
            <button className="rounded-2xl bg-brand px-4 py-3 font-semibold text-white">
              Apply
            </button>
          </form>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/shop?category=${item.slug}`}
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-brand-dark transition hover:bg-[#eef3e4]"
            >
              {item.translations[0]?.name ?? item.slug} ({item._count.products})
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-background p-8 text-muted">
              No products match the current filters yet. Seed demo data or add a
              product from the vendor dashboard.
            </div>
          ) : null}

          {products.map((product) => {
            const translation = product.translations[0] ?? product.translations[1];
            const categoryTranslation = product.category.translations[0];
            const price = product.currentPrices[0];
            const productImage = getProductPrimaryImage(product);

            return (
              <article
                key={product.id}
                className="rounded-[28px] border border-border bg-background p-6 shadow-sm"
              >
                <div className="mb-5 h-52 overflow-hidden rounded-[24px] bg-white">
                  {productImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={productImage}
                      alt={translation?.name ?? product.slug}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-muted">
                      No product image
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-brand">
                      {categoryTranslation?.name ?? product.category.slug}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-brand-dark">
                      {translation?.name ?? product.slug}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {translation?.shortDescription ||
                        translation?.description ||
                        "Fresh market item with daily vendor-managed pricing."}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted shadow-sm">
                    {product.defaultUnit}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 rounded-2xl bg-white p-4 text-sm text-muted">
                  <p>
                    Vendor:{" "}
                    <Link className="font-semibold text-brand-dark" href={`/vendors/${product.vendor.slug}`}>
                      {product.vendor.businessName}
                    </Link>
                  </p>
                  <p>Price: {price ? formatCurrency(price.price) : "Pending price"}</p>
                  <p>
                    Inventory:{" "}
                    {product.inventory
                      ? `${formatNumber(product.inventory.quantityAvailable)} ${product.inventory.unit}`
                      : "Not configured"}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-white"
                  >
                    View details
                  </Link>
                  <form action={addToCartAction} className="flex flex-wrap gap-2">
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="unit" value={price?.unit ?? product.defaultUnit} />
                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      step="1"
                      defaultValue="1"
                      className="w-20 rounded-full border border-border bg-white px-4 py-2 text-sm outline-none"
                    />
                    <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark">
                      Add to cart
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
