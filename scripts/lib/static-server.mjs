// Servidor estático mínimo para abrir el sitio compilado (dist/) con un navegador.
// Las rutas de Astro son absolutas ("/_astro/…"), así que file:// no sirve.
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, resolve, sep } from 'node:path'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
}

export const DIST = resolve('dist')

export async function startStaticServer() {
  if (!existsSync(join(DIST, 'index.html'))) {
    throw new Error('No encuentro dist/. Corre primero: pnpm build')
  }
  const server = createServer((req, res) => {
    let path
    try {
      path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    } catch {
      res.writeHead(400).end()
      return
    }
    const candidates = [
      join(DIST, path),
      join(DIST, path, 'index.html'),
      join(DIST, `${path}.html`),
    ]
    const file = candidates.find(
      (f) => (f === DIST || f.startsWith(DIST + sep)) && existsSync(f) && statSync(f).isFile(),
    )
    if (!file) {
      res.writeHead(404).end()
      return
    }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' })
    createReadStream(file).pipe(res)
  })
  await new Promise((ok) => server.listen(0, ok))
  return {
    base: `http://localhost:${server.address().port}`,
    close: () => server.close(),
  }
}
