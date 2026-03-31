import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { formatCurrency, formatNumber, getVendorStorefront } from "@/lib/marketplace";

type VendorStorefrontPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function VendorStorefrontPage({ params }: VendorStorefrontPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const vendor = await getVendorStorefront(slug, locale);

  if (!vendor) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <section className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <span className="rounded-full bg-[#eef1fb] px-4 py-2 text-sm font-semibold text-[#33427c]">
          Vendor storefront
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-brand-dark">
          {vendor.businessName}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          {vendor.description ||
            "Browse this vendor's live catalog, localized product details, and daily unit-based pricing."}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-background p-5">
            <p className="text-sm text-muted">Supports pickup</p>
            <p className="mt-2 text-xl font-semibold text-brand-dark">
              {vendor.supportsPickup ? "Yes" : "No"}
            </p>
          </div>
          <div className="rounded-2xl bg-background p-5">
            <p className="text-sm text-muted">Supports delivery</p>
            <p className="mt-2 text-xl font-semibold text-brand-dark">
              {vendor.supportsDelivery ? "Yes" : "No"}
            </p>
          </div>
          <div className="rounded-2xl bg-background p-5">
            <p className="text-sm text-muted">Minimum order</p>
            <p className="mt-2 text-xl font-semibold text-brand-dark">
              {vendor.minimumOrderAmount ? formatCurrency(vendor.minimumOrderAmount) : "Not set"}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {vendor.products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-background p-8 text-muted">
              This vendor has not published products yet.
            </div>
          ) : null}

          {vendor.products.map((product) => {
            const translation = product.translations[0];
            const categoryTranslation = product.category.translations[0];
            const price = product.currentPrices[0];

            return (
              <article
                key={product.id}
                className="rounded-[28px] border border-border bg-background p-6 shadow-sm"
              >
                <p className="text-sm font-medium text-brand">
                  {categoryTranslation?.name ?? product.category.slug}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-brand-dark">
                  {translation?.name ?? product.slug}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {translation?.shortDescription || translation?.description || "Localized listing"}
                </p>
                <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-muted">
                  <p>Price: {price ? formatCurrency(price.price) : "Pending"}</p>
                  <p>
                    Stock:{" "}
                    {product.inventory
                      ? `${formatNumber(product.inventory.quantityAvailable)} ${product.inventory.unit}`
                      : "Not configured"}
                  </p>
                </div>
                <Link
                  href={`/products/${product.slug}`}
                  className="mt-5 inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-white"
                >
                  View product
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
