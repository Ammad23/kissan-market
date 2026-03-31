export type AppRole = "CUSTOMER" | "VENDOR" | "ADMIN";

export type NavItem = {
  href: string;
  label: string;
};

export const publicNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
];

export const customerNav: NavItem[] = [
  { href: "/account", label: "Account" },
  { href: "/account/orders", label: "Orders" },
  { href: "/checkout", label: "Checkout" },
];

export const vendorNav: NavItem[] = [
  { href: "/vendor", label: "Dashboard" },
  { href: "/vendor/products", label: "Products" },
  { href: "/vendor/orders", label: "Orders" },
];

export const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/vendors", label: "Vendors" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
];

export function getDefaultRouteForRole(role: AppRole) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "VENDOR":
      return "/vendor";
    case "CUSTOMER":
    default:
      return "/account";
  }
}

export function getDashboardTitleForRole(role: AppRole) {
  switch (role) {
    case "ADMIN":
      return "Admin control center";
    case "VENDOR":
      return "Vendor operations";
    case "CUSTOMER":
    default:
      return "Customer account";
  }
}
