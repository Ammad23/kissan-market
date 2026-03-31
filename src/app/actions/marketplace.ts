"use server";

import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
  ProductUnit,
  VendorStatus,
} from "@prisma/client";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser, requireApprovedVendor, requireRole } from "@/lib/auth";
import { getCustomerContext, getVendorContext } from "@/lib/marketplace";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function decimal(value: FormDataEntryValue | null, fallback = "0") {
  return new Prisma.Decimal(String(value ?? fallback));
}

function bool(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

async function syncProductImages(productId: string, imageUrl: string | null) {
  if (!imageUrl) {
    await prisma.productImage.deleteMany({
      where: { productId },
    });
    return;
  }

  const existing = await prisma.productImage.findFirst({
    where: { productId, url: imageUrl },
    orderBy: { sortOrder: "asc" },
  });

  if (existing) {
    await prisma.productImage.updateMany({
      where: { productId },
      data: {
        sortOrder: 1,
      },
    });
    return;
  }

  await prisma.productImage.deleteMany({
    where: { productId },
  });

  await prisma.productImage.create({
    data: {
      productId,
      url: imageUrl,
      sortOrder: 1,
    },
  });
}

export async function createOrUpdateProductAction(formData: FormData) {
  const { session } = await requireApprovedVendor();
  const vendor = await getVendorContext();

  if (!vendor) {
    redirect("/vendor");
  }

  const productId = String(formData.get("productId") ?? "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const nameEn = String(formData.get("nameEn") ?? "");
  const nameUr = String(formData.get("nameUr") ?? "");
  const descriptionEn = String(formData.get("descriptionEn") ?? "");
  const descriptionUr = String(formData.get("descriptionUr") ?? "");
  const shortDescriptionEn = String(formData.get("shortDescriptionEn") ?? "");
  const shortDescriptionUr = String(formData.get("shortDescriptionUr") ?? "");
  const sku = String(formData.get("sku") ?? "").trim();
  const defaultUnit = String(formData.get("defaultUnit") ?? ProductUnit.KG) as ProductUnit;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const isFeatured = bool(formData.get("isFeatured"));
  const isActive = bool(formData.get("isActive"));
  const quantityAvailable = decimal(formData.get("quantityAvailable"), "0");
  const lowStockThreshold = decimal(formData.get("lowStockThreshold"), "0");
  const price = decimal(formData.get("price"), "0");

  const slug = slugify(nameEn || nameUr || sku);

  if (!categoryId || !slug || !sku || !nameEn || !nameUr) {
    throw new Error("Product requires category, SKU, and English/Urdu names.");
  }

  const payload = {
    categoryId,
    slug,
    sku,
    defaultUnit,
    isFeatured,
    isActive,
    imageUrl,
  };

  if (productId) {
    const existing = await prisma.product.findFirst({
      where: { id: productId, vendorId: vendor.id },
    });

    if (!existing) {
      throw new Error("Product not found.");
    }

    await prisma.product.update({
      where: { id: existing.id },
      data: {
        ...payload,
        translations: {
          upsert: [
            {
              where: {
                productId_locale: {
                  productId: existing.id,
                  locale: "EN",
                },
              },
              update: {
                name: nameEn,
                shortDescription: shortDescriptionEn,
                description: descriptionEn,
              },
              create: {
                locale: "EN",
                name: nameEn,
                shortDescription: shortDescriptionEn,
                description: descriptionEn,
              },
            },
            {
              where: {
                productId_locale: {
                  productId: existing.id,
                  locale: "UR",
                },
              },
              update: {
                name: nameUr,
                shortDescription: shortDescriptionUr,
                description: descriptionUr,
              },
              create: {
                locale: "UR",
                name: nameUr,
                shortDescription: shortDescriptionUr,
                description: descriptionUr,
              },
            },
          ],
        },
        inventory: {
          upsert: {
            create: {
              quantityAvailable,
              unit: defaultUnit,
              lowStockThreshold,
              isInStock: quantityAvailable.gt(0),
            },
            update: {
              quantityAvailable,
              unit: defaultUnit,
              lowStockThreshold,
              isInStock: quantityAvailable.gt(0),
              lastUpdatedAt: new Date(),
            },
          },
        },
        currentPrices: {
          upsert: {
            where: {
              productId_unit: {
                productId: existing.id,
                unit: defaultUnit,
              },
            },
            create: {
              unit: defaultUnit,
              price,
            },
            update: {
              price,
            },
          },
        },
      },
    });

    await syncProductImages(existing.id, imageUrl);

    await prisma.priceHistory.create({
      data: {
        productId: existing.id,
        unit: defaultUnit,
        price,
        effectiveFrom: new Date(),
        createdById: session.user.id,
      },
    });

    revalidatePath("/vendor");
    revalidatePath("/vendor/products");
    revalidatePath(`/vendor/products/${existing.id}`);
    revalidatePath("/shop");
    redirect(`/vendor/products/${existing.id}`);
  }

  const created = await prisma.product.create({
    data: {
      vendorId: vendor.id,
      ...payload,
      translations: {
        create: [
          {
            locale: "EN",
            name: nameEn,
            shortDescription: shortDescriptionEn,
            description: descriptionEn,
          },
          {
            locale: "UR",
            name: nameUr,
            shortDescription: shortDescriptionUr,
            description: descriptionUr,
          },
        ],
      },
      inventory: {
        create: {
          quantityAvailable,
          unit: defaultUnit,
          lowStockThreshold,
          isInStock: quantityAvailable.gt(0),
        },
      },
      currentPrices: {
        create: {
          unit: defaultUnit,
          price,
        },
      },
    },
  });

  await syncProductImages(created.id, imageUrl);

  await prisma.priceHistory.create({
    data: {
      productId: created.id,
      unit: defaultUnit,
      price,
      effectiveFrom: new Date(),
      createdById: session.user.id,
    },
  });

  revalidatePath("/vendor");
  revalidatePath("/vendor/products");
  revalidatePath("/shop");
  redirect(`/vendor/products/${created.id}`);
}

export async function addToCartAction(formData: FormData) {
  await requireRole(["CUSTOMER", "ADMIN"]);
  const customer = await getCustomerContext();

  if (!customer) {
    redirect("/login");
  }

  const productId = String(formData.get("productId") ?? "");
  const quantity = decimal(formData.get("quantity"), "1");
  const unit = String(formData.get("unit") ?? ProductUnit.KG) as ProductUnit;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      currentPrices: true,
    },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  let cart = await prisma.cart.findFirst({
    where: { customerId: customer.id, status: "active" },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        customerId: customer.id,
      },
    });
  }

  const matchedPrice =
    product.currentPrices.find((item) => item.unit === unit) ??
    product.currentPrices[0];

  if (!matchedPrice) {
    throw new Error("Product price is not configured.");
  }

  const existing = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      unit,
    },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity.add(quantity),
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        vendorId: product.vendorId,
        quantity,
        unit,
        priceAtTime: matchedPrice.price,
      },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/shop");
}

