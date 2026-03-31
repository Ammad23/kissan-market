# Milestone 4: Cart, Checkout, and Orders

## Scope

Implement the MVP transaction flow from cart through COD order completion and vendor fulfillment updates.

## Changes

- Added cart page
- Added cart update action
- Added checkout page
- Added address creation action
- Added COD order creation flow
- Added customer cart persistence helpers
- Added vendor order management page
- Added order status update action
- Added payment and commission record creation during checkout

## Main Files

- `src/app/cart/page.tsx`
- `src/app/checkout/page.tsx`
- `src/app/vendor/orders/page.tsx`
- `src/app/actions/marketplace.ts`
- `src/lib/marketplace.ts`

## Verification

- Customer can add items to cart
- Customer can place a COD order
- Vendor can update order status through fulfillment stages
