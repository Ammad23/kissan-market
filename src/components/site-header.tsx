import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { getCurrentSession } from "@/lib/auth";
import {
  adminNav,
  customerNav,
  getDefaultRouteForRole,
  publicNav,
  vendorNav,
} from "@/lib/navigation";

export async function SiteHeader() {
  const t = await getTranslations("common");
  const session = await getCurrentSession();
  const role = session?.user?.role;
  const navItems = [
    ...publicNav,
    ...(role === "CUSTOMER" ? customerNav : []),
    ...(role === "VENDOR" ? vendorNav : []),
    ...(role === "ADMIN" ? adminNav : []),
  ];

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <Link className="text-lg font-semibold text-brand-dark" href="/">
            {t("brand")}
          </Link>
          <LocaleSwitcher />
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted">
          {navItems.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className="rounded-full px-3 py-2 transition hover:bg-background hover:text-brand-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <Link
                href={getDefaultRouteForRole(session.user.role)}
                className="rounded-full border border-border px-4 py-2 font-medium text-brand-dark transition hover:bg-background"
              >
                {session.user.email}
              </Link>
              <SignOutButton className="rounded-full bg-brand px-4 py-2 font-semibold text-white transition hover:bg-brand-dark" />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-brand px-4 py-2 font-semibold text-white transition hover:bg-brand-dark"
            >
              {t("login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
