import "dotenv/config";

import { PrismaClient, UserRole, VendorStatus, CommissionType } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
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

    await prisma.vendor.upsert({
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
