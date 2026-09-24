import type { Localizable } from '@/data/localized'

export type SkillGroup = {
  title: Localizable
  icon: 'browser' | 'database' | 'sheet' | 'container'
  /** Número de figura en el estilo de lámina ("Fig. 2"). */
  figure: number
  items: Localizable[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Front-end',
    icon: 'browser',
    figure: 2,
    items: ['React', 'Next.js', 'Astro', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: { es: 'Bases de datos', en: 'Databases' },
    icon: 'database',
    figure: 3,
    items: ['PostgreSQL', 'MongoDB', 'MariaDB', 'SQL'],
  },
  {
    title: { es: 'ERP y datos', en: 'ERP & data' },
    icon: 'sheet',
    figure: 4,
    items: ['Odoo', 'Python', 'Excel', { es: 'Migración de datos', en: 'Data migration' }],
  },
  {
    title: { es: 'Infraestructura y automatización', en: 'Infrastructure & automation' },
    icon: 'container',
    figure: 5,
    items: ['Docker', 'n8n', 'Linux', 'Windows', 'Git'],
  },
]
