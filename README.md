# Hello Daydrinkers

Storefront for Daydrinkers, a cute coffee shop with good drinks and even better vibes. Built with Shopify Hydrogen and deployed on Oxygen.

## Tech stack

- [Hydrogen](https://shopify.dev/custom-storefronts/hydrogen) — Shopify's headless commerce framework
- [React Router 7](https://reactrouter.com/) — routing and server-side rendering
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — dev server and bundler
- Deployed on [Shopify Oxygen](https://shopify.dev/custom-storefronts/oxygen)

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, menu preview, shop collections, locations, our story, contact |
| `/menu` | Full drink and food menu |
| `/locations` | Store locations |
| `/collections/:handle` | Collection pages |
| `/products/:handle` | Product detail page |
| `/cart` | Cart with recommended products |
| `/search` | Dynamic predictive search |
| `/account` | Customer account (login, orders, profile) |

## Getting started

**Requirements:** Node.js 22 or 24

Install dependencies:

```bash
npm install
```

You'll need a `.env` file with your Shopify storefront credentials. Ask a teammate or pull from the Shopify dashboard:

```
SESSION_SECRET=
PUBLIC_STOREFRONT_API_TOKEN=
PUBLIC_STORE_DOMAIN=
```

## Local development

```bash
npm run dev
```

## Build & preview

```bash
npm run build
npm run preview
```

## Other commands

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript check
npm run codegen     # Regenerate Shopify Storefront API types
```

## Deployment

This project deploys automatically to Shopify Oxygen via the GitHub Actions workflow in `.github/workflows/`. Pushes to `main` trigger a production deploy.
