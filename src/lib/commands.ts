import { experience } from '@/data/experience'
import { localize } from '@/data/localized'
import { profile } from '@/data/profile'
import { skillGroups } from '@/data/skills'
import type { Lang } from '@/i18n/ui'
import { localizedPath, useTranslations } from '@/i18n/utils'
import { getProjects, projectUrl } from '@/lib/projects'

/**
 * Datos de la paleta de comandos y de la terminal. Se arman en el servidor con los
 * mismos datos del sitio y viajan al navegador como JSON (sin React ni fetch).
 */
export type PaletteAction = 'copy-email' | 'open-terminal'

export type PaletteCommand = {
  id: string
  group: string
  label: string
  /** Palabras extra para la búsqueda (sin mostrar). */
  keywords?: string
  href?: string
  external?: boolean
  download?: boolean
  action?: PaletteAction
}

export type TerminalData = {
  lang: Lang
  name: string
  title: string
  email: string
  links: { label: string; href: string }[]
  projects: { title: string; year: number; href: string }[]
  experience: string[]
  skills: string[]
  cv: { page: string; pdf: string }
  otherLang: { code: Lang; href: string }
}

export async function buildCommands(lang: Lang, path: string): Promise<PaletteCommand[]> {
  const t = useTranslations(lang)
  const home = localizedPath(lang)
  const other: Lang = lang === 'es' ? 'en' : 'es'
  const projects = await getProjects(lang)

  return [
    {
      id: 'nav-projects',
      group: t('cmd.group.navigate'),
      label: t('nav.projects'),
      href: `${home}#laminas`,
    },
    {
      id: 'nav-experience',
      group: t('cmd.group.navigate'),
      label: t('nav.experience'),
      href: `${home}#experiencia`,
    },
    {
      id: 'nav-about',
      group: t('cmd.group.navigate'),
      label: t('nav.about'),
      href: `${home}#sobre-mi`,
    },
    {
      id: 'nav-contact',
      group: t('cmd.group.navigate'),
      label: t('nav.contact'),
      href: `${home}#contacto`,
    },
    ...projects.map((project) => ({
      id: `project-${project.id}`,
      group: t('cmd.group.projects'),
      label: project.data.title,
      keywords: project.data.stack.join(' '),
      href: projectUrl(project, lang),
    })),
    {
      id: 'cv-view',
      group: t('cmd.group.cv'),
      label: t('cmd.cv.view'),
      keywords: 'resume curriculum',
      href: localizedPath(lang, '/cv'),
    },
    {
      id: 'cv-download',
      group: t('cmd.group.cv'),
      label: t('cmd.cv.download'),
      keywords: 'pdf resume curriculum',
      href: lang === 'es' ? '/cv.pdf' : '/cv-en.pdf',
      download: true,
    },
    {
      id: 'copy-email',
      group: t('cmd.group.contact'),
      label: t('cmd.email'),
      keywords: profile.email,
      action: 'copy-email',
    },
    {
      id: 'github',
      group: t('cmd.group.contact'),
      label: 'GitHub',
      href: profile.links.github,
      external: true,
    },
    ...(profile.links.linkedin
      ? [
          {
            id: 'linkedin',
            group: t('cmd.group.contact'),
            label: 'LinkedIn',
            href: profile.links.linkedin,
            external: true,
          },
        ]
      : []),
    {
      id: 'lang',
      group: t('cmd.group.preferences'),
      label: t('cmd.lang'),
      keywords: 'idioma language english español',
      href: localizedPath(other, path),
    },
    {
      id: 'terminal',
      group: t('cmd.group.preferences'),
      label: t('cmd.terminal'),
      keywords: 'terminal consola shell',
      action: 'open-terminal',
    },
  ]
}

export async function buildTerminalData(lang: Lang, path: string): Promise<TerminalData> {
  const projects = await getProjects(lang)
  const other: Lang = lang === 'es' ? 'en' : 'es'
  return {
    lang,
    name: profile.name,
    title: localize(profile.title, lang),
    email: profile.email,
    links: [
      { label: 'GitHub', href: profile.links.github },
      ...(profile.links.linkedin ? [{ label: 'LinkedIn', href: profile.links.linkedin }] : []),
      { label: 'Web', href: profile.website },
    ],
    projects: projects.map((p) => ({
      title: p.data.title,
      year: p.data.year,
      href: projectUrl(p, lang),
    })),
    experience: experience.map(
      (e) => `${localize(e.period, lang).padEnd(22)} ${localize(e.role, lang)} · ${e.organization}`,
    ),
    skills: skillGroups.map(
      (g) =>
        `${localize(g.title, lang).padEnd(34)} ${g.items.map((i) => localize(i, lang)).join(', ')}`,
    ),
    cv: { page: localizedPath(lang, '/cv'), pdf: lang === 'es' ? '/cv.pdf' : '/cv-en.pdf' },
    otherLang: { code: other, href: localizedPath(other, path) },
  }
}
