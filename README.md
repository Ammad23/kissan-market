# KISSAN Blueprint

## Current Implementation Status

The project is no longer just a blueprint. The current codebase already includes:

- role-based authentication with customer, vendor, and admin access
- localized English and Urdu UI scaffolding with a locale switcher
- vendor dashboard foundation with product, pricing, inventory, and order workflows
- storefront browsing with vendor pages and product detail pages
- customer cart, checkout, account, and order pages
- admin dashboards for vendors, categories, and platform orders
- Prisma migration support and seed data for local development

## Documentation Guide

Use these files depending on what you need:

- `README.md`: project blueprint, architecture, product scope, and local run steps
- `docs/SEEDING.md`: demo account details and seeding behavior
- `docs/POSTGRESQL_SETUP.md`: PostgreSQL installation and local database setup
- `docs/launch-checklist.md`: staging and release readiness
- `docs/milestones/README.md`: milestone index

## Implemented Milestones

The MVP roadmap has been implemented in milestone-based commits. Each milestone has a dedicated change log:

- `docs/milestones/milestone-1/README.md`
- `docs/milestones/milestone-2/README.md`
- `docs/milestones/milestone-3/README.md`
- `docs/milestones/milestone-4/README.md`
- `docs/milestones/milestone-5/README.md`
- `docs/milestones/milestone-6/README.md`

## Project Summary

KISSAN is a Pakistan-focused multi-vendor agriculture marketplace with:

- a customer website for browsing and ordering produce online
- a vendor panel for product, pricing, inventory, and order management
- a platform admin panel for vendor approvals, commissions, and overall reporting

The platform is designed for one country initially: Pakistan.

## Confirmed Business Rules

- Delivery is handled by the vendor, or the customer can choose pickup
- Products can be sold in multiple units, mainly `kg` and `bag`
- Prices may change daily
- The platform takes a commission on each sale
- The storefront supports `English` and `Urdu`
- Supported payment methods:
  - `Cash on Delivery`
  - `JazzCash`
  - `Easypaisa`
  - `Local card gateway`
- `Bank transfer` is excluded

## Tech Stack

### Frontend

- `Next.js`
- `TypeScript`
- `Tailwind CSS`
- `Shadcn UI`
- `next-intl`

### Backend and Data

- `Next.js` backend routes and server actions
- `Prisma`
- `PostgreSQL`
- `NextAuth`

### Media and Analytics

- `Cloudinary`
- `Recharts`

### Payments

- `Cash on Delivery`
- `JazzCash`
- `Easypaisa`
- `Local card gateway`

## Why This Stack Fits

### Next.js

Next.js allows the storefront and dashboard experiences to live in one modern stack. It supports SEO, server-side rendering, fast page loads, and route-based separation for customers, vendors, and admins.

### TypeScript

The project includes roles, product units, daily pricing, commissions, order states, and multiple payment methods. TypeScript helps keep these business rules reliable and reduces bugs.

### Tailwind CSS and Shadcn UI

This combination is a strong fit for building responsive pages quickly, especially for admin and vendor dashboards, product grids, forms, tables, modals, and analytics layouts.

### Prisma and PostgreSQL

The system is highly relational:

- vendors own products
- products have inventory and price history
- customers place orders
- commissions and payouts depend on accurate order records

PostgreSQL is a strong fit for relational commerce data and reporting, while Prisma provides a clean developer experience on top of it.

### Cloudinary

Cloudinary is recommended because this project depends heavily on product photos. It helps with uploads, optimization, resizing, thumbnails, mobile-friendly delivery, and consistent image quality across the storefront and dashboards.

### Recharts

Recharts is a good fit for vendor and admin dashboards where you need sales charts, order trends, top products, and performance summaries.

### next-intl

The storefront launches in `English` and `Urdu`, so a proper i18n layer is necessary for translated UI labels and localized content delivery.

## Product Blueprint

### User Roles

#### Customer

- browse products
- search and filter products
- add products to cart
- place orders
- choose pickup or vendor delivery
- pay using supported Pakistan payment methods
- view order history
- manage profile and addresses

#### Vendor

- manage shop profile
- create and edit products
- upload product images
- update stock by unit
- update daily prices
- manage orders
- manage offers
- view reports and charts
- track commission deductions and payouts

#### Platform Admin

