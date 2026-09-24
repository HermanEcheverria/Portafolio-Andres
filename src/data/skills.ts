import type { Localizable } from '@/data/localized'

export type SkillGroup = {
  title: Localizable
  /** Número de figura en el estilo de lámina ("Fig. 2"). */
  figure: number
  items: Localizable[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Front-end',
    figure: 2,
    items: ['React', 'Next.js', 'Astro', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: { es: 'Bases de datos', en: 'Databases' },
    figure: 3,
    items: ['PostgreSQL', 'MongoDB', 'MariaDB', 'SQL'],
  },
  {
    title: { es: 'ERP y datos', en: 'ERP & data' },
    figure: 4,
    items: ['Odoo', 'Python', 'Excel', { es: 'Migración de datos', en: 'Data migration' }],
  },
  {
    title: { es: 'Infraestructura y automatización', en: 'Infrastructure & automation' },
    figure: 5,
    items: ['Docker', 'n8n', 'Linux', 'Windows', 'Git'],
  },
]
