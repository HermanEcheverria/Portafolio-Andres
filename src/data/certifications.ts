import type { Localizable } from '@/data/localized'
import type { Lang } from '@/i18n/ui'

export type Certification = {
  name: string
  issuer: (typeof issuers)[number]
  /** Fecha de emisión, AAAA-MM-DD. */
  date: string
  note?: Localizable
  /** false: se muestra en el portafolio pero no en el CV (para que quepa en una página). */
  inCv?: boolean
}

/** Orden de las instituciones en el sitio y en el CV. */
export const issuers = [
  'Project Management Institute',
  'Cisco Networking Academy',
  'IBM SkillsBuild',
  'Universidad del Valle de Guatemala · CIE',
  'UNIS Business School',
] as const

export const certifications: Certification[] = [
  {
    name: 'Fundamentals of Agile Project Management',
    issuer: 'Project Management Institute',
    date: '2026-08-18',
  },
  {
    name: 'Generative AI Overview for Project Managers',
    issuer: 'Project Management Institute',
    date: '2026-07-31',
  },
  {
    name: 'Fundamentals of Predictive Project Management',
    issuer: 'Project Management Institute',
    date: '2025-02-08',
  },
  {
    name: 'Create Digital Content, Communicate, and Collaborate Online',
    issuer: 'Cisco Networking Academy',
    date: '2025-03-06',
  },
  {
    name: 'Engaging Stakeholders for Success',
    issuer: 'Cisco Networking Academy',
    date: '2025-01-27',
  },
  { name: 'Creating Compelling Reports', issuer: 'Cisco Networking Academy', date: '2025-01-24' },
  {
    name: 'Networking Academy Learn-A-Thon 2024',
    issuer: 'Cisco Networking Academy',
    date: '2024-06-17',
    note: { es: 'participación', en: 'participant' },
    inCv: false,
  },
  {
    name: 'Junior Cybersecurity Analyst Career Path',
    issuer: 'Cisco Networking Academy',
    date: '2024-06-11',
  },
  { name: 'Project Management Fundamentals', issuer: 'IBM SkillsBuild', date: '2026-08-12' },
  {
    name: 'Project Management Fundamentals',
    issuer: 'IBM SkillsBuild',
    date: '2025-04-19',
    note: { es: 'avalado por IPMA', en: 'IPMA-endorsed' },
  },
  {
    name: 'ELASH II',
    issuer: 'Universidad del Valle de Guatemala · CIE',
    date: '2026-06-04',
    note: { es: '166/200 · inglés B2 (MCER)', en: '166/200 · English B2 (CEFR)' },
  },
  {
    name: 'Analítica de Datos',
    issuer: 'UNIS Business School',
    date: '2022-06-29',
    note: { es: 'diploma', en: 'diploma course' },
  },
]

/** Cursos sin terminar: se muestran aparte, nunca como certificaciones. */
export const inProgress = [
  { name: 'Docker de cero a experto: con Compose y Swarm', provider: 'Udemy' },
  { name: 'The Ultimate SSCP Masterclass (ISC2)', provider: 'Udemy' },
]

/** Certificaciones agrupadas por institución, de la más reciente a la más antigua. */
export function certificationsByIssuer({ forCv = false } = {}) {
  return issuers.map((issuer) => ({
    issuer,
    items: certifications
      .filter((c) => c.issuer === issuer && (!forCv || c.inCv !== false))
      .sort((a, b) => b.date.localeCompare(a.date)),
  }))
}

export function formatMonthYear(date: string, lang: Lang): string {
  const [year, month] = date.split('-').map(Number)
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-GT' : 'en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 15)))
}
