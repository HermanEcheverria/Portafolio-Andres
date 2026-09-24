// Genera las imágenes para compartir (Open Graph, 1200×630) desde /og-card.
// Uso: pnpm build && pnpm og
import { copyFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

import { chromium } from 'playwright'

import { DIST, startStaticServer } from './lib/static-server.mjs'

const PUBLIC = resolve('public')
const server = await startStaticServer()
const browser = await chromium.launch()
try {
  for (const [route, output] of [
    ['/og-card', 'og.png'],
    ['/en/og-card', 'og-en.png'],
  ]) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
    await page.goto(`${server.base}${route}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const target = join(PUBLIC, output)
    await page.screenshot({ path: target })
    await copyFile(target, join(DIST, output))
    console.log(`✓ ${output}`)
  }
} finally {
  await browser.close()
  server.close()
}
