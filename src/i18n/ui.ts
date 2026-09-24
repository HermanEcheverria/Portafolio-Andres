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
    'nav.experience': 'Experiencia',
    'nav.about': 'Sobre mí',
    'nav.contact': 'Contacto',
    'nav.skip': 'Saltar al contenido',
    'hero.eyebrow': 'Lámina 0 · Retrato del autor',
    'hero.lead':
      'Ingeniero en Sistemas y Ciencias de la Computación en formación, enfocado en front-end y bases de datos. Trabajo ordenado y limpio, como un grabado:',
    'hero.accent': 'cada línea tiene un propósito.',
    'hero.cta.projects': 'Ver las láminas',
    'hero.cta.cv': 'CV (PDF)',
    'hero.scene': 'Esfera en 3D dibujada con líneas de grabado; la luz sigue al cursor.',
    'hero.caption': 'Fig. 1 — Mueve el cursor: la luz te sigue',
    'projects.title': 'Láminas',
    'projects.subtitle': 'Cada proyecto, con su diagrama grabado',
    'projects.plate': 'Lámina',
    'projects.case': 'Ver caso de estudio',
    'experience.title': 'Experiencia',
    'experience.subtitle': 'Registro de campo',
    'skills.title': 'Instrumentos',
    'skills.figure': 'Fig.',
    'about.title': 'Sobre mí',
    'about.p1':
      'Me gusta trabajar de forma ordenada y limpia, y eso se nota en lo que construyo: desde interfaces cuidadas hasta bases de datos bien depuradas.',
    'about.p2':
      'Disfruto sobre todo el front-end y el diseño de bases de datos. He trabajado en Linux y Windows, y siempre ando buscando nuevas certificaciones y retos.',
    'about.p3':
      'Fuera del código, soy fan de los juegos de FromSoftware. Si te pierdes en este sitio, hay una hoguera esperándote.',
    'contact.title': '¿Construimos algo?',
    'contact.body':
      'Actualmente busco empleo. Si tienes un proyecto o una vacante donde encaje, escríbeme.',
    'contact.email': '[PENDIENTE: correo]',
    'notfound.title': 'Has muerto',
    'notfound.body': 'Esta página no existe. Descansa un momento y vuelve a intentarlo.',
    'notfound.cta': 'Descansar en la hoguera',
    'footer.printed': 'impreso en HTML',
  },
  en: {
    'meta.title': 'Andrés Echeverría · Systems Engineering',
    'meta.description':
      'Portfolio of Andrés Echeverría: end-to-end software projects, from the server to the interface.',
    'nav.projects': 'Plates',
    'nav.experience': 'Experience',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.skip': 'Skip to content',
    'hero.eyebrow': 'Plate 0 · Portrait of the author',
    'hero.lead':
      'Systems and Computer Science engineer in training, focused on front-end and databases. I work in an orderly, clean way, like an engraving:',
    'hero.accent': 'every line has a purpose.',
    'hero.cta.projects': 'See the plates',
    'hero.cta.cv': 'Résumé (PDF)',
    'hero.scene': 'A 3D sphere drawn with engraving lines; the light follows your cursor.',
    'hero.caption': 'Fig. 1 — Move your cursor: the light follows you',
    'projects.title': 'Plates',
    'projects.subtitle': 'Every project, with its engraved diagram',
    'projects.plate': 'Plate',
    'projects.case': 'Read the case study',
    'experience.title': 'Experience',
    'experience.subtitle': 'Field notes',
    'skills.title': 'Instruments',
    'skills.figure': 'Fig.',
    'about.title': 'About me',
    'about.p1':
      'I like to work in an orderly, clean way, and it shows in what I build: from careful interfaces to well-cleaned databases.',
    'about.p2':
      'I especially enjoy front-end work and database design. I have worked on Linux and Windows, and I am always looking for new certifications and challenges.',
    'about.p3':
      'Away from code, I am a FromSoftware fan. If you get lost on this site, there is a bonfire waiting for you.',
    'contact.title': 'Shall we build something?',
    'contact.body':
      'I am currently looking for a job. If you have a project or an opening where I could fit, write to me.',
    'contact.email': '[PENDING: email]',
    'notfound.title': 'You died',
    'notfound.body': 'This page does not exist. Rest for a moment and try again.',
    'notfound.cta': 'Rest at the bonfire',
    'footer.printed': 'printed in HTML',
  },
} as const satisfies Record<Lang, Record<string, string>>

export type UIKey = keyof (typeof ui)['es']
