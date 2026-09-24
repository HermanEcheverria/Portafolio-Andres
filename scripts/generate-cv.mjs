// Genera los PDF del CV a partir de las páginas /cv y /en/cv ya compiladas.
// Uso: pnpm build && pnpm cv
import { createReadStream, existsSync, statSync } from 'node:fs'
import { copyFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, resolve } from 'node:path'

import { chromium } from 'playwright'

const DIST = resolve('dist')
const PUBLIC = resolve('public')
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
}

if (!existsSync(join(DIST, 'cv', 'index.html')) && !existsSync(join(DIST, 'cv.html'))) {
  console.error('No encuentro dist/cv. Corre primero: pnpm build')
  process.exit(1)
}

// Servidor estático mínimo: las rutas de Astro son absolutas ("/_astro/…")
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  const candidates = [join(DIST, path), join(DIST, path, 'index.html'), join(DIST, `${path}.html`)]
  const file = candidates.find((f) => f.startsWith(DIST) && existsSync(f) && statSync(f).isFile())
  if (!file) {
    res.writeHead(404).end()
    return
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
})
await new Promise((ok) => server.listen(0, ok))
const base = `http://localhost:${server.address().port}`

const browser = await chromium.launch()
try {
  for (const [route, output] of [
    ['/cv', 'cv.pdf'],
    ['/en/cv', 'cv-en.pdf'],
  ]) {
    const page = await browser.newPage()
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' })
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
