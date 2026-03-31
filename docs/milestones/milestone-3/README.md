# Milestone 3: Storefront and Discovery

## Scope

Replace placeholder storefront routes with database-backed customer browsing flows.

## Changes

- Reworked the public home page to support real navigation flow
- Replaced the placeholder shop page with searchable catalog browsing
- Added category filtering
- Added product detail page
- Added vendor storefront page
- Added customer account dashboard
- Added customer orders page
- Added marketplace query helpers for storefront reads

## Main Files

- `src/app/page.tsx`
- `src/app/shop/page.tsx`
- `src/app/products/[slug]/page.tsx`
- `src/app/vendors/[slug]/page.tsx`
- `src/app/account/page.tsx`
- `src/app/account/orders/page.tsx`
- `src/lib/marketplace.ts`

## Verification

- Products can be browsed by category
- Product details display inventory and pricing
- Vendor storefronts expose vendor-specific catalog views
