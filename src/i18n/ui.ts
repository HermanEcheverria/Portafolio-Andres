export const languages = { es: 'Español', en: 'English' } as const
export type Lang = keyof typeof languages
export const defaultLang: Lang = 'es'

/**
 * Textos de la interfaz. Lo marcado [PENDIENTE] espera información de Andrés;
 * no inventar datos personales.
 */
export const ui = {
  es: {
    'meta.title': 'Andrés Echeverría · Ingeniería en Sistemas',
    'meta.description':
      'Portafolio de Andrés Echeverría: proyectos de software de punta a punta, del servidor a la interfaz.',
    'nav.projects': 'Láminas',
    'nav.about': 'Sobre mí',
    'nav.contact': 'Contacto',
    'nav.skip': 'Saltar al contenido',
    'hero.eyebrow': 'Lámina 0 · Retrato del autor',
    'hero.lead':
      'Ingeniero en Sistemas y Ciencias de la Computación en formación. Hago software con el detalle de un grabado:',
    'hero.accent': 'cada línea tiene un propósito.',
    'hero.cta.projects': 'Ver las láminas',
    'hero.cta.cv': 'CV (PDF)',
    'hero.scene': 'Esfera en 3D dibujada con líneas de grabado; la luz sigue al cursor.',
    'hero.caption': 'Fig. 1 — Mueve el cursor: la luz te sigue',
    'projects.title': 'Láminas',
    'projects.subtitle': 'Cada proyecto, con su diagrama grabado',
    'projects.plate': 'Lámina',
    'projects.case': 'Ver caso de estudio',
    'about.title': 'Sobre mí',
    'about.body': '[PENDIENTE: quién eres, qué te gusta construir y qué tipo de trabajo buscas.]',
    'contact.title': '¿Construimos algo?',
    'contact.body': '[PENDIENTE: disponibilidad y mejor forma de contactarte.]',
    'footer.printed': 'impreso en HTML',
  },
  en: {
    'meta.title': 'Andrés Echeverría · Systems Engineering',
    'meta.description':
      'Portfolio of Andrés Echeverría: end-to-end software projects, from the server to the interface.',
    'nav.projects': 'Plates',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.skip': 'Skip to content',
    'hero.eyebrow': 'Plate 0 · Portrait of the author',
    'hero.lead':
      'Systems and Computer Science engineer in training. I build software with the care of an engraving:',
    'hero.accent': 'every line has a purpose.',
    'hero.cta.projects': 'See the plates',
    'hero.cta.cv': 'Résumé (PDF)',
    'hero.scene': 'A 3D sphere drawn with engraving lines; the light follows your cursor.',
    'hero.caption': 'Fig. 1 — Move your cursor: the light follows you',
    'projects.title': 'Plates',
    'projects.subtitle': 'Every project, with its engraved diagram',
    'projects.plate': 'Plate',
    'projects.case': 'Read the case study',
    'about.title': 'About me',
    'about.body': '[PENDING: who you are, what you like to build and what kind of work you want.]',
    'contact.title': 'Shall we build something?',
    'contact.body': '[PENDING: availability and best way to reach you.]',
    'footer.printed': 'printed in HTML',
  },
} as const satisfies Record<Lang, Record<string, string>>

export type UIKey = keyof (typeof ui)['es']