export async function updateCartItemAction(formData: FormData) {
  await requireRole(["CUSTOMER", "ADMIN"]);
  const itemId = String(formData.get("itemId") ?? "");
  const quantity = decimal(formData.get("quantity"), "1");

  if (quantity.lte(0)) {
    await prisma.cartItem.delete({
      where: { id: itemId },
    });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function createAddressAction(formData: FormData) {
  await requireRole(["CUSTOMER", "ADMIN"]);
  const customer = await getCustomerContext();

  if (!customer) {
    redirect("/login");
  }

  const address = await prisma.customerAddress.create({
    data: {
      customerId: customer.id,
      label: String(formData.get("label") ?? "Primary"),
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      addressLine1: String(formData.get("addressLine1") ?? ""),
      addressLine2: String(formData.get("addressLine2") ?? ""),
      city: String(formData.get("city") ?? ""),
      area: String(formData.get("area") ?? ""),
      postalCode: String(formData.get("postalCode") ?? ""),
      isDefault: bool(formData.get("isDefault")),
    },
  });

  if (address.isDefault) {
    await prisma.customerProfile.update({
      where: { id: customer.id },
      data: { defaultAddressId: address.id },
    });
  }

  revalidatePath("/checkout");
  revalidatePath("/account");
}

export async function createCodOrderAction(formData: FormData) {
  await requireRole(["CUSTOMER", "ADMIN"]);
  const customer = await getCustomerContext();

  if (!customer) {
    redirect("/login");
  }

  const cart = await prisma.cart.findFirst({
    where: { customerId: customer.id, status: "active" },
    include: {
      items: {
        include: {
          product: {
            include: {
              translations: { where: { locale: "EN" } },
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty.");
  }

  const vendorIds = new Set(cart.items.map((item) => item.vendorId));

  if (vendorIds.size > 1) {
    throw new Error("This MVP checkout supports one vendor per order.");
  }

  const vendorId = cart.items[0].vendorId;
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
  });

  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum.add(item.priceAtTime.mul(item.quantity)),
    new Prisma.Decimal(0),
  );
  const fulfillmentType = String(formData.get("fulfillmentType") ?? "PICKUP") as
    | "PICKUP"
    | "VENDOR_DELIVERY";
  const deliveryFee =
    fulfillmentType === "VENDOR_DELIVERY" ? decimal(formData.get("deliveryFee"), "250") : new Prisma.Decimal(0);
  const commissionAmount =
    vendor.commissionType === "PERCENTAGE"
      ? subtotal.mul(vendor.commissionValue).div(100)
      : vendor.commissionValue;
  const totalAmount = subtotal.add(deliveryFee);
  const addressId =
    fulfillmentType === "VENDOR_DELIVERY"
      ? String(formData.get("shippingAddressId") ?? "")
      : null;

  const order = await prisma.order.create({
    data: {
      orderNumber: `KIS-${randomUUID().slice(0, 8).toUpperCase()}`,
      customerId: customer.id,
      vendorId,
      shippingAddressId: addressId || null,
      fulfillmentType,
      status: "PENDING",
      subtotal,
      deliveryFee,
      commissionAmount,
      totalAmount,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.COD_DUE,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          productNameSnapshot:
            item.product.translations[0]?.name ?? item.product.slug,
          unit: item.unit,
          quantity: item.quantity,
          unitPrice: item.priceAtTime,
          lineTotal: item.priceAtTime.mul(item.quantity),
        })),
      },
      payments: {
        create: {
          provider: PaymentMethod.COD,
          amount: totalAmount,
          status: PaymentStatus.COD_DUE,
        },
      },
      commission: {
        create: {
          vendorId,
          commissionRate: vendor.commissionValue,
          commissionAmount,
          vendorNetAmount: subtotal.sub(commissionAmount),
        },
      },
    },
  });

  await prisma.cart.update({
    where: { id: cart.id },
    data: { status: "converted" },
  });

  revalidatePath("/account/orders");
  revalidatePath("/vendor/orders");
  revalidatePath("/admin/orders");
  revalidatePath("/checkout");
  redirect(`/account/orders?created=${order.id}`);
}

export async function updateOrderStatusAction(formData: FormData) {
  const session = await requireRole(["VENDOR", "ADMIN"]);
  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "PENDING");
  const vendor = await getVendorContext();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (session.user.role === "VENDOR" && vendor?.id !== order.vendorId) {
    throw new Error("You cannot update this order.");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: status as never,
      confirmedAt:
        status === "CONFIRMED" ? new Date() : order.confirmedAt,
      completedAt:
        status === "DELIVERED" ? new Date() : order.completedAt,
      paymentStatus:
        status === "DELIVERED" && order.paymentMethod === PaymentMethod.COD
          ? PaymentStatus.COD_COLLECTED
          : order.paymentStatus,
    },
  });

  if (status === "DELIVERED") {
    await prisma.payment.updateMany({
      where: { orderId, provider: PaymentMethod.COD },
      data: {
        status: PaymentStatus.COD_COLLECTED,
        paidAt: new Date(),
      },
    });
  }

  revalidatePath("/vendor/orders");
  revalidatePath("/admin/orders");
  revalidatePath("/account/orders");
}

