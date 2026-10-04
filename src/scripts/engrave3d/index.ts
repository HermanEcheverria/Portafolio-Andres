import { prefersReducedMotion } from '@/lib/motion'

/**
 * Objetos 3D grabados: <div data-engrave="birrete|nexo|moneda|cafe" data-paper="claro|papel">.
 * three.js (~130 KB) se descarga solo cuando el primer objeto está por entrar en
 * pantalla, así no compite con el primer pintado de la página.
 * Sin WebGL o si algo falla, el ancla se queda con el rayado de papel.
 */
export function mountEngrave3d() {
  const anchors = [...document.querySelectorAll<HTMLElement>('[data-engrave]')]
  if (anchors.length === 0) return

  // Sin 3D: el ancla vuelve a tener su propio papel (con 3D, lo pinta el canvas de atrás)
  const fallback = () =>
    anchors.forEach((anchor) => anchor.classList.add('rayado', 'bg-papel-claro'))
  const probe = document.createElement('canvas')
  if (!probe.getContext('webgl2')) return fallback()

  const styles = getComputedStyle(document.documentElement)
  const color = (name: string) => styles.getPropertyValue(name).trim()

  const near = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      near.disconnect()
      import('./engine')
        .then(({ start }) =>
          start(anchors, {
            still: prefersReducedMotion(),
            paper: { claro: color('--color-papel-claro'), papel: color('--color-papel') },
            ink: color('--color-tinta'),
            accent: color('--color-cobalto'),
          }),
        )
        .catch((error) => {
          console.error(error)
          fallback()
        })
    },
    { rootMargin: '600px' },
  )
  anchors.forEach((anchor) => near.observe(anchor))
}
