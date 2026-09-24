import type { Localizable } from '@/data/localized'

/**
 * Datos de contacto y formación. Los usan el portafolio y el CV, así que se
 * actualizan en un solo lugar. Por privacidad: nada de dirección.
 */
export const profile = {
  name: 'Herman Andrés Echeverría Rojas',
  shortName: 'Andrés Echeverría',
  // Aún no se gradúa: el título describe su enfoque, no un grado obtenido
  title: {
    es: 'Desarrollador front-end y de bases de datos',
    en: 'Front-end & Database Developer',
  } satisfies Localizable,
  location: 'Guatemala',
  email: 'herman.andres.echeverria@gmail.com',
  /** Solo se muestra en el CV, no en las páginas del sitio (menos spam de bots). */
  phone: '+502 5123-7070',
  website: 'https://andresecheverria.com',
  links: {
    github: 'https://github.com/HermanEcheverria',
    linkedin: 'https://www.linkedin.com/in/herman-andr%C3%A9s-echeverria-rojas-501180256/',
  },
  summary: {
    es: 'Estudiante de último año de Ingeniería en Sistemas, enfocado en front-end y bases de datos. Experiencia en soporte y consultoría, implementación de Odoo y migración de datos con SQL y Python. Certificado en gestión de proyectos (PMI, IBM) y con formación en ciberseguridad (Cisco).',
    en: 'Final-year Systems Engineering student focused on front-end and databases. Experience in support and consulting, Odoo implementation, and data migration with SQL and Python. Certified in project management (PMI, IBM) with cybersecurity training (Cisco).',
  } satisfies Localizable,
  education: [
    {
      institution: 'Universidad del Istmo (UNIS)',
      degree: {
        es: 'Ingeniería en Sistemas y Ciencias de la Computación',
        en: 'B.S. in Systems and Computer Science Engineering',
      } satisfies Localizable,
      period: {
        es: '2021 — 2026 · último semestre',
        en: '2021 — Expected 2026',
      } satisfies Localizable,
    },
  ],
  languages: [
    { name: { es: 'Español', en: 'Spanish' }, level: { es: 'nativo', en: 'native' } },
    {
      name: { es: 'Inglés', en: 'English' },
      level: { es: 'B2 (MCER), certificado ELASH II', en: 'B2 (CEFR), ELASH II certified' },
    },
  ],
}
