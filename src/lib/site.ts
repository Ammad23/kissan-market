export const siteConfig = {
  name: "KISSAN",
  description:
    "Pakistan-focused agriculture marketplace for customers, vendors, and platform admins.",
  locales: ["en", "ur"] as const,
  defaultLocale: "en",
  paymentMethods: ["cod", "jazzcash", "easypaisa", "card_gateway"] as const,
  userRoles: ["CUSTOMER", "VENDOR", "ADMIN"] as const,
};

export type SiteLocale = (typeof siteConfig.locales)[number];
export type PaymentMethod = (typeof siteConfig.paymentMethods)[number];
