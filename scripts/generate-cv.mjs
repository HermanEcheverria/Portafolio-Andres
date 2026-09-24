// Genera los PDF del CV a partir de las páginas /cv y /en/cv ya compiladas.
// Uso: pnpm build && pnpm cv
import { copyFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

import { chromium } from 'playwright'

import { DIST, startStaticServer } from './lib/static-server.mjs'

const PUBLIC = resolve('public')
const server = await startStaticServer()
const browser = await chromium.launch()
try {
  for (const [route, output] of [
    ['/cv', 'cv.pdf'],
    ['/en/cv', 'cv-en.pdf'],
  ]) {
    const page = await browser.newPage()
    await page.goto(`${server.base}${route}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const target = join(PUBLIC, output)
    const pdf = await page.pdf({
      path: target,
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: true,
    })
    // Un CV de estudiante debe caber en una hoja: avisar si algo nuevo lo desborda
    const pages = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length ?? 0
    if (pages > 1) console.warn(`⚠ ${output} tiene ${pages} páginas; recorta contenido o espaciado`)
    // También a dist/ para no tener que recompilar
    await copyFile(target, join(DIST, output))
    console.log(`✓ ${output}`)
  }
} finally {
  await browser.close()
  server.close()
}
