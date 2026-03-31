# KISSAN Launch Checklist

## Environments

- Provision `DATABASE_URL` for staging and production
- Set `NEXTAUTH_URL` to the public app URL
- Generate a strong `NEXTAUTH_SECRET`
- Configure `CLOUDINARY_*` keys
- Configure `JAZZCASH_*`, `EASYPAISA_*`, and `CARD_GATEWAY_*`

## Database

- Run `npm run prisma:generate`
- Run `npm run prisma:migrate:dev` locally before generating a production migration
- Run `npm run db:seed` in staging for demo access
- Verify admin, vendor, category, and product demo data is present

## Product Readiness

- Verify vendor approval workflow
- Verify bilingual category and product labels
- Verify storefront search, vendor page, cart, and COD checkout
- Verify vendor order status updates
- Verify admin order monitoring

## Operational Readiness

- Smoke test `Home`, `Shop`, `Cart`, `Checkout`, `Vendor`, and `Admin`
- Confirm image upload strategy for Cloudinary URLs or direct upload widget
- Confirm COD flow and order completion behavior
- Add external payment gateway credentials before enabling non-COD methods
