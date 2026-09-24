import type { Lang } from '@/i18n/ui'

/** Texto igual en ambos idiomas (p. ej. "PostgreSQL") o con traducción. */
export type Localizable = string | Record<Lang, string>

export function localize(value: Localizable, lang: Lang): string {
  return typeof value === 'string' ? value : value[lang]
}
