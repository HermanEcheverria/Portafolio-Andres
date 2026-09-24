# andresecheverria.com

Portafolio de Andrés Echeverría. El diseño parte de una idea: **software hecho con el detalle
de un grabado**. La portada muestra una escena 3D renderizada en tiempo real como si fuera un
grabado en tinta; la luz sigue al cursor.

## Tecnologías

| Área      | Herramienta                                                                                 |
| --------- | ------------------------------------------------------------------------------------------- |
| Sitio     | [Astro 7](https://astro.build), estático, en español e inglés                               |
| Estilos   | Tailwind CSS v4 con un sistema de diseño propio (papel, tinta y cobalto)                    |
| 3D        | WebGL 2 sin librerías: un _shader_ de raymarching que convierte la luz en líneas de grabado |
| Animación | GSAP (SplitText, ScrollTrigger, DrawSVG) y Lenis para el scroll suave                       |
| Contenido | Colecciones de contenido de Astro: cada proyecto es un Markdown validado con Zod            |

## Cómo está hecho

- **La escena 3D** (`src/scripts/engraved-scene/`) dibuja una esfera, un anillo y una luna con
  raymarching. El grosor de cada línea depende de la iluminación, así que la forma se lee solo
  con tinta. Se pausa cuando no está en pantalla y respeta "reducir movimiento".
- **Las animaciones** (`src/scripts/motion.ts`) se activan con atributos `data-*` y comparten los
  mismos tiempos y curvas (`src/lib/motion.ts`).
- **Los textos** están en `src/i18n/ui.ts`; los proyectos, en `src/content/projects/<idioma>/`.

## Desarrollo

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm check        # tipos y diagnósticos de Astro
pnpm build        # sitio estático en dist/
pnpm format       # Prettier
```
