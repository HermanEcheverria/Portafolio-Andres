/**
 * Lenguaje de movimiento del sitio. Usar siempre estos valores para que todas
 * las animaciones se sientan parte de lo mismo.
 */
export const EASE = 'power3.out'
export const EASE_IN_OUT = 'power2.inOut'

export const DURATION = {
  fast: 0.35,
  base: 0.8,
  slow: 1.4,
} as const

export const STAGGER = 0.08

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
