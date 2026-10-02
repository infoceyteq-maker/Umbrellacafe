# Cafe Umbrella — Ella | Digital Menu

A premium, mobile-first digital food menu web app for **Cafe Umbrella, Ella**, built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Framer Motion**.

## Highlights

- Pure **black theme** (`#070304`) with fiery **red / orange / flame** accents.
- 8 categories: Soup, Stews, Omelette, Main Dish, Chopsey, Boiled Vegetables, Signature Roti, Kottu Junction.
- Scrollable dish grid with a **3D pointer-tilt parallax** effect on every card — the plate lifts toward you (`translateZ`) and a flame glow follows your pointer.
- Continuous subtle animations: slow-rotating "plate" photography, flickering fire glow, floating ember/spice particles, a sheen sweep on hover, and a pulsing "Special Offer" badge.
- Clicking a dish triggers a shared-element **morph transition** (Framer Motion `layoutId`) from the grid card into a full-screen detail view with a 3D entrance.
- Detail view: large rotating hero image, bold name & price, ingredients chips, prep-time indicator, spice level, special-offer badge, and a prominent "Order Now" button.
- **Online order cart**: "Order Now" adds dishes to a cart (top-right button). Customers choose Dine-in, Takeaway or Delivery, add their name, phone/email and a table or delivery note, then send the order directly to the Supabase-backed admin order desk.
- Fonts are self-hosted via `@fontsource` (Poppins/Inter) so the app builds and runs fully offline.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

- `src/data/menu.ts` — categories & menu items (edit this to change the menu).
- `src/data/config.ts` — cafe name, location and social links.
- `src/components/` — UI building blocks (`DishCard`, `DishModal`, `CartDrawer`, `CategoryTabs`, `Header`, `FloatingBits`, `Logo`, `Toast`, `DishImage`).
- `src/app/` — Next.js App Router entry (`layout.tsx`, `page.tsx`, `globals.css`).
- `public/dishes/` — dish photography. `public/logo/` — brand logo assets.

## Admin studio + Supabase

The staff workspace is available at `/admin`. The current demo login is `admin` / `umbrella123`.

The admin studio supports menu items, orders, customer phone/email details, order statuses, printable e-bills and seven-day sales summaries. It falls back to browser storage when Supabase is not configured, and syncs to Supabase when the project variables are present.

1. Copy `.env.local` into the project root and add the Supabase project URL and publishable key from **Supabase Dashboard → Project Settings → API**.
2. Run `supabase/schema.sql` once in **Supabase Dashboard → SQL Editor**.
3. Restart the development server with `npm run dev`.

Never commit `.env.local` or a `service_role` key. The included SQL policies are intentionally open for this demo; add Supabase Auth and restrict them before using the workspace in production.

## Notes

- The dish photography is AI-generated to match the premium black/fire aesthetic.
- The logo in the header/favicon is a lightweight inline SVG umbrella mark with a fire gradient; a raster logo asset can be swapped in via `public/logo/` (drop in `public/logo/logo.png` and use `next/image` in `src/components/Logo.tsx`).
