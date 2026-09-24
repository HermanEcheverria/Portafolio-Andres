import type { Localizable } from '@/data/localized'

export type Experience = {
  organization: string
  role: Localizable
  /** Texto libre, p. ej. "2024 — 2025". */
  period: Localizable
  description: Localizable
  tags: Localizable[]
}

/**
 * Experiencia, de la más reciente a la más antigua.
 * [PENDIENTE] marca datos que Andrés aún no ha confirmado.
 */
export const experience: Experience[] = [
  {
    organization: 'Grupo PIT',
    role: { es: 'Prácticas profesionales', en: 'Internship' },
    period: { es: '3 — 28 jun 2025', en: 'Jun 3 — 28, 2025' },
    description: {
      es: 'Limpieza y depuración de los datos de sus registros.',
      en: 'Cleaning and deduplicating the data in their records.',
    },
    tags: [],
  },
  {
    organization: 'GIT Guatemala',
    role: { es: 'Ingeniero de soporte', en: 'Support Engineer' },
    period: '2023 — 2024',
    description: {
      es: 'Soporte a clientes y consultoría.',
      en: 'Customer support and consulting.',
    },
    tags: [],
  },
  {
    organization: 'Merco Agro',
    role: { es: 'Prácticas profesionales', en: 'Internship' },
    period: { es: '3 — 28 jun 2024', en: 'Jun 3 — 28, 2024' },
    description: {
      es: 'En equipo implementamos su CRM en Odoo y depuramos su base de datos, migrando desde Excel con SQL y Python.',
      en: 'As a team we implemented their Odoo CRM and cleaned their database, migrating from Excel with SQL and Python.',
    },
    tags: ['Odoo', 'CRM', 'SQL', 'Python', { es: 'Migración de datos', en: 'Data migration' }],
  },
]
