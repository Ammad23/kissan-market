# Milestone 1: Foundation and Auth

## Scope

Stabilize the app foundation so future marketplace features can build on a consistent auth and navigation setup.

## Changes

- Added role-aware post-login routing
- Added self-service customer registration
- Added self-service vendor registration with pending approval
- Added authenticated landing route for session-based redirects
- Added shared site header
- Added sign-out button
- Added role navigation helpers
- Added cached session and current-user helpers
- Added approved-vendor guard
- Integrated `next-intl` plugin and request configuration
- Added English and Urdu message catalogs
- Added locale switcher
- Updated root layout to provide shared shell and localization

## Main Files

- `src/lib/auth.ts`
- `src/lib/navigation.ts`
- `src/lib/i18n.ts`
- `src/i18n/request.ts`
- `src/components/site-header.tsx`
- `src/components/auth/register-form.tsx`
- `src/components/locale-switcher.tsx`
- `src/components/auth/sign-out-button.tsx`
- `src/app/layout.tsx`
- `src/app/register/page.tsx`
- `src/app/actions/auth.ts`
- `src/app/login/page.tsx`
- `src/app/auth/landing/page.tsx`
- `next.config.ts`
- `messages/en.json`
- `messages/ur.json`

## Verification

- Auth redirects now resolve by role
- Customer registration creates an active account immediately
- Vendor registration creates a pending vendor profile for admin approval
- Shared shell renders across app routes
- Localization setup is wired into Next.js
