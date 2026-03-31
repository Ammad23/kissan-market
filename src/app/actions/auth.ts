"use server";

import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";

type RegistrationState = {
  success: boolean;
  message: string;
  role?: "CUSTOMER" | "VENDOR";
  email?: string;
};

const initialRegistrationState: RegistrationState = {
  success: false,
  message: "",
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getUniqueVendorSlug(baseValue: string) {
  const baseSlug = slugify(baseValue) || `vendor-${Date.now()}`;
  let slug = baseSlug;
  let index = 1;

  while (await prisma.vendor.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }

  return slug;
}

export async function registerUserAction(
  _prevState: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const role = String(formData.get("role") ?? "CUSTOMER").toUpperCase();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const businessName = String(formData.get("businessName") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim() || null;

  if (role !== "CUSTOMER" && role !== "VENDOR") {
    return {
      success: false,
      message: "Please choose a valid account type.",
    };
  }

  if (!name || !email || !password || !confirmPassword) {
    return {
      success: false,
      message: "Name, email, and password are required.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters long.",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Password and confirm password must match.",
    };
  }

  if (role === "VENDOR" && !businessName) {
    return {
      success: false,
      message: "Business name is required for vendor registration.",
    };
  }

  const [existingEmail, existingPhone] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    phone ? prisma.user.findUnique({ where: { phone } }) : Promise.resolve(null),
  ]);

  if (existingEmail) {
    return {
      success: false,
      message: "An account with this email already exists.",
    };
  }

  if (existingPhone) {
    return {
      success: false,
      message: "An account with this phone number already exists.",
    };
  }

  const passwordHash = await hash(password, 12);

  if (role === "CUSTOMER") {
    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: "CUSTOMER",
        isActive: true,
        customerProfile: {
          create: {},
        },
      },
    });

    return {
      success: true,
      message: "Customer account created successfully. Signing you in...",
      role: "CUSTOMER",
      email,
    };
  }

  const vendorSlug = await getUniqueVendorSlug(businessName);

  await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      role: "VENDOR",
      isActive: true,
      vendorProfile: {
        create: {
          businessName,
          slug: vendorSlug,
          email,
          phone,
          address,
          commissionValue: 10,
          status: "PENDING",
        },
      },
    },
  });

  return {
    success: true,
    message: "Vendor account created and sent for admin approval.",
    role: "VENDOR",
    email,
  };
}

export { initialRegistrationState };