- approve and manage vendors
- manage categories
- manage commission settings
- monitor all orders and vendors
- review analytics and growth
- manage homepage content and promotional sections

## Main Application Areas

### Customer Website

- Home page
- Product listing page
- Category pages
- Vendor storefront pages
- Product detail page
- Cart
- Checkout
- Customer account area
- Orders history
- Addresses
- Offers page
- Login and registration

### Vendor Panel

- Vendor login
- Dashboard
- Products
- Add and edit product
- Inventory
- Pricing updates
- Orders
- Offers
- Reports
- Payouts
- Settings

### Platform Admin Panel

- Admin login
- Dashboard
- Vendors
- Categories
- Products overview
- Orders overview
- Commissions
- Payouts
- Reports
- Users
- Content and settings

## Core Functional Modules

### 1. Authentication and Authorization

- customer login and registration
- vendor login
- admin login
- role-based access control

### 2. Vendor Management

- vendor onboarding
- approval workflow
- shop settings
- commission settings
- delivery and pickup configuration

### 3. Product Catalog

- products per vendor
- categories
- localized product names and descriptions
- image galleries
- unit types like `kg`, `bag`, `piece`, `bundle`

### 4. Inventory

- quantity tracking
- stock unit tracking
- low stock thresholds
- in-stock and out-of-stock state

### 5. Pricing

- current price by unit
- price history
- daily updates

### 6. Orders

- cart and checkout
- order items
- order status tracking
- vendor-specific fulfillment

### 7. Fulfillment

- pickup
- vendor delivery
- delivery notes
- delivery fee
- expected date and time

### 8. Payments

- `Cash on Delivery`
- `JazzCash`
- `Easypaisa`
- `Local card gateway`

### 9. Commissions and Payouts

- platform commission per order
- vendor net earnings
- payout reporting
- settlement tracking

### 10. Offers and Promotions

- product offers
- category offers
- coupon logic
- vendor promotions

### 11. Reporting and Analytics

- sales trends
- top products
- order volume
- low stock alerts
- vendor performance
- platform-level revenue and commission tracking

### 12. Localization

- English UI
- Urdu UI
- translated categories and products

## Run Locally

### Prerequisites

- `Node.js 20+`
- `npm`
- `PostgreSQL`

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Copy the example environment file:

```bash
cp .env.example .env
```

Update at least these values in `.env`:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Optional values:

- `VENDOR_EMAIL` and `VENDOR_PASSWORD`
- `CUSTOMER_EMAIL` and `CUSTOMER_PASSWORD`
- `CLOUDINARY_*`
- `JAZZCASH_*`
- `EASYPAISA_*`
- `CARD_GATEWAY_*`

### 3. Create the PostgreSQL database

Create a PostgreSQL database named `kissan_market`, or update `DATABASE_URL` to point to your preferred database.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/kissan_market"
```

### 4. Generate Prisma client

```bash
npm run prisma:generate
```

### 5. Run database migrations

```bash
npm run prisma:migrate:dev
```

### 6. Seed demo users

This step creates the admin user and optionally vendor and customer demo accounts if their credentials are set in `.env`.

```bash
npm run db:seed
```

### 7. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Helpful scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:generate
npm run prisma:migrate:dev
npm run db:seed
```

## Recommended Database Schema

### users

- `id`
- `name`
- `email`
- `phone`
- `password_hash`
- `role` (`customer`, `vendor`, `admin`)
- `is_active`
- `created_at`
- `updated_at`

### vendors

- `id`
- `user_id`
- `business_name`
- `slug`
- `description`
- `phone`
- `email`
- `address`
- `logo_url`
- `banner_url`
- `commission_type`
- `commission_value`
- `supports_pickup`
- `supports_delivery`
- `delivery_notes`
- `delivery_radius_km`
- `minimum_order_amount`
- `status`
- `created_at`
- `updated_at`

### categories

- `id`
- `parent_id`
- `slug`
- `image_url`
- `sort_order`
- `is_active`

### category_translations

- `id`
- `category_id`
- `locale` (`en`, `ur`)
- `name`
- `description`

### products

- `id`
- `vendor_id`
- `category_id`
- `slug`
- `sku`
- `default_unit`
- `is_active`
- `is_featured`
- `image_url`
- `created_at`
- `updated_at`

### product_translations

- `id`
- `product_id`
- `locale`
- `name`
- `short_description`
- `description`

### product_images

