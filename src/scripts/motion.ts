import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

import { DURATION, EASE, STAGGER, prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin)

/**
 * Animaciones del sitio. Todo se engancha a atributos data-* en el HTML:
 * - data-split: el título entra letra por letra.
 * - data-reveal: aparece al cargar, en orden.
 * - data-reveal-scroll: aparece al entrar en pantalla.
 * - data-wave: línea SVG que se dibuja con el scroll.
 * - data-tilt: tarjeta que se inclina en 3D siguiendo al cursor.
 * Con "reducir movimiento" no se anima nada y el contenido queda visible.
 */
export function initMotion() {
  if (prefersReducedMotion()) return

  initSmoothScroll()
  animateIntro()
  animateOnScroll()
  animateWaves()
  initTilt()
}

function initSmoothScroll() {
  const lenis = new Lenis({ lerp: 0.1 })
  // Lenis y ScrollTrigger comparten el mismo reloj para no desincronizarse
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = link.getAttribute('href')
      if (!target || target === '#' || !document.querySelector(target)) return
      event.preventDefault()
      lenis.scrollTo(target, { offset: -24 })
    })
  })
}

function animateIntro() {
  const timeline = gsap.timeline({ defaults: { ease: EASE, duration: DURATION.base } })

  document.querySelectorAll<HTMLElement>('[data-split]').forEach((title) => {
    const split = SplitText.create(title, { type: 'chars', mask: 'chars' })
    timeline.from(split.chars, { yPercent: 110, duration: DURATION.slow, stagger: 0.035 }, 0)
  })

  timeline.from('[data-reveal]', { y: 24, autoAlpha: 0, stagger: STAGGER }, 0.35)
}

function animateOnScroll() {
  gsap.utils.toArray<HTMLElement>('[data-reveal-scroll]').forEach((element, i) => {
    gsap.from(element, {
      y: 48,
      autoAlpha: 0,
      duration: DURATION.base,
      ease: EASE,
      delay: (i % 3) * STAGGER,
      scrollTrigger: { trigger: element, start: 'top 85%', once: true },
    })
  })
}

function animateWaves() {
  const waves = gsap.utils.toArray<SVGPathElement>('[data-wave]')
  if (waves.length === 0) return
  gsap.from(waves, {
    drawSVG: '0%',
    ease: 'none',
    stagger: 0.08,
    scrollTrigger: { trigger: waves[0], start: 'top 95%', end: 'bottom 40%', scrub: 1 },
  })
}

function initTilt() {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!canHover) return

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    gsap.set(card, { transformPerspective: 1000 })
    const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: EASE })
    const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: EASE })

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      rotateX(-y * 12)
      rotateY(x * 14)
      // La sombra impresa se aleja del lado hacia el que se inclina la tarjeta
      gsap.to(card, {
        boxShadow: `${-x * 22 + 8}px ${-y * 22 + 10}px 0 var(--color-tinta)`,
        duration: 0.4,
        overwrite: 'auto',
      })
    })
    card.addEventListener('pointerleave', () => {
      rotateX(0)
      rotateY(0)
      gsap.to(card, { boxShadow: '0px 0px 0 var(--color-tinta)', duration: 0.5, ease: EASE })
    })
  })
}
