import type { Lang } from '@/i18n/ui'

type Localized = Record<Lang, string>

export type Experience = {
  organization: string
  role: Localized
  /** Texto libre, p. ej. "2024 — 2025". */
  period: Localized
  description: Localized
  tags: string[]
}

/**
 * Experiencia, de la más reciente a la más antigua.
 * [PENDIENTE] marca datos que Andrés aún no ha confirmado (fechas y puestos exactos).
 */
export const experience: Experience[] = [
  {
    organization: 'GIT Guatemala',
    role: { es: '[PENDIENTE: puesto] · Consultoría', en: '[PENDING: role] · Consulting' },
    period: { es: '1 año · [PENDIENTE: fechas]', en: '1 year · [PENDING: dates]' },
    description: {
      es: '[PENDIENTE: qué hacías en la consultora y con qué tecnologías.]',
      en: '[PENDING: what you did at the consulting firm and with which technologies.]',
    },
    tags: [],
  },
  {
    organization: 'Merco Agro',
    role: { es: 'Prácticas profesionales', en: 'Internship' },
    period: { es: '[PENDIENTE: fechas]', en: '[PENDING: dates]' },
    description: {
      es: 'Empresa de venta de fertilizantes e insumos agrícolas. En equipo implementamos un CRM y depuramos los datos de su base de datos.',
      en: 'A company selling fertilizers and farming supplies. As a team we implemented a CRM and cleaned the data in their database.',
    },
    tags: ['CRM'],
  },
  {
    organization: 'Grupo PIT',
    role: { es: 'Prácticas profesionales', en: 'Internship' },
    period: { es: '[PENDIENTE: fechas]', en: '[PENDING: dates]' },
    description: {
      es: 'Limpieza y depuración de los datos de sus registros.',
      en: 'Cleaning and deduplicating the data in their records.',
    },
    tags: [],
  },
]
