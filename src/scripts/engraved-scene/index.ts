import fragmentSource from './engraving.frag.glsl?raw'

const vertexSource = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`

type SceneColors = { paper: string; ink: string; accent: string }

type SceneOptions = {
  colors: SceneColors
  /** Sin animación: dibuja un solo cuadro (usuarios con "reducir movimiento"). */
  still?: boolean
  /** Se llama si el navegador descarta el contexto WebGL (frecuente en celulares). */
  onContextLost?: () => void
}

/**
 * Monta la escena en un <canvas> y devuelve una función para desmontarla.
 * Devuelve null si el navegador no tiene WebGL 2 y lanza un error si el shader no
 * compila: en ambos casos quien la llama muestra el respaldo.
 */
export function mountEngravedScene(canvas: HTMLCanvasElement, options: SceneOptions) {
  const gl = canvas.getContext('webgl2', { antialias: true, powerPreference: 'low-power' })
  if (!gl) return null

  const program = createProgram(gl, vertexSource, fragmentSource)
  gl.useProgram(program)

  // Un triángulo que cubre toda la pantalla: más barato que dos triángulos
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const uniform = (name: string) => gl.getUniformLocation(program, name)
  const uRes = uniform('uRes')
  const uTime = uniform('uTime')
  const uMouse = uniform('uMouse')
  gl.uniform3fv(uniform('uPaper'), hexToRgb(options.colors.paper))
  gl.uniform3fv(uniform('uInk'), hexToRgb(options.colors.ink))
  gl.uniform3fv(uniform('uAccent'), hexToRgb(options.colors.accent))

  // Cambiar el tamaño del canvas borra lo dibujado: en modo quieto hay que redibujar
  let ready = false
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const { width, height } = canvas.getBoundingClientRect()
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform2f(uRes, canvas.width, canvas.height)
    if (ready && options.still) draw(2)
  }
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  resize()

  // La luz sigue al cursor con suavizado; en reposo vuelve a su posición inicial
  const rest = { x: 0.3, y: 0.35 }
  const target = { ...rest }
  const mouse = { ...rest }
  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    target.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
  }
  const onPointerLeave = () => Object.assign(target, rest)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerleave', onPointerLeave)

  // No gastar batería cuando la escena no está en pantalla
  let visible = true
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible && !options.still) loop()
  })
  visibility.observe(canvas)

  const start = performance.now()
  let frame = 0
  const draw = (time: number) => {
    mouse.x += (target.x - mouse.x) * 0.06
    mouse.y += (target.y - mouse.y) * 0.06
    gl.uniform1f(uTime, time)
    gl.uniform2f(uMouse, mouse.x, mouse.y)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
  const loop = () => {
    cancelAnimationFrame(frame)
    const tick = () => {
      if (!visible) return
      draw((performance.now() - start) / 1000)
      frame = requestAnimationFrame(tick)
    }
    tick()
  }

  const onContextLost = (event: Event) => {
    event.preventDefault()
    cancelAnimationFrame(frame)
    options.onContextLost?.()
  }
  canvas.addEventListener('webglcontextlost', onContextLost)

  ready = true
  if (options.still) draw(2)
  else loop()

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    visibility.disconnect()
    window.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerleave', onPointerLeave)
    canvas.removeEventListener('webglcontextlost', onContextLost)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}

function createProgram(gl: WebGL2RenderingContext, vertex: string, fragment: string) {
  const program = gl.createProgram()
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const) {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`Shader: ${gl.getShaderInfoLog(shader)}`)
    }
    gl.attachShader(program, shader)
  }
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Programa: ${gl.getProgramInfoLog(program)}`)
  }
  return program
}

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.replace('#', ''), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}
