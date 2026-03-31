import { createOrUpdateProductAction } from "@/app/actions/marketplace";
import { requireApprovedVendor } from "@/lib/auth";
import { getActiveCategories, productUnits } from "@/lib/marketplace";

export default async function NewVendorProductPage() {
  await requireApprovedVendor();
  const categories = await getActiveCategories("en");

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12 lg:px-10">
      <section className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <h1 className="text-4xl font-semibold tracking-tight text-brand-dark">
          Add a product
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          Create a vendor listing with English and Urdu content, inventory, and the
          current price for one unit.
        </p>

        <form action={createOrUpdateProductAction} className="mt-8 grid gap-4 md:grid-cols-2">
          <select name="categoryId" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" required>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.translations.find((item) => item.locale === "EN")?.name ?? category.slug}
              </option>
            ))}
          </select>
          <input name="sku" placeholder="SKU" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" required />
          <input name="nameEn" placeholder="English name" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" required />
          <input name="nameUr" placeholder="Urdu name" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" required />
          <input name="shortDescriptionEn" placeholder="English short description" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" />
          <input name="shortDescriptionUr" placeholder="Urdu short description" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" />
          <textarea name="descriptionEn" placeholder="English description" className="min-h-32 rounded-2xl border border-border bg-background px-4 py-3 outline-none md:col-span-2" />
          <textarea name="descriptionUr" placeholder="Urdu description" className="min-h-32 rounded-2xl border border-border bg-background px-4 py-3 outline-none md:col-span-2" />
          <input name="imageUrl" placeholder="Cloudinary or public image URL" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none md:col-span-2" />
          <select name="defaultUnit" defaultValue="KG" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none">
            {productUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          <input type="number" name="price" min="0" step="0.01" placeholder="Current price" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" required />
          <input type="number" name="quantityAvailable" min="0" step="0.001" placeholder="Quantity available" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" required />
          <input type="number" name="lowStockThreshold" min="0" step="0.001" placeholder="Low stock threshold" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none" />
          <label className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-brand-dark">
            <input type="checkbox" name="isFeatured" />
            Featured on storefront
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-brand-dark">
            <input type="checkbox" name="isActive" defaultChecked />
            Publish immediately
          </label>
          <button className="rounded-2xl bg-brand px-4 py-3 font-semibold text-white md:col-span-2 md:justify-self-start">
            Save product
          </button>
        </form>
      </section>
    </main>
  );
}
