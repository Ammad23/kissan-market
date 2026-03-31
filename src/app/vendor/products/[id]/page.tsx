import { notFound } from "next/navigation";

import { createOrUpdateProductAction } from "@/app/actions/marketplace";
import { requireApprovedVendor } from "@/lib/auth";
import { formatCurrency, getActiveCategories, getVendorProductById, productUnits } from "@/lib/marketplace";

type VendorProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VendorProductPage({ params }: VendorProductPageProps) {
  await requireApprovedVendor();
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getVendorProductById(id),
    getActiveCategories("en"),
  ]);

  if (!product) {
    notFound();
  }

  const en = product.translations.find((item) => item.locale === "EN");
  const ur = product.translations.find((item) => item.locale === "UR");
  const price = product.currentPrices[0];

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12 lg:px-10">
      <section className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <h1 className="text-4xl font-semibold tracking-tight text-brand-dark">
          Edit product
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          Update localized content, stock, and daily pricing from one screen.
        </p>

        <form action={createOrUpdateProductAction} className="mt-8 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="productId" value={product.id} />
          <select name="categoryId" defaultValue={product.categoryId} className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.translations.find((item) => item.locale === "EN")?.name ?? category.slug}
              </option>
            ))}
          </select>
          <input name="sku" defaultValue={product.sku} placeholder="SKU" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" required />
          <input name="nameEn" defaultValue={en?.name ?? ""} placeholder="English name" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" required />
          <input name="nameUr" defaultValue={ur?.name ?? ""} placeholder="Urdu name" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" required />
          <input name="shortDescriptionEn" defaultValue={en?.shortDescription ?? ""} placeholder="English short description" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" />
          <input name="shortDescriptionUr" defaultValue={ur?.shortDescription ?? ""} placeholder="Urdu short description" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" />
          <textarea name="descriptionEn" defaultValue={en?.description ?? ""} placeholder="English description" className="min-h-32 rounded-2xl border border-border bg-background px-4 py-3 outline-none md:col-span-2" />
          <textarea name="descriptionUr" defaultValue={ur?.description ?? ""} placeholder="Urdu description" className="min-h-32 rounded-2xl border border-border bg-background px-4 py-3 outline-none md:col-span-2" />
          <input name="imageUrl" defaultValue={product.imageUrl ?? ""} placeholder="Image URL" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none md:col-span-2" />
          <select name="defaultUnit" defaultValue={product.defaultUnit} className="rounded-2xl border border-border bg-background px-4 py-3 outline-none">
            {productUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          <input type="number" name="price" min="0" step="0.01" defaultValue={price ? Number(price.price) : 0} placeholder="Current price" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" required />
          <input type="number" name="quantityAvailable" min="0" step="0.001" defaultValue={product.inventory ? Number(product.inventory.quantityAvailable) : 0} placeholder="Quantity available" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" required />
          <input type="number" name="lowStockThreshold" min="0" step="0.001" defaultValue={product.inventory?.lowStockThreshold ? Number(product.inventory.lowStockThreshold) : 0} placeholder="Low stock threshold" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" />
          <label className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-brand-dark">
            <input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} />
            Featured on storefront
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-brand-dark">
            <input type="checkbox" name="isActive" defaultChecked={product.isActive} />
            Product is active
          </label>
          <button className="rounded-2xl bg-brand px-4 py-3 font-semibold text-white md:col-span-2 md:justify-self-start">
            Save changes
          </button>
        </form>

        <div className="mt-10 rounded-[28px] bg-background p-6">
          <h2 className="text-xl font-semibold text-brand-dark">Recent price history</h2>
          <div className="mt-4 grid gap-3">
            {product.priceHistory.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm">
                <span>{entry.unit}</span>
                <span className="font-semibold text-brand-dark">{formatCurrency(entry.price)}</span>
                <span className="text-muted">
                  {entry.effectiveFrom.toLocaleDateString("en-PK")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
