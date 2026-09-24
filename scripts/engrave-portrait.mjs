// Convierte el retrato en un grabado: líneas horizontales cuyo grosor sigue la
// oscuridad de la foto, con una leve ondulación para que se lea como buril.
// Uso: node scripts/engrave-portrait.mjs  →  src/assets/retrato-grabado.svg
import { writeFile } from 'node:fs/promises'

import sharp from 'sharp'

const INPUT = 'src/assets/retrato.png'
const OUTPUT = 'src/assets/retrato-grabado.svg'
const WIDTH = 480 // ancho del SVG en unidades
const LINE_GAP = 4.2 // separación entre líneas
const MAX_WIDTH = 3.9 // grosor máximo de una línea (zonas más oscuras)
const STEP = 2 // resolución horizontal del muestreo

// flatten: un fondo transparente se leería como negro y se llenaría de tinta
const image = sharp(INPUT).flatten({ background: '#ffffff' }).greyscale().normalise()
const { width: srcW, height: srcH } = await image.metadata()
const height = Math.round((WIDTH * srcH) / srcW)
const { data } = await image
  .resize(WIDTH, height, { fit: 'fill' })
  .blur(0.5)
  .raw()
  .toBuffer({ resolveWithObject: true })

const darkness = (x, y) => {
  const px = Math.min(WIDTH - 1, Math.max(0, Math.round(x)))
  const py = Math.min(height - 1, Math.max(0, Math.round(y)))
  const lum = data[py * WIDTH + px] / 255
  // Curva: el fondo blanco desaparece y los tonos medios (la piel) quedan finos,
  // así los rasgos se leen y el cabello y el traje concentran la tinta
  return Math.max(0, Math.min(1, (0.95 - lum) / 0.95)) ** 1.7
}

const n = (v) => Math.round(v * 10) / 10
const paths = []
for (let y = LINE_GAP / 2, row = 0; y < height; y += LINE_GAP, row++) {
  // Cada línea se parte en tramos donde hay tinta
  let top = []
  let bottom = []
  const flush = () => {
    if (top.length > 1) {
      const d = [...top, ...bottom.reverse()].map(
        ([px, py], i) => `${i ? 'L' : 'M'}${n(px)} ${n(py)}`,
      )
      paths.push(`${d.join('')}Z`)
    }
    top = []
    bottom = []
  }
  for (let x = 0; x <= WIDTH; x += STEP) {
    const wave = Math.sin(x * 0.045 + row * 0.6) * 0.7
    const w = darkness(x, y) * MAX_WIDTH
    if (w < 0.2) {
      flush()
      continue
    }
    top.push([x, y + wave - w / 2])
    bottom.push([x, y + wave + w / 2])
  }
  flush()
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${height}" fill="currentColor"><path d="${paths.join('')}"/></svg>\n`
await writeFile(OUTPUT, svg)
console.log(`✓ ${OUTPUT} (${(svg.length / 1024).toFixed(0)} KB, ${paths.length} trazos)`)
