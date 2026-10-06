import { gsap } from 'gsap'
import type Lenis from 'lenis'

import { introState } from '@/scripts/engraved-scene/intro-state'

/**
 * Intro "eclipse y revelado": la portada abre en negativo con el planeta a contraluz
 * en el centro; la luz gira al frente, un círculo de papel se abre desde el planeta
 * y el planeta viaja a su lugar. Solo corre si BaseLayout marcó <html data-intro>
 * (primera visita de la sesión, sin "reducir movimiento"). Se salta con cualquier
 * tecla, clic, rueda o toque.
 *
 * Agrega sus pasos a `timeline` y devuelve el segundo en que debe entrar el resto
 * de la portada (0 si no hay intro).
 */
export function addPlanetIntro(timeline: gsap.core.Timeline, lenis?: Lenis): number {
  const root = document.documentElement
  const veil = document.querySelector<HTMLElement>('[data-intro-veil]')
  const canvas = document.querySelector<HTMLCanvasElement>('canvas[data-intro]')
  const count = veil?.querySelector<HTMLElement>('[data-intro-count]')
  const hud = veil?.querySelector<HTMLElement>('.intro-hud')

  const end = () => {
    delete root.dataset.intro
    Object.assign(introState, { back: 0, wipe: 9 })
    if (canvas) gsap.set(canvas, { clearProps: 'transform,position,zIndex' })
    lenis?.start()
    for (const type of SKIP_EVENTS) window.removeEventListener(type, skip)
  }
  const skip = () => timeline.progress(1)

  // Sin WebGL (el planeta es un rayado de respaldo) no hay nada que revelar
  if (!('intro' in root.dataset) || !veil || !canvas || !hud || 'fallback' in canvas.dataset) {
    end()
    return 0
  }

  // El script tomó el control: ya no hace falta la salida de emergencia del CSS
  veil.style.animation = 'none'
  lenis?.stop()
  for (const type of SKIP_EVENTS) window.addEventListener(type, skip, { passive: true })

  const rect = canvas.getBoundingClientRect()
  const scale = Math.min(innerHeight * 0.82, innerWidth * 0.92) / rect.width
  const syncHole = () => {
    const radius = (introState.wipe * rect.width * Number(gsap.getProperty(canvas, 'scale'))) / 2
    veil.style.setProperty('--hole', `${radius}px`)
  }
  const progress = () => {
    if (count) count.textContent = String(Math.round((1 - introState.back) * 100)).padStart(3, '0')
  }

  Object.assign(introState, { back: 1, wipe: 0 })
  gsap.set(canvas, {
    x: innerWidth / 2 - (rect.left + rect.width / 2),
    y: innerHeight / 2 - (rect.top + rect.height / 2),
    scale,
    position: 'relative',
    zIndex: 61,
  })

  timeline
    .to(introState, { back: 0, duration: 1.1, ease: 'power2.inOut', onUpdate: progress }, 0.2)
    .to(introState, { wipe: 9, duration: 0.85, ease: 'power3.in', onUpdate: syncHole }, 0.6)
    .to(hud, { opacity: 0, duration: 0.25 }, 1.1)
    // El círculo termina de abrirse antes del viaje: desde ahí el papel del canvas es transparente
    .set(veil, { display: 'none' }, 1.45)
    .to(canvas, { x: 0, y: 0, scale: 1, duration: 0.85, ease: 'expo.inOut' }, 1.5)
    .call(end, undefined, 2.35)

  return 2
}

const SKIP_EVENTS = ['keydown', 'pointerdown', 'wheel', 'touchstart'] as const
