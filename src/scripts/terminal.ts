import type { TerminalData } from '@/lib/commands'

type Line = string | { text: string; href: string; external?: boolean }
type Handler = (args: string[]) => Line[] | void

const COFFEE = String.raw`
      ( (
       ) )
    ........
    |      |]
    \      /
     '----'`

const BONFIRE = String.raw`
         )
        ) \
       / ) (
       \(_)/
     ____|____`

const TEXT = {
  es: {
    welcome: "Bienvenido. Escribe 'ayuda' para ver los comandos.",
    unknown: (c: string) => `comando no encontrado: ${c}. Prueba 'ayuda'.`,
    help: [
      'ayuda              esta lista',
      'whoami             quién soy',
      'proyectos          mis láminas; abrir <n> para ver una',
      'experiencia        dónde he trabajado',
      'habilidades        mis instrumentos',
      'contacto           cómo escribirme',
      'cv                 ver y descargar mi CV',
      'idioma             cambiar a inglés',
      'limpiar · salir',
    ],
    secrets: 'Hay algunos comandos más escondidos. Suerte, cazador.',
    bonfire: 'Descansas en la hoguera. Tu progreso se ha guardado.',
    sun: '\\[T]/  ¡Alabado sea el sol!',
    coffee: 'Una taza, recién grabada. Buen momento para leer un caso de estudio.',
    sudo: '[sudo] contraseña para reclutador: ********',
    granted: 'Permiso concedido. Escríbeme y conversemos:',
    noProject: 'No existe esa lámina. Prueba: abrir 1',
    opening: 'Abriendo…',
  },
  en: {
    welcome: "Welcome. Type 'help' to list the commands.",
    unknown: (c: string) => `command not found: ${c}. Try 'help'.`,
    help: [
      'help               this list',
      'whoami             who I am',
      'projects           my plates; open <n> to read one',
      'experience         where I have worked',
      'skills             my instruments',
      'contact            how to reach me',
      'cv                 view and download my résumé',
      'lang               switch to Spanish',
      'clear · exit',
    ],
    secrets: 'There are a few hidden commands. Good luck, hunter.',
    bonfire: 'You rest at the bonfire. Your progress has been saved.',
    sun: '\\[T]/  Praise the sun!',
    coffee: 'A cup, freshly engraved. Good time to read a case study.',
    sudo: '[sudo] password for recruiter: ********',
    granted: 'Permission granted. Write to me and let us talk:',
    noProject: 'That plate does not exist. Try: open 1',
    opening: 'Opening…',
  },
}

