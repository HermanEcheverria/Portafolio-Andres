import { Color, PerspectiveCamera, Scene, WebGLRenderer } from 'three'

import { shared } from './material'
import { OBJECTS, type EngravedObject, type ObjectName } from './objects'

type View = {
  anchor: HTMLElement
  scene: Scene
  camera: PerspectiveCamera
  object: EngravedObject
  paper: Color
  light: { x: number; y: number; tx: number; ty: number }
  visible: boolean
}

type Options = { still: boolean; paper: Record<string, string>; ink: string; accent: string }

/**
 * Un solo WebGLRenderer y un solo canvas para todos los objetos de la página
 * (patrón webgl_multiple_elements de three.js): el canvas cubre la ventana y cada
 * vista se dibuja recortada (scissor) sobre su "ancla" en el documento. Así no se
 * agotan los contextos WebGL del navegador (unos 16; menos en celulares).
 */
export function start(anchors: HTMLElement[], options: Options) {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  // Detrás del contenido (z-index -1): las etiquetas y textos de las láminas quedan siempre
  // encima. Cada vista pinta su propio fondo de papel dentro de su recuadro.
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:-1'
  document.body.append(canvas)

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)
  shared.uInk.value.set(options.ink)
  shared.uAccent.value.set(options.accent)

  // Desde aquí el papel de cada ancla lo pinta el canvas de atrás
  anchors.forEach((anchor) => anchor.classList.remove('bg-papel-claro'))

  const views: View[] = anchors.map((anchor) => {
    const object = OBJECTS[anchor.dataset.engrave as ObjectName]()
    const scene = new Scene()
    scene.add(object.root)
    const camera = new PerspectiveCamera(30, 1, 0.1, 50)
    camera.position.set(0, 0.35, 6.2)
    camera.lookAt(0, 0.05, 0)
    return {
      anchor,
      scene,
      camera,
      object,
      paper: new Color(options.paper[anchor.dataset.paper ?? 'claro'] ?? options.paper.claro),
      light: { x: 0.3, y: 0.35, tx: 0.3, ty: 0.35 },
      visible: false,
    }
  })

  // Solo se dibuja lo que está cerca de la pantalla
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const view = views.find((v) => v.anchor === entry.target)
        if (view) view.visible = entry.isIntersecting
      }
      loop()
    },
    { rootMargin: '100px' },
  )
  views.forEach((view) => observer.observe(view.anchor))

  // La luz sigue al cursor, acotada para que lejos de un objeto no se vaya a un extremo
  const onPointerMove = (event: PointerEvent) => {
    for (const view of views) {
      if (!view.visible) continue
      const rect = view.anchor.getBoundingClientRect()
      view.light.tx = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1)
      view.light.ty = clamp(-(((event.clientY - rect.top) / rect.height) * 2 - 1))
    }
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })

  const startTime = performance.now()
  let frame = 0
  let running = false

  function render() {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (canvas.width !== Math.floor(width * renderer.getPixelRatio()))
      renderer.setSize(width, height, false)
    renderer.setScissorTest(false)
    renderer.clear()
    renderer.setScissorTest(true)

    const t = options.still ? 2 : (performance.now() - startTime) / 1000
    for (const view of views) {
      if (!view.visible) continue
      const rect = view.anchor.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > height || rect.right < 0 || rect.left > width) continue

      const light = view.light
      light.x += (light.tx - light.x) * 0.06
      light.y += (light.ty - light.y) * 0.06
      shared.uLight.value.set(light.x * 1.6 - 0.4, light.y * 1.3 + 0.7, 1.1)
      shared.uPaper.value.copy(view.paper)

      view.object.update(t)
      view.camera.aspect = rect.width / rect.height
      // En vistas angostas (celular) se aleja la cámara para que el objeto quepa
      view.camera.position.z = view.camera.aspect < 0.9 ? 7.4 : view.camera.aspect < 1.2 ? 5.4 : 6.2
      view.camera.updateProjectionMatrix()

      const bottom = height - rect.bottom
      renderer.setViewport(rect.left, bottom, rect.width, rect.height)
      renderer.setScissor(rect.left, bottom, rect.width, rect.height)
      renderer.setClearColor(view.paper, 1)
      renderer.clear()
      renderer.render(view.scene, view.camera)
      renderer.setClearColor(0x000000, 0)
    }
  }

  function loop() {
    const anyVisible = views.some((view) => view.visible)
    if (!anyVisible) {
      running = false
      cancelAnimationFrame(frame)
      renderer.setScissorTest(false)
      renderer.clear()
      return
    }
    if (running) return
    running = true
    const tick = () => {
      if (!running || document.hidden) {
        running = false
        return
      }
      render()
      frame = requestAnimationFrame(tick)
    }
    tick()
  }
  document.addEventListener('visibilitychange', () => !document.hidden && loop())

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault()
    running = false
    cancelAnimationFrame(frame)
    canvas.remove()
    anchors.forEach((anchor) => anchor.classList.add('rayado', 'bg-papel-claro'))
  })

  loop()
}

function clamp(value: number, limit = 1.2) {
  return Math.max(-limit, Math.min(limit, value))
}
