# Seeding Guide

## Purpose

This project includes a Prisma seed script so local development starts with usable marketplace data instead of an empty database.

The seed script:

- creates or updates the admin user
- creates or updates the vendor user when vendor credentials are present
- creates or updates the customer user when customer credentials are present
- creates starter categories
- creates a demo vendor product
- creates default inventory and pricing data
- creates a default customer address

## Command

Run the seed script with:

```bash
npm run db:seed
```

## Required Environment Variables

At minimum, define these values in `.env`:

```env
ADMIN_NAME="KISSAN Admin"
ADMIN_EMAIL="admin@kissan.pk"
ADMIN_PASSWORD="Admin@12345"

VENDOR_NAME="Demo Vendor"
VENDOR_EMAIL="vendor@kissan.pk"
VENDOR_PASSWORD="Vendor@12345"
VENDOR_BUSINESS_NAME="KISSAN Demo Farm"
VENDOR_SLUG="kissan-demo-farm"

CUSTOMER_NAME="Demo Customer"
CUSTOMER_EMAIL="customer@kissan.pk"
CUSTOMER_PASSWORD="Customer@12345"
```

## Demo Accounts

Use these accounts locally after seeding:

### Admin

- email: `admin@kissan.pk`
- password: `Admin@12345`
- expected landing route: `/admin`

### Vendor

- email: `vendor@kissan.pk`
- password: `Vendor@12345`
- expected landing route: `/vendor`

### Customer

- email: `customer@kissan.pk`
- password: `Customer@12345`
- expected landing route: `/account`

## Demo Seeded Data

The local seed currently creates:

- categories:
  - `vegetables`
  - `fruits`
  - `grains`
- vendor business:
  - `KISSAN Demo Farm`
- demo product:
  - `Farm Fresh Tomatoes`
- default customer address:
  - Lahore demo address

## Notes

- The seed uses `upsert`, so rerunning it updates existing demo records instead of blindly duplicating them.
- If vendor or customer credentials are empty in `.env`, those users are skipped.
- Payment gateway credentials are not required for the local seed.
