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
    /** [PENDIENTE] enlace de LinkedIn */
    linkedin: '',
  },
  summary: {
    es: 'Estudiante de último año de Ingeniería en Sistemas y Ciencias de la Computación, enfocado en front-end y bases de datos. Experiencia en soporte y consultoría, implementación de Odoo y limpieza y migración de datos con SQL y Python. Trabajo de forma ordenada y limpia, y busco constantemente nuevas certificaciones y retos.',
    en: 'Final-year Systems and Computer Science Engineering student focused on front-end and databases. Experience in support and consulting, Odoo implementation, and data cleaning and migration with SQL and Python. I work in an orderly, clean way and I am always looking for new certifications and challenges.',
  } satisfies Localizable,
  education: [
    {
      institution: 'Universidad del Istmo (UNIS)',
      degree: {
        es: 'Ingeniería en Sistemas y Ciencias de la Computación',
        en: 'B.S. in Systems and Computer Science Engineering',
      } satisfies Localizable,
      period: {
        es: '[PENDIENTE: año de inicio] — 2026 · último semestre',
        en: '[PENDING: start year] — 2026 · final semester',
      } satisfies Localizable,
    },
  ],
  languages: [
    { name: { es: 'Español', en: 'Spanish' }, level: { es: 'nativo', en: 'native' } },
    {
      name: { es: 'Inglés', en: 'English' },
      level: { es: 'B2 (MCER), certificado', en: 'B2 (CEFR), certified' },
    },
  ],
  /** Más certificaciones se agregan aquí; aparecen en el portafolio y en el CV. */
  certifications: [
    {
      name: 'ELASH II',
      issuer: 'Universidad del Valle de Guatemala · CIE',
      date: { es: 'Junio 2026', en: 'June 2026' },
      detail: {
        es: '166/200 · Inglés nivel B2 (MCER)',
        en: '166/200 · English level B2 (CEFR)',
      },
    },
  ],
}