export async function updateVendorStatusAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const vendorId = String(formData.get("vendorId") ?? "");
  const status = String(formData.get("status") ?? VendorStatus.PENDING) as VendorStatus;

  await prisma.vendor.update({
    where: { id: vendorId },
    data: { status },
  });

  revalidatePath("/admin/vendors");
  revalidatePath("/vendor");
}

export async function createCategoryAction(formData: FormData) {
  await requireRole(["ADMIN"]);

  const slug = slugify(String(formData.get("slug") ?? formData.get("nameEn") ?? ""));
  const nameEn = String(formData.get("nameEn") ?? "");
  const nameUr = String(formData.get("nameUr") ?? "");
  const descriptionEn = String(formData.get("descriptionEn") ?? "");
  const descriptionUr = String(formData.get("descriptionUr") ?? "");

  if (!slug || !nameEn || !nameUr) {
    throw new Error("Category requires slug and English/Urdu names.");
  }

  const existing = await prisma.category.findUnique({
    where: { slug },
  });

  if (existing) {
    await prisma.category.update({
      where: { id: existing.id },
      data: {
        translations: {
          upsert: [
            {
              where: {
                categoryId_locale: {
                  categoryId: existing.id,
                  locale: "EN",
                },
              },
              update: {
                name: nameEn,
                description: descriptionEn,
              },
              create: {
                locale: "EN",
                name: nameEn,
                description: descriptionEn,
              },
            },
            {
              where: {
                categoryId_locale: {
                  categoryId: existing.id,
                  locale: "UR",
                },
              },
              update: {
                name: nameUr,
                description: descriptionUr,
              },
              create: {
                locale: "UR",
                name: nameUr,
                description: descriptionUr,
              },
            },
          ],
        },
      },
    });
  } else {
    await prisma.category.create({
      data: {
        slug,
        translations: {
          create: [
            { locale: "EN", name: nameEn, description: descriptionEn },
            { locale: "UR", name: nameUr, description: descriptionUr },
          ],
        },
      },
    });
  }

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function toggleCategoryAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const categoryId = String(formData.get("categoryId") ?? "");
  const isActive = String(formData.get("isActive") ?? "") === "true";

  await prisma.category.update({
    where: { id: categoryId },
    data: { isActive: !isActive },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function seedCatalogAction() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const categoryCount = await prisma.category.count();

  if (categoryCount === 0) {
    await prisma.category.create({
      data: {
        slug: "vegetables",
        translations: {
          create: [
            { locale: "EN", name: "Vegetables", description: "Fresh vegetables" },
            { locale: "UR", name: "سبزیاں", description: "تازہ سبزیاں" },
          ],
        },
      },
    });
  }

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}
