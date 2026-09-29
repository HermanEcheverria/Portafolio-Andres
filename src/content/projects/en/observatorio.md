---
title: 'Observatorio: USDC in real time'
summary: A custom indexer for the Base network and a live dashboard showing how Circle's digital dollar moves, also in quetzales.
year: 2026
role: Design, development and data
stack: [TypeScript, viem, PostgreSQL, Drizzle, Hono, Astro, D3, Vitest]
order: 2
---

## The problem

USDC, Circle's digital dollar, moves billions of dollars a day on Base, an Ethereum network. Block
explorers show individual transactions and price sites show the market, but neither answers simple
questions: how much moved in the last hour? Is USDC being minted or burned? How large are the
transfers? I wanted to answer them by reading the blockchain directly, without relying on a
third-party API for the core data.

## What I built

- **A custom indexer** that reads `Transfer` events from the official USDC contract in batches of
  confirmed blocks, using viem over a JSON-RPC node.
- **A data model built for the real volume.** Base sees about 130,000 transfers an hour; storing
  every one does not fit a small database. Each block is summarized into one row (count, volume,
  size histogram, mints and burns), and only transfers of one million dollars or more are stored
  in full.
- **Scheduled jobs** that pull prices from CoinGecko, stablecoin supply from DefiLlama and the
  Bank of Guatemala's reference exchange rate, so everything can also be shown in quetzales.
- **A read-only Hono API** and **an Astro dashboard** with hand-built SVG charts, in the same
  engraved style as this portfolio.

## Key decisions

- **Resilient to failures.** Each batch and its checkpoint are saved in a single transaction,
  replaying a batch never duplicates data, and if the last block's hash changes (a chain
  reorganization) the affected rows are deleted and reindexed.
- **No in-memory state.** The indexer step reads everything from the database, so a Node loop can
  call it locally or a cloud cron job can call it later, without a rewrite.
- **No Docker needed for development.** Locally it uses PGlite, PostgreSQL compiled to
  WebAssembly; in production a single environment variable switches to a real Postgres.
- **Honest, accessible charts.** The palette passed a contrast and color-blindness validator,
  every chart has keyboard navigation and an equivalent table, and incomplete intervals are marked
  as partial instead of looking like drops.

## Outcome

In local development. It indexes an hour of the network in about 30 seconds and keeps data about
20 seconds behind, the time blocks take to confirm. It has 30 automated tests, including simulated
reorganizations on a fake chain.