/** Terminal escondida: se abre con ~ o ` (o desde la paleta de comandos). */
export function initTerminal() {
  const dialog = document.querySelector<HTMLDialogElement>('#terminal')
  const output = dialog?.querySelector<HTMLElement>('[data-output]')
  const input = dialog?.querySelector<HTMLInputElement>('input')
  const dataEl = document.querySelector<HTMLScriptElement>('#terminal-datos')
  if (!dialog || !output || !input || !dataEl) return

  const data: TerminalData = JSON.parse(dataEl.textContent ?? '{}')
  const t = TEXT[data.lang]
  const history: string[] = []
  let cursor = 0
  let greeted = false

  const go = (href: string) => {
    window.location.href = href
  }

  const commands: Record<string, Handler> = {
    help: () => [...t.help, '', t.secrets],
    whoami: () => [data.name, data.title],
    projects: () =>
      data.projects.map((p, i) => ({ text: `${i + 1}. ${p.title} (${p.year})`, href: p.href })),
    open: ([n]) => {
      const project = data.projects[Number(n) - 1]
      if (!project) return [t.noProject]
      setTimeout(() => go(project.href), 400)
      return [t.opening]
    },
    experience: () => data.experience,
    skills: () => data.skills,
    contact: () => [
      { text: data.email, href: `mailto:${data.email}` },
      ...data.links.map((l) => ({
        text: `${l.label}: ${l.href.replace(/^https?:\/\//, '')}`,
        href: l.href,
        external: true,
      })),
    ],
    cv: () => [
      { text: data.cv.page, href: data.cv.page },
      { text: data.cv.pdf, href: data.cv.pdf },
    ],
    lang: () => {
      setTimeout(() => go(data.otherLang.href), 300)
      return [t.opening]
    },
    clear: () => {
      output.replaceChildren()
    },
    exit: () => {
      dialog.close()
    },
    echo: (args) => [args.join(' ')],
    // Escondidos
    bonfire: () => [BONFIRE, t.bonfire],
    'praise-the-sun': () => [t.sun],
    coffee: () => [COFFEE, t.coffee],
    'sudo-hire': () => [t.sudo, t.granted, { text: data.email, href: `mailto:${data.email}` }],
  }
  // Alias en español y frases de varias palabras
  const aliases: Record<string, string> = {
    ayuda: 'help',
    quien: 'whoami',
    proyectos: 'projects',
    laminas: 'projects',
    abrir: 'open',
    experiencia: 'experience',
    habilidades: 'skills',
    instrumentos: 'skills',
    contacto: 'contact',
    idioma: 'lang',
    limpiar: 'clear',
    salir: 'exit',
    hoguera: 'bonfire',
    cafe: 'coffee',
    'praise the sun': 'praise-the-sun',
    'alaba al sol': 'praise-the-sun',
    'sudo contratar': 'sudo-hire',
    'sudo hire': 'sudo-hire',
  }

  const print = (line: Line, className = '') => {
    const row = document.createElement('div')
    row.className = `whitespace-pre-wrap ${className}`
    if (typeof line === 'string') {
      row.textContent = line
    } else {
      const link = document.createElement('a')
      link.href = line.href
      link.textContent = line.text
      link.className = 'underline underline-offset-4 hover:text-[#8fa3ff]'
      if (line.external) Object.assign(link, { target: '_blank', rel: 'noopener' })
      row.append(link)
    }
    output.append(row)
  }

  const execute = (raw: string) => {
    const clean = raw.trim()
    print(`andres@portafolio:~$ ${clean}`, 'text-papel/60')
    if (!clean) return
    history.push(clean)
    cursor = history.length

    const phrase = normalize(clean)
    const [first, ...args] = phrase.split(/\s+/)
    // Primero la frase completa ("praise the sun"), luego la primera palabra ("abrir 2")
    const resolve = (key: string) => aliases[key] ?? (key in commands ? key : undefined)
    const name = resolve(phrase) ?? resolve(phrase.replace(/\s+/g, '-')) ?? resolve(first)
    const handler = name ? commands[name] : undefined
    const result = handler ? handler(args) : [t.unknown(first)]
    result?.forEach((line) => print(line))
    output.scrollTop = output.scrollHeight
  }

  const complete = () => {
    const value = normalize(input.value)
    if (!value) return
    const names = [...Object.keys(aliases), ...Object.keys(commands)].filter(
      (n) => !n.includes('-'),
    )
    const match = names.find((n) => n.startsWith(value))
    if (match) input.value = match
  }

  const open = () => {
    if (dialog.open) return
    dialog.showModal()
    if (!greeted) {
      print(t.welcome, 'text-papel/80')
      greeted = true
    }
    input.focus()
  }

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      execute(input.value)
      input.value = ''
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      cursor = Math.max(0, Math.min(history.length, cursor + (event.key === 'ArrowUp' ? -1 : 1)))
      input.value = history[cursor] ?? ''
    } else if (event.key === 'Tab') {
      event.preventDefault()
      complete()
    }
  })
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close()
  })
  document.addEventListener('terminal:open', open)
  document.addEventListener('keydown', (event) => {
    // ~ requiere AltGr en teclados en español: por eso también ` y º
    if (!['~', '`', 'º'].includes(event.key) || event.ctrlKey || event.metaKey) return
    const target = event.target as HTMLElement
    if (target.closest('input, textarea, [contenteditable="true"]')) return
    event.preventDefault()
    open()
  })
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}
