import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { DURATION, EASE, STAGGER, prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin)

/** Tiempo que tarda un paquete en recorrer una conexión. */
const HOP = 0.9

/**
 * Diagramas de arquitectura ([data-diagram]):
 * - Al entrar en pantalla se dibujan las conexiones y aparecen las piezas.
 * - Luego recorren solos cada flujo, con un paquete cobalto que viaja por la ruta.
 * - Al elegir un recorrido se detiene el paseo automático y se repite solo ese.
 * Con "reducir movimiento" no hay animación: los botones solo resaltan la ruta.
 */
export function initDiagrams() {
  document.querySelectorAll<HTMLElement>('[data-diagram]').forEach(setupDiagram)
}

function setupDiagram(figure: HTMLElement) {
  const buttons = [...figure.querySelectorAll<HTMLButtonElement>('[data-flow]')]
  const caption = figure.querySelector<HTMLElement>('[data-flow-caption]')!
  const packet = figure.querySelector<SVGCircleElement>('[data-packet]')!
  const edges = new Map(
    [...figure.querySelectorAll<SVGGElement>('[data-edge]')].map((g) => [g.dataset.edge!, g]),
  )
  const nodes = new Map(
    [...figure.querySelectorAll<SVGGElement>('[data-node]')].map((g) => [g.dataset.node!, g]),
  )
  const flows = buttons.map((button) => (button.dataset.flowEdges ?? '').split(','))
  const reduced = prefersReducedMotion()

  let travel: gsap.core.Timeline | null = null
  let touring = !reduced
  let visible = false

  function highlight(index: number | null) {
    figure.querySelectorAll('.is-on').forEach((el) => el.classList.remove('is-on'))
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)))

    if (index === null) {
      delete figure.dataset.active
      caption.textContent = caption.dataset.hint ?? ''
      return
    }
    figure.dataset.active = ''
    caption.textContent = buttons[index].dataset.description ?? ''
    for (const id of flows[index]) {
      const edge = edges.get(id)
      if (!edge) continue
      edge.classList.add('is-on')
      nodes.get(edge.dataset.from!)?.classList.add('is-on')
      nodes.get(edge.dataset.to!)?.classList.add('is-on')
    }
  }

  /** El paquete recorre la ruta del flujo; `repeat` -1 lo repite sin fin. */
  function play(index: number, repeat: number, onComplete?: () => void) {
    travel?.kill()
    travel = null
    if (reduced) return

    travel = gsap.timeline({ repeat, repeatDelay: 0.4, onComplete })
    for (const id of flows[index]) {
      const path = edges.get(id)?.querySelector('path')
      if (!path) continue
      travel.set(packet, { opacity: 1 }).to(packet, {
        duration: HOP,
        ease: 'power1.inOut',
        motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
      })
    }
    travel.to(packet, { opacity: 0, duration: DURATION.fast })
    if (!visible) travel.pause()
  }

  /** Paseo automático: cada flujo dos veces y pasa al siguiente. */
  function tour(index: number) {
    if (!touring) return
    highlight(index)
    play(index, 1, () => tour((index + 1) % flows.length))
  }

  buttons.forEach((button, i) => {
    button.addEventListener('click', () => {
      touring = false
      const alreadyOn = button.getAttribute('aria-pressed') === 'true'
      if (alreadyOn) {
        travel?.kill()
        gsap.set(packet, { opacity: 0 })
        highlight(null)
        return
      }
      highlight(i)
      play(i, -1)
    })
  })

  if (reduced) return

  // Fuera de pantalla no se anima nada
  ScrollTrigger.create({
    trigger: figure,
    onToggle: (self) => {
      visible = self.isActive
      if (visible) travel?.resume()
      else travel?.pause()
    },
  })

  const lines = [...edges.values()].map((g) => g.querySelector('path'))
  const labels = [...edges.values()].map((g) => g.querySelector('text'))
  gsap
    .timeline({
      defaults: { ease: EASE },
      scrollTrigger: { trigger: figure, start: 'top 70%', once: true },
      onComplete: () => {
        // Se quitan los estilos de la intro: una opacidad en línea anularía el atenuado del CSS
        gsap.set([...nodes.values(), ...lines, ...labels], { clearProps: 'all' })
        figure.classList.add('is-ready')
        tour(0)
      },
    })
    .from([...nodes.values()], {
      autoAlpha: 0,
      y: 18,
      duration: DURATION.base,
      stagger: STAGGER,
    })
    .from(lines, { drawSVG: '0%', duration: DURATION.base, stagger: STAGGER / 2 }, '-=0.4')
    .from(labels, { autoAlpha: 0, duration: DURATION.fast, stagger: STAGGER / 2 }, '-=0.5')
}
