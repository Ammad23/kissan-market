import { updateVendorStatusAction } from "@/app/actions/marketplace";
import { requireRole } from "@/lib/auth";
import { getAdminVendors } from "@/lib/marketplace";

export default async function AdminVendorsPage() {
  await requireRole(["ADMIN"]);
  const vendors = await getAdminVendors();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 lg:px-10">
      <section className="rounded-[32px] border border-border bg-card p-8 shadow-sm lg:p-12">
        <h1 className="text-4xl font-semibold tracking-tight text-brand-dark">
          Vendors
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
          Approve new sellers, suspend accounts, and review catalog activity.
        </p>

        <div className="mt-8 grid gap-4">
          {vendors.map((vendor) => (
            <article
              key={vendor.id}
              className="rounded-[28px] border border-border bg-background p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-brand">{vendor.status}</p>
                  <h2 className="mt-1 text-2xl font-semibold text-brand-dark">
                    {vendor.businessName}
                  </h2>
                  <p className="mt-2 text-sm text-muted">{vendor.user.email}</p>
                </div>
                <div className="grid gap-2 text-sm text-muted md:text-right">
                  <p>{vendor._count.products} products</p>
                  <p>{vendor._count.orders} orders</p>
                </div>
              </div>

              <form action={updateVendorStatusAction} className="mt-5 flex flex-wrap items-center gap-3">
                <input type="hidden" name="vendorId" value={vendor.id} />
                <select
                  name="status"
                  defaultValue={vendor.status}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm outline-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
                <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark">
                  Save status
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
