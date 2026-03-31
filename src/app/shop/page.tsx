const storefrontSections = [
  "Featured seasonal produce",
  "Category filters for vegetables, fruits, herbs, and staples",
  "Vendor storefront discovery",
  "Offers and bundles",
  "Checkout with Pakistan payment methods",
];

export default function ShopPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <div className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <span className="rounded-full bg-[#edf4df] px-4 py-2 text-sm font-semibold text-brand-dark">
          Storefront foundation
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-brand-dark">
          Customer shopping experience
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          This route is the starting point for the public marketplace. It will
          host product discovery, categories, product detail pages, cart, and
          checkout for KISSAN customers.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {storefrontSections.map((section) => (
            <div
              key={section}
              className="rounded-2xl border border-border bg-background p-5"
            >
              <p className="font-medium text-brand-dark">{section}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
