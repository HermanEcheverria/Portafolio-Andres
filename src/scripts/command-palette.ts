import type { PaletteCommand } from '@/lib/commands'

/**
 * Paleta de comandos (Ctrl+K / ⌘K). Usa <dialog> nativo: el navegador ya se
 * encarga de atrapar el foco, cerrar con Esc y bloquear el resto de la página.
 */
export function initCommandPalette() {
  const dialog = document.querySelector<HTMLDialogElement>('#paleta')
  const input = dialog?.querySelector<HTMLInputElement>('input')
  const list = dialog?.querySelector<HTMLUListElement>('[role="listbox"]')
  const status = dialog?.querySelector<HTMLElement>('[data-status]')
  const dataEl = document.querySelector<HTMLScriptElement>('#paleta-datos')
  if (!dialog || !input || !list || !status || !dataEl) return

  const commands: PaletteCommand[] = JSON.parse(dataEl.textContent ?? '[]')
  const email = dataEl.dataset.email ?? ''
  const texts = { empty: dataEl.dataset.empty ?? '', copied: dataEl.dataset.copied ?? '' }
  let visible: PaletteCommand[] = commands
  let active = 0

  const open = () => {
    input.value = ''
    status.textContent = ''
    status.hidden = true
    render()
    dialog.showModal()
    input.focus()
  }

  const render = () => {
    const words = normalize(input.value).split(/\s+/).filter(Boolean)
    visible = commands.filter((c) => {
      const haystack = normalize(`${c.label} ${c.group} ${c.keywords ?? ''}`)
      return words.every((w) => haystack.includes(w))
    })
    active = Math.min(active, Math.max(visible.length - 1, 0))
    list.replaceChildren()

    if (visible.length === 0) {
      const empty = document.createElement('li')
      empty.className = 'px-4 py-6 text-center font-mono text-sm text-grafito'
      empty.textContent = texts.empty
      list.append(empty)
      input.removeAttribute('aria-activedescendant')
      return
    }

    let group = ''
    visible.forEach((command, index) => {
      if (command.group !== group) {
        group = command.group
        const heading = document.createElement('li')
        heading.setAttribute('role', 'presentation')
        heading.className =
          'px-4 pt-3 pb-1 font-mono text-[11px] tracking-[0.2em] text-grafito uppercase'
        heading.textContent = group
        list.append(heading)
      }
      const option = document.createElement('li')
      option.id = `paleta-${command.id}`
      option.setAttribute('role', 'option')
      option.setAttribute('aria-selected', String(index === active))
      option.className =
        'mx-2 flex cursor-pointer items-center justify-between gap-4 px-3 py-2.5 aria-selected:bg-tinta aria-selected:text-papel'
      const label = document.createElement('span')
      label.textContent = command.label
      const hint = document.createElement('span')
      hint.className = 'font-mono text-xs opacity-60'
      hint.textContent = command.external ? '↗' : command.download ? '↓' : '↵'
      option.append(label, hint)
      option.addEventListener('pointermove', () => select(index))
      option.addEventListener('click', () => run(command))
      list.append(option)
    })
    input.setAttribute('aria-activedescendant', `paleta-${visible[active].id}`)
  }

  const select = (index: number) => {
    if (index === active) return
    active = index
    list.querySelectorAll('[role="option"]').forEach((el, i) => {
      el.setAttribute('aria-selected', String(i === active))
    })
    const current = list.querySelector(`#paleta-${CSS.escape(visible[active].id)}`)
    input.setAttribute('aria-activedescendant', current?.id ?? '')
    current?.scrollIntoView({ block: 'nearest' })
  }

  const run = async (command: PaletteCommand) => {
    if (command.action === 'copy-email') {
      await navigator.clipboard?.writeText(email).catch(() => {})
      status.textContent = texts.copied
      status.hidden = false
      setTimeout(() => dialog.close(), 900)
      return
    }
    dialog.close()
    if (command.action === 'open-terminal') {
      document.dispatchEvent(new CustomEvent('terminal:open'))
      return
    }
    if (!command.href) return
    if (command.external) {
      window.open(command.href, '_blank', 'noopener')
    } else if (command.download) {
      const link = Object.assign(document.createElement('a'), { href: command.href, download: '' })
      link.click()
    } else {
      window.location.href = command.href
    }
  }

  input.addEventListener('input', () => {
    active = 0
    render()
  })
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (visible.length === 0) return
      const step = event.key === 'ArrowDown' ? 1 : -1
      select((active + step + visible.length) % visible.length)
    } else if (event.key === 'Enter' && visible[active]) {
      event.preventDefault()
      run(visible[active])
    }
  })
  // Clic fuera de la caja (sobre el fondo) cierra
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close()
  })

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      if (dialog.open) dialog.close()
      else open()
    }
  })
  document.querySelectorAll('[data-open-palette]').forEach((button) => {
    button.addEventListener('click', open)
  })
}

/** "Láminas" → "laminas": buscar sin importar tildes ni mayúsculas. */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}