- `id`
- `product_id`
- `url`
- `sort_order`

### inventory

- `id`
- `product_id`
- `quantity_available`
- `unit`
- `low_stock_threshold`
- `is_in_stock`
- `last_updated_at`

### product_current_prices

- `id`
- `product_id`
- `unit`
- `price`
- `currency`
- `updated_at`

### price_history

- `id`
- `product_id`
- `unit`
- `price`
- `currency`
- `effective_from`
- `effective_to`
- `created_by`

### customers

- `id`
- `user_id`
- `preferred_language`
- `default_address_id`

### customer_addresses

- `id`
- `customer_id`
- `label`
- `full_name`
- `phone`
- `address_line_1`
- `address_line_2`
- `city`
- `area`
- `postal_code`
- `latitude`
- `longitude`
- `is_default`

### carts

- `id`
- `customer_id`
- `status`

### cart_items

- `id`
- `cart_id`
- `product_id`
- `vendor_id`
- `quantity`
- `unit`
- `price_at_time`

### orders

- `id`
- `order_number`
- `customer_id`
- `vendor_id`
- `shipping_address_id`
- `fulfillment_type` (`pickup`, `vendor_delivery`)
- `status`
- `subtotal`
- `discount_amount`
- `delivery_fee`
- `commission_amount`
- `total_amount`
- `currency`
- `payment_method`
- `payment_status`
- `placed_at`
- `confirmed_at`
- `completed_at`

### order_items

- `id`
- `order_id`
- `product_id`
- `product_name_snapshot`
- `unit`
- `quantity`
- `unit_price`
- `line_total`

### payments

- `id`
- `order_id`
- `provider`
- `transaction_reference`
- `amount`
- `currency`
- `status`
- `paid_at`
- `raw_response_json`

### vendor_commissions

- `id`
- `order_id`
- `vendor_id`
- `commission_rate`
- `commission_amount`
- `vendor_net_amount`
- `settlement_status`

### payouts

- `id`
- `vendor_id`
- `period_start`
- `period_end`
- `gross_sales`
- `commission_total`
- `net_payout`
- `status`
- `paid_at`

### offers

- `id`
- `vendor_id`
- `name`
- `type`
- `value`
- `code`
- `start_at`
- `end_at`
- `minimum_order_amount`
- `usage_limit`
- `is_active`

### offer_products

- `id`
- `offer_id`
- `product_id`

### notifications

- `id`
- `user_id`
- `type`
- `title`
- `message`
- `is_read`
- `created_at`

### audit_logs

- `id`
- `user_id`
- `entity_type`
- `entity_id`
- `action`
- `payload_json`
- `created_at`

## Payment Blueprint for Pakistan

### Supported Methods

- `cod`
- `jazzcash`
- `easypaisa`
- `card_gateway`

### Payment Statuses

- `pending`
- `initiated`
- `paid`
- `failed`
- `refunded`
- `cod_due`
- `cod_collected`

### Order Flow

1. Customer adds products to cart.
2. Customer chooses pickup or vendor delivery.
3. Customer selects payment method.
4. Platform creates the order and payment record.
5. Vendor receives the order.
6. Vendor prepares the order.
7. Vendor marks the order ready for pickup or out for delivery.
8. The order completes and commission is recorded.

## Dashboard Blueprint

### Vendor Dashboard Widgets

- sales today
- orders today
- monthly revenue
- commission deducted
- top-selling products
- low stock items
- sales trend chart
- order status breakdown

### Admin Dashboard Widgets

- total platform sales
- commission earned
- active vendors
- pending vendor approvals
- total orders
- top vendors
- top categories
- monthly growth chart

## Recommended MVP Scope

Build these first:

- storefront
- customer accounts
- vendor onboarding and login
- product management
- inventory management
- daily pricing updates
- cart and checkout
- pickup and vendor delivery logic
- Pakistan payment methods
- commission calculation
- vendor dashboard
- admin dashboard
- English and Urdu support

## Recommended Build Order

1. Set up auth and role system.
2. Build the database schema.
3. Build vendor, product, inventory, and pricing modules.
4. Build customer storefront and product browsing.
5. Build cart and checkout.
6. Integrate payment methods for Pakistan.
7. Implement order, commission, and payout logic.
8. Build vendor dashboard.
9. Build admin dashboard.
10. Add localization and final mobile polish.
