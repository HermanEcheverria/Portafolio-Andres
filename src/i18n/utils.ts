import { defaultLang, ui, type Lang, type UIKey } from './ui'

export function getLang(currentLocale: string | undefined): Lang {
  return currentLocale === 'en' ? 'en' : defaultLang
}

export function useTranslations(lang: Lang) {
  return (key: UIKey): string => ui[lang][key]
}

/** Ruta equivalente en el otro idioma: "/" ↔ "/en", "/#x" ↔ "/en#x". */
export function localizedPath(lang: Lang, path = '/'): string {
  if (lang === defaultLang) return path
  return path === '/' ? `/${lang}` : `/${lang}${path}`
}

export function toRoman(n: number): string {
  const map: [number, string][] = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let out = ''
  for (const [value, numeral] of map) {
    while (n >= value) {
      out += numeral
      n -= value
    }
  }
  return out
}
