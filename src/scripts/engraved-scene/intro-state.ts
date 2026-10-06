/**
 * Valores de la intro del planeta que el shader lee en cada cuadro. Los anima
 * src/scripts/planet-intro.ts; en reposo la escena se ve normal.
 */
export const introState = {
  /** 1 = luz por detrás (contraluz); 0 = la luz sigue al cursor. */
  back: 0,
  /** Radio del círculo revelado; fuera de él la imagen sale en negativo. */
  wipe: 9,
}

export type IntroState = typeof introState
