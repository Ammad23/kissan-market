import { requireRole } from "@/lib/auth";

const vendorModules = [
  "Products and localized descriptions",
  "Inventory by kg, bag, piece, or bundle",
  "Daily price updates with history",
  "Orders, pickup, and vendor delivery",
  "Sales analytics and low-stock insights",
];

export default async function VendorPage() {
  const session = await requireRole(["VENDOR", "ADMIN"]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <div className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <span className="rounded-full bg-[#eef1fb] px-4 py-2 text-sm font-semibold text-[#33427c]">
          Vendor dashboard foundation
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-brand-dark">
          Seller operations for KISSAN vendors
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          This section will evolve into the vendor panel where sellers manage
          products, stock, prices, orders, and sales performance.
        </p>
        <p className="mt-4 text-sm font-medium text-brand">
          Signed in as {session.user.email} with role {session.user.role}.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {vendorModules.map((module) => (
            <div
              key={module}
              className="rounded-2xl border border-border bg-background p-5"
            >
              <p className="font-medium text-brand-dark">{module}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
