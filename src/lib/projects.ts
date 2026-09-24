import { getCollection, type CollectionEntry } from 'astro:content'

import type { Lang } from '@/i18n/ui'
import { localizedPath } from '@/i18n/utils'

export type Project = CollectionEntry<'projects'>

/** Proyectos de un idioma, en el orden en que se muestran. Los borradores solo en desarrollo. */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const entries = await getCollection(
    'projects',
    ({ id, data }) => id.startsWith(`${lang}/`) && (import.meta.env.DEV || !data.draft),
  )
  return entries.sort((a, b) => a.data.order - b.data.order)
}

/** "es/gestor-de-becas" → "gestor-de-becas": el mismo en ambos idiomas. */
export function projectSlug(project: Project): string {
  return project.id.slice(project.id.indexOf('/') + 1)
}

/** Ruta sin idioma, p. ej. "/proyectos/gestor-de-becas". */
export function projectPath(project: Project): string {
  return `/proyectos/${projectSlug(project)}`
}

export function projectUrl(project: Project, lang: Lang): string {
  return localizedPath(lang, projectPath(project))
}
