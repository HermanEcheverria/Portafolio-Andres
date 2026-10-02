import { prefersReducedMotion } from '@/lib/motion'

import { mountEngravedScene, type SceneId } from './index'

/**
 * Monta todas las escenas grabadas de la página: <canvas data-engraved-scene="2">.
 * Con data-scroll-spin la escena gira un poco más al hacer scroll.
 * Sin WebGL 2, shader que no compila o contexto perdido: rayado en lugar de la escena.
 */
export function mountEngravedScenes() {
  const styles = getComputedStyle(document.documentElement)
  const color = (name: string) => styles.getPropertyValue(name).trim()
  const colors = {
    paper: color('--color-papel-claro'),
    ink: color('--color-tinta'),
    accent: color('--color-cobalto'),
  }

  document.querySelectorAll<HTMLCanvasElement>('canvas[data-engraved-scene]').forEach((canvas) => {
    const showFallback = () => {
      canvas.classList.add('rayado')
      canvas.dataset.fallback = ''
    }
    const scene = Number(canvas.dataset.engravedScene || 0) as SceneId
    const spin = 'scrollSpin' in canvas.dataset ? () => window.scrollY / 400 : undefined
    try {
      const unmount = mountEngravedScene(canvas, {
        scene,
        spin,
        still: prefersReducedMotion(),
        onContextLost: showFallback,
        colors:
          canvas.dataset.paper === 'papel' ? { ...colors, paper: color('--color-papel') } : colors,
      })
      if (!unmount) showFallback()
    } catch (error) {
      console.error(error)
      showFallback()
    }
  })
}
