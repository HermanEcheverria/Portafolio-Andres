import type { Lang } from '@/i18n/ui'

export type SkillGroup = {
  title: Record<Lang, string>
  /** Número de figura en el estilo de lámina ("Fig. 2"). */
  figure: number
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: { es: 'Front-end', en: 'Front-end' },
    figure: 2,
    items: ['React', 'Next.js', 'Astro', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: { es: 'Bases de datos', en: 'Databases' },
    figure: 3,
    items: ['PostgreSQL', 'MongoDB', 'MariaDB', 'SQL'],
  },
  {
    title: { es: 'Infraestructura y automatización', en: 'Infrastructure & automation' },
    figure: 4,
    items: ['Docker', 'n8n', 'Linux', 'Windows', 'Git'],
  },
]
