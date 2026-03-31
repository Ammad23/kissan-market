import "server-only";

import {
  Locale,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  ProductUnit,
  VendorStatus,
} from "@prisma/client";
import { cache } from "react";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const currencyFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number | string | Prisma.Decimal) {
  return currencyFormatter.format(Number(value));
}

export function formatNumber(value: number | string | Prisma.Decimal) {
  return numberFormatter.format(Number(value));
}

export function getLocaleEnum(locale: string) {
  return locale === "ur" ? Locale.UR : Locale.EN;
}

export const getActiveCategories = cache(async (locale: string) => {
  const localeEnum = getLocaleEnum(locale);
  return prisma.category.findMany({
    where: { isActive: true },
    include: {
      translations: {
        where: { locale: localeEnum },
      },
      _count: {
        select: { products: true },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
});

export const getStorefrontProducts = cache(
  async ({
    locale,
    search,
    categorySlug,
    vendorSlug,
  }: {
    locale: string;
    search?: string;
    categorySlug?: string;
    vendorSlug?: string;
  }) => {
    const localeEnum = getLocaleEnum(locale);

    return prisma.product.findMany({
      where: {
        isActive: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(vendorSlug ? { vendor: { slug: vendorSlug } } : {}),
        ...(search
          ? {
              OR: [
                {
                  translations: {
                    some: {
                      locale: localeEnum,
                      name: { contains: search, mode: "insensitive" },
                    },
                  },
                },
                {
                  vendor: {
                    businessName: { contains: search, mode: "insensitive" },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        category: {
          include: {
            translations: { where: { locale: localeEnum } },
          },
        },
        vendor: true,
        translations: {
          where: { locale: localeEnum },
        },
        currentPrices: true,
        inventory: true,
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  },
);

export const getProductBySlug = cache(async (slug: string, locale: string) => {
  const localeEnum = getLocaleEnum(locale);
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      vendor: true,
      category: {
        include: {
          translations: { where: { locale: localeEnum } },
        },
      },
      translations: true,
      currentPrices: true,
      inventory: true,
      images: true,
      priceHistory: {
        take: 5,
        orderBy: { effectiveFrom: "desc" },
      },
    },
  });
});

export const getVendorStorefront = cache(async (slug: string, locale: string) => {
  const localeEnum = getLocaleEnum(locale);
  return prisma.vendor.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: {
          translations: { where: { locale: localeEnum } },
          currentPrices: true,
          inventory: true,
          category: {
            include: {
              translations: { where: { locale: localeEnum } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
});

export async function getVendorContext() {
  const user = await getCurrentUser();
  return user?.vendorProfile ?? null;
}

export const getVendorProducts = cache(async () => {
  const vendor = await getVendorContext();

  if (!vendor) {
    return [];
  }

  return prisma.product.findMany({
    where: { vendorId: vendor.id },
    include: {
      category: {
        include: {
          translations: true,
        },
      },
      translations: true,
      currentPrices: true,
      inventory: true,
    },
    orderBy: { updatedAt: "desc" },
  });
});

export const getVendorProductById = cache(async (productId: string) => {
  const vendor = await getVendorContext();

  if (!vendor) {
    return null;
  }

  return prisma.product.findFirst({
    where: { id: productId, vendorId: vendor.id },
    include: {
      translations: true,
      currentPrices: true,
      inventory: true,
      category: {
        include: {
          translations: true,
        },
      },
      priceHistory: {
        orderBy: { effectiveFrom: "desc" },
        take: 10,
      },
    },
  });
});

export const getVendorOrders = cache(async () => {
  const vendor = await getVendorContext();

  if (!vendor) {
    return [];
  }

  return prisma.order.findMany({
    where: { vendorId: vendor.id },
    include: {
      customer: {
        include: { user: true },
      },
      items: true,
      shippingAddress: true,
      payments: true,
    },
    orderBy: { placedAt: "desc" },
  });
});

export const getCustomerContext = cache(async () => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  if (user.customerProfile) {
    return user.customerProfile;
  }

  return prisma.customerProfile.create({
    data: { userId: user.id },
  });
});

export const getCustomerCart = cache(async () => {
  const customer = await getCustomerContext();

  if (!customer) {
    return null;
  }

  const cart = await prisma.cart.findFirst({
    where: { customerId: customer.id, status: "active" },
    include: {
      items: {
        include: {
          product: {
            include: {
              translations: true,
              vendor: true,
              currentPrices: true,
              inventory: true,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  if (cart) {
    return cart;
  }

  return prisma.cart.create({
    data: {
      customerId: customer.id,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              translations: true,
              vendor: true,
              currentPrices: true,
              inventory: true,
            },
          },
        },
      },
    },
  });
});

export const getCustomerOrders = cache(async () => {
  const customer = await getCustomerContext();

  if (!customer) {
    return [];
  }

  return prisma.order.findMany({
    where: { customerId: customer.id },
    include: {
      vendor: true,
      items: true,
      payments: true,
    },
    orderBy: { placedAt: "desc" },
  });
});

export const getCustomerAddresses = cache(async () => {
  const customer = await getCustomerContext();

  if (!customer) {
    return [];
  }

  return prisma.customerAddress.findMany({
    where: { customerId: customer.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
});

export const getAdminSummary = cache(async () => {
  const [vendors, pendingVendors, orders, categories, products, commissions, recentOrders] =
    await Promise.all([
      prisma.vendor.count(),
      prisma.vendor.count({ where: { status: VendorStatus.PENDING } }),
      prisma.order.count(),
      prisma.category.count(),
      prisma.product.count(),
      prisma.vendorCommission.aggregate({
        _sum: { commissionAmount: true },
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { placedAt: "desc" },
        include: {
          vendor: true,
          customer: { include: { user: true } },
          items: true,
        },
      }),
    ]);

  return {
    vendors,
    pendingVendors,
    orders,
    categories,
    products,
    commissionTotal: commissions._sum.commissionAmount ?? new Prisma.Decimal(0),
    recentOrders,
  };
});

export const getAdminVendors = cache(async () => {
  return prisma.vendor.findMany({
    include: {
      user: true,
      _count: {
        select: { products: true, orders: true },
      },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
});

export const getAdminCategories = cache(async () => {
  return prisma.category.findMany({
    include: {
      translations: true,
      _count: {
        select: { products: true, children: true },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
});

export const getAdminOrders = cache(async () => {
  return prisma.order.findMany({
    include: {
      customer: { include: { user: true } },
      vendor: true,
      items: true,
      payments: true,
    },
    orderBy: { placedAt: "desc" },
  });
});

export async function getVendorChartData() {
  const orders = await getVendorOrders();
  const counts = new Map<string, number>();

  orders.forEach((order) => {
    counts.set(order.status, (counts.get(order.status) ?? 0) + 1);
  });

  return Array.from(counts.entries()).map(([status, total]) => ({
    name: status.replaceAll("_", " "),
    total,
  }));
}

export async function getAdminChartData() {
  const orders = await prisma.order.findMany({
    select: {
      status: true,
      totalAmount: true,
    },
  });

  const totals = new Map<string, number>();

  orders.forEach((order) => {
    totals.set(order.status, (totals.get(order.status) ?? 0) + Number(order.totalAmount));
  });

  return Array.from(totals.entries()).map(([status, total]) => ({
    name: status.replaceAll("_", " "),
    total,
  }));
}

export async function createDefaultCatalogIfEmpty() {
  const categoryCount = await prisma.category.count();

  if (categoryCount > 0) {
    return;
  }

  const categories = [
    {
      slug: "vegetables",
      sortOrder: 1,
      translations: {
        create: [
          { locale: Locale.EN, name: "Vegetables", description: "Fresh daily vegetables" },
          { locale: Locale.UR, name: "سبزیاں", description: "تازہ روزانہ سبزیاں" },
        ],
      },
    },
    {
      slug: "fruits",
      sortOrder: 2,
      translations: {
        create: [
          { locale: Locale.EN, name: "Fruits", description: "Seasonal fruit selections" },
          { locale: Locale.UR, name: "پھل", description: "موسمی پھل" },
        ],
      },
    },
    {
      slug: "grains",
      sortOrder: 3,
      translations: {
        create: [
          { locale: Locale.EN, name: "Grains", description: "Staples and sacks" },
          { locale: Locale.UR, name: "اناج", description: "روزمرہ اناج اور بوریاں" },
        ],
      },
    },
  ] satisfies Array<Prisma.CategoryCreateInput>;

  for (const category of categories) {
    await prisma.category.create({ data: category });
  }
}

export const orderStatuses = Object.values(OrderStatus);
export const paymentMethods = Object.values(PaymentMethod);
export const paymentStatuses = Object.values(PaymentStatus);
export const productUnits = Object.values(ProductUnit);
