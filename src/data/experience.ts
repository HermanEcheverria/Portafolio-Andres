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
    period: { es: '[PENDIENTE: fechas]', en: '[PENDING: dates]' },
    description: {
      es: 'Empresa de venta de fertilizantes e insumos agrícolas. En equipo implementamos su CRM en Odoo y depuramos los datos de su base de datos; lo que estaba en Excel lo migramos con SQL y Python.',
      en: 'A company selling fertilizers and farming supplies. As a team we implemented their CRM in Odoo and cleaned their database; data kept in Excel was migrated with SQL and Python.',
    },
    tags: ['Odoo', 'CRM', 'SQL', 'Python', { es: 'Migración de datos', en: 'Data migration' }],
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
