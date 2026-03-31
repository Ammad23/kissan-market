import { createCategoryAction, toggleCategoryAction } from "@/app/actions/marketplace";
import { requireRole } from "@/lib/auth";
import { getAdminCategories } from "@/lib/marketplace";

export default async function AdminCategoriesPage() {
  await requireRole(["ADMIN"]);
  const categories = await getAdminCategories();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <section className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <h1 className="text-4xl font-semibold tracking-tight text-brand-dark">
          Categories
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          Maintain category structure and bilingual storefront labels.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <form action={createCategoryAction} className="grid gap-3 rounded-[28px] bg-background p-6">
            <h2 className="text-xl font-semibold text-brand-dark">Add or update category</h2>
            <input name="slug" placeholder="Slug" className="rounded-2xl border border-border bg-white px-4 py-3 outline-none" />
            <input name="nameEn" placeholder="English name" className="rounded-2xl border border-border bg-white px-4 py-3 outline-none" required />
            <input name="nameUr" placeholder="Urdu name" className="rounded-2xl border border-border bg-white px-4 py-3 outline-none" required />
            <textarea name="descriptionEn" placeholder="English description" className="min-h-24 rounded-2xl border border-border bg-white px-4 py-3 outline-none" />
            <textarea name="descriptionUr" placeholder="Urdu description" className="min-h-24 rounded-2xl border border-border bg-white px-4 py-3 outline-none" />
            <button className="rounded-2xl bg-brand px-4 py-3 font-semibold text-white">
              Save category
            </button>
          </form>

          <div className="grid gap-4">
            {categories.map((category) => {
              const en = category.translations.find((item) => item.locale === "EN");
              const ur = category.translations.find((item) => item.locale === "UR");

              return (
                <article
                  key={category.id}
                  className="rounded-[28px] border border-border bg-background p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-brand">{category.slug}</p>
                      <h2 className="mt-1 text-2xl font-semibold text-brand-dark">
                        {en?.name ?? category.slug}
                      </h2>
                      <p className="mt-2 text-sm text-muted">{ur?.name ?? "Urdu label missing"}</p>
                    </div>
                    <div className="text-sm text-muted">
                      <p>{category._count.products} products</p>
                      <p>{category.isActive ? "Active" : "Inactive"}</p>
                    </div>
                  </div>
                  <form action={toggleCategoryAction} className="mt-5">
                    <input type="hidden" name="categoryId" value={category.id} />
                    <input type="hidden" name="isActive" value={String(category.isActive)} />
                    <button className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-brand-dark transition hover:bg-white">
                      {category.isActive ? "Disable category" : "Enable category"}
                    </button>
                  </form>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
