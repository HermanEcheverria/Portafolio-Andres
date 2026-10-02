import type { SceneId } from '@/scripts/engraved-scene'

/** Escena del shader para el emblema de cada proyecto (0 es el planeta del inicio). */
export const EMBLEM_SCENES = {
  diploma: 1,
  nucleo: 2,
  moneda: 3,
  taza: 4,
} as const satisfies Record<string, SceneId>
