import "dotenv/config";

import {
  PrismaClient,
  UserRole,
  VendorStatus,
  CommissionType,
  Locale,
  ProductUnit,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const categoryRecords = await Promise.all(
    [
      {
        slug: "vegetables",
        sortOrder: 1,
        translations: [
          { locale: Locale.EN, name: "Vegetables", description: "Fresh daily vegetables" },
          { locale: Locale.UR, name: "سبزیاں", description: "تازہ روزانہ سبزیاں" },
        ],
      },
      {
        slug: "fruits",
        sortOrder: 2,
        translations: [
          { locale: Locale.EN, name: "Fruits", description: "Seasonal fruit collections" },
          { locale: Locale.UR, name: "پھل", description: "موسمی پھل" },
        ],
      },
      {
        slug: "grains",
        sortOrder: 3,
        translations: [
          { locale: Locale.EN, name: "Grains", description: "Sacks and staple crops" },
          { locale: Locale.UR, name: "اناج", description: "اناج اور بوریاں" },
        ],
      },
    ].map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          sortOrder: category.sortOrder,
        },
        create: {
          slug: category.slug,
          sortOrder: category.sortOrder,
          translations: {
            create: category.translations,
          },
        },
        include: {
          translations: true,
        },
      }),
    ),
  );

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME ?? "KISSAN Admin";

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in your environment before running db:seed.",
    );
  }

  const normalizedAdminEmail = adminEmail.trim().toLowerCase();
  const passwordHash = await hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: normalizedAdminEmail },
    update: {
      name: adminName,
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      name: adminName,
      email: normalizedAdminEmail,
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  const vendorEmail = process.env.VENDOR_EMAIL?.trim().toLowerCase();
  const vendorPassword = process.env.VENDOR_PASSWORD;

  if (vendorEmail && vendorPassword) {
    const vendorName = process.env.VENDOR_NAME ?? "Demo Vendor";
    const vendorBusinessName = process.env.VENDOR_BUSINESS_NAME ?? "KISSAN Demo Farm";
    const vendorSlug = process.env.VENDOR_SLUG ?? "kissan-demo-farm";
    const vendorPasswordHash = await hash(vendorPassword, 12);

    const vendorUser = await prisma.user.upsert({
      where: { email: vendorEmail },
      update: {
        name: vendorName,
        passwordHash: vendorPasswordHash,
        role: UserRole.VENDOR,
        isActive: true,
      },
      create: {
        name: vendorName,
        email: vendorEmail,
        passwordHash: vendorPasswordHash,
        role: UserRole.VENDOR,
        isActive: true,
      },
    });

    const vendorProfile = await prisma.vendor.upsert({
      where: { userId: vendorUser.id },
      update: {
        businessName: vendorBusinessName,
        slug: vendorSlug,
        status: VendorStatus.APPROVED,
      },
      create: {
        userId: vendorUser.id,
        businessName: vendorBusinessName,
        slug: vendorSlug,
        commissionType: CommissionType.PERCENTAGE,
        commissionValue: 10,
        supportsPickup: true,
        supportsDelivery: true,
        status: VendorStatus.APPROVED,
      },
    });

    const produceCategory =
      categoryRecords.find((item) => item.slug === "vegetables") ?? categoryRecords[0];

    const demoProduct = await prisma.product.upsert({
      where: { sku: "KISSAN-TOMATO-001" },
      update: {
        vendorId: vendorProfile.id,
        categoryId: produceCategory.id,
        defaultUnit: ProductUnit.KG,
        isActive: true,
      },
      create: {
        vendorId: vendorProfile.id,
        categoryId: produceCategory.id,
        slug: "farm-fresh-tomatoes",
        sku: "KISSAN-TOMATO-001",
        defaultUnit: ProductUnit.KG,
        isActive: true,
        isFeatured: true,
        translations: {
          create: [
            {
              locale: Locale.EN,
              name: "Farm Fresh Tomatoes",
              shortDescription: "Daily-picked tomatoes for household and bulk orders",
              description: "Fresh tomatoes managed by the demo vendor with daily pricing.",
            },
            {
              locale: Locale.UR,
              name: "تازہ ٹماٹر",
              shortDescription: "روزانہ تازہ ٹماٹر",
              description: "نمائشی وینڈر کے لئے تازہ ٹماٹر۔",
            },
          ],
        },
      },
    });

    await prisma.inventory.upsert({
      where: { productId: demoProduct.id },
      update: {
        quantityAvailable: 120,
        unit: ProductUnit.KG,
        lowStockThreshold: 20,
        isInStock: true,
      },
      create: {
        productId: demoProduct.id,
        quantityAvailable: 120,
        unit: ProductUnit.KG,
        lowStockThreshold: 20,
        isInStock: true,
      },
    });

    await prisma.productCurrentPrice.upsert({
      where: {
        productId_unit: {
          productId: demoProduct.id,
          unit: ProductUnit.KG,
        },
      },
      update: {
        price: 220,
      },
      create: {
        productId: demoProduct.id,
        unit: ProductUnit.KG,
        price: 220,
      },
    });
  }

  const customerEmail = process.env.CUSTOMER_EMAIL?.trim().toLowerCase();
  const customerPassword = process.env.CUSTOMER_PASSWORD;

  if (customerEmail && customerPassword) {
    const customerName = process.env.CUSTOMER_NAME ?? "Demo Customer";
    const customerPasswordHash = await hash(customerPassword, 12);

    const customer = await prisma.user.upsert({
      where: { email: customerEmail },
      update: {
        name: customerName,
        passwordHash: customerPasswordHash,
        role: UserRole.CUSTOMER,
        isActive: true,
      },
      create: {
        name: customerName,
        email: customerEmail,
        passwordHash: customerPasswordHash,
        role: UserRole.CUSTOMER,
        isActive: true,
      },
    });

    await prisma.customerProfile.upsert({
      where: { userId: customer.id },
      update: {},
      create: {
        userId: customer.id,
      },
    });

    const customerProfile = await prisma.customerProfile.findUnique({
      where: { userId: customer.id },
    });

    if (customerProfile) {
      const existingAddress = await prisma.customerAddress.findFirst({
        where: { customerId: customerProfile.id, isDefault: true },
      });

      const defaultAddress = existingAddress
        ? await prisma.customerAddress.update({
            where: { id: existingAddress.id },
            data: {
              fullName: customerName,
              phone: "03000000000",
              addressLine1: "Demo Street 12",
              city: "Lahore",
              area: "Model Town",
              postalCode: "54000",
              isDefault: true,
            },
          })
        : await prisma.customerAddress.create({
            data: {
              customerId: customerProfile.id,
              label: "Home",
              fullName: customerName,
              phone: "03000000000",
              addressLine1: "Demo Street 12",
              city: "Lahore",
              area: "Model Town",
              postalCode: "54000",
              isDefault: true,
            },
          });

      await prisma.customerProfile.update({
        where: { id: customerProfile.id },
        data: {
          defaultAddressId: defaultAddress.id,
        },
      });
    }
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
