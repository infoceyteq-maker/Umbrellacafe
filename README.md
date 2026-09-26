# Cafe Umbrella — Ella | Digital Menu

A premium, mobile-first digital food menu web app for **Cafe Umbrella, Ella**, built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Framer Motion**.

## Highlights

- Dark, premium theme (`#121212`) with neon orange/gold accents.
- 8 categories: Soup, Stews, Omelette, Main Dish, Chopsey, Boiled Vegetables, Signature Roti, Kottu Junction.
- Scrollable dish grid with a 3D pointer-tilt (parallax) hover effect on every card.
- Continuous subtle animations: slow-rotating "plate" photography, floating steam/spice/leaf particles, a sheen sweep on hover, and a pulsing "Special Offer" badge.
- Clicking a dish triggers a shared-element **morph transition** (Framer Motion `layoutId`) from the grid card into a full-screen detail view.
- Detail view: large rotating hero image, bold name & price, ingredients chips, prep-time indicator, spice level, special-offer badge, and a prominent rounded "Order Now" button with an order confirmation toast.
- Fonts are self-hosted via `@fontsource` (Poppins/Inter) so the app builds and runs fully offline.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

- `src/data/menu.ts` — categories & menu items (edit this to change the menu).
- `src/components/` — UI building blocks (`DishCard`, `DishModal`, `CategoryTabs`, `Header`, `FloatingBits`, `Logo`, `Toast`, `DishImage`).
- `src/app/` — Next.js App Router entry (`layout.tsx`, `page.tsx`, `globals.css`).
- `public/dishes/` — dish photography. `public/logo/` — brand logo assets.

## Notes

- The dish photography is AI-generated to match the premium dark aesthetic. Two Kottu Junction hero photos ("Umbrella Ultimate Legend Kottu" and "Ella Cheese Seafood Kottu") are pending final generation — until then `DishImage` shows an elegant placeholder automatically.
- The logo in the header/favicon is a lightweight inline SVG umbrella mark; a raster logo asset can be swapped in via `public/logo/`.
