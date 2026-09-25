---
title: Online store for a coffee brand
summary: Catalog, cart and orders confirmed over WhatsApp, with an admin panel to manage products and orders.
year: 2026
role: End-to-end design and development
stack: [Next.js 16, Payload CMS, PostgreSQL, Tailwind CSS, Playwright]
order: 2
---

## The problem

A coffee brand was already selling its product but had no online store. It needed a store where customers could build
their own order, and a simple panel for the team to manage products, prices and orders.

## Key decisions

- **Orders over WhatsApp.** It is how most local customers buy, and it allowed launching without
  integrating a payment gateway on day one.
- **The server owns the prices.** The cart only sends IDs and quantities; the total is recalculated
  from the database so nobody can pay less by tampering with the browser.
- **An admin panel for non-technical people.** Payload CMS provides a Spanish panel with roles, drafts
  and automatically optimized photos.

## Outcome

In development. The catalog, cart, admin panel and end-to-end checkout tests already work; it is not live yet.
