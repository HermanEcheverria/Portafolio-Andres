import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

/**
 * Proyectos: un archivo Markdown por idioma en src/content/projects/<lang>/.
 * El id queda como "es/tienda-cafe": el mismo nombre de archivo une las traducciones.
 * (No usar un campo `slug`: el loader lo tomaría como id y las traducciones chocarían.)
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200),
    year: z.number().int(),
    role: z.string(),
    stack: z.array(z.string()).min(1),
    order: z.number().int(),
    /** Borrador: se ve en desarrollo pero no se publica. */
    draft: z.boolean().default(false),
    links: z.object({ demo: z.url().optional(), repo: z.url().optional() }).default({}),
  }),
})

export const collections = { projects }
