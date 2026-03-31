export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-6 rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
          <span className="w-fit rounded-full bg-brand px-4 py-2 text-sm font-semibold tracking-wide text-white">
            KISSAN
          </span>
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-brand-dark sm:text-5xl">
                A Pakistan-first agriculture marketplace for customers, vendors,
                and admins.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted">
                This starter project sets up the KISSAN platform foundation with
                Next.js, Prisma, NextAuth, storefront routes, vendor/admin
                sections, and a production-oriented marketplace schema.
              </p>
              <div className="flex flex-wrap gap-3 text-sm font-medium">
                <a
                  className="rounded-full bg-brand px-5 py-3 text-white transition hover:bg-brand-dark"
                  href="/shop"
                >
                  Explore storefront
                </a>
                <a
                  className="rounded-full border border-border px-5 py-3 transition hover:bg-[#eef3e4]"
                  href="/vendor"
                >
                  Vendor panel
                </a>
                <a
                  className="rounded-full border border-border px-5 py-3 transition hover:bg-[#eef3e4]"
                  href="/admin"
                >
                  Admin panel
                </a>
              </div>
            </div>

            <div className="grid gap-4 rounded-[28px] bg-[#edf4df] p-6">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-muted">Launch scope</p>
                <p className="mt-2 text-2xl font-semibold text-brand-dark">
                  Pakistan marketplace MVP
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-muted">Payments</p>
                  <p className="mt-2 font-semibold text-brand-dark">
                    COD, JazzCash, Easypaisa, local cards
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-muted">Auth</p>
                  <p className="mt-2 font-semibold text-brand-dark">
                    NextAuth with customer, vendor, and admin roles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Storefront",
              copy: "Mobile-first shopping flow for fresh produce, offers, checkout, and customer accounts.",
              href: "/shop",
            },
            {
              title: "Vendor Operations",
              copy: "Daily pricing, inventory updates, product management, orders, and performance metrics.",
              href: "/vendor",
            },
            {
              title: "Admin Oversight",
              copy: "Vendor approvals, commissions, platform reporting, and catalog governance.",
              href: "/admin",
            },
            {
              title: "Data Foundation",
              copy: "Prisma schema includes NextAuth, products, orders, payments, payouts, and localization models.",
              href: "/login",
            },
          ].map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="rounded-[28px] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-brand-dark">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">{item.copy}</p>
            </a>
          ))}
        </section>
      </section>
    </main>
  );
}
