import { BackSide, Color, ShaderMaterial, Vector3 } from 'three'

/**
 * Material de grabado: la luz se convierte en líneas de tinta.
 * - Líneas horizontales cuyo grosor crece en la sombra; diagonales cruzadas en lo más oscuro.
 * - Las líneas van en coordenadas del mundo: siguen horizontales aunque el objeto gire,
 *   como en un grabado. `fwidth` las antialiasa a cualquier densidad de pantalla.
 * Mismo lenguaje visual que el shader del planeta (src/scripts/engraved-scene).
 */

/** Uniformes compartidos por todos los materiales: cambian por vista, no por objeto. */
export const shared = {
  uLight: { value: new Vector3(0.3, 0.9, 1.1) },
  uPaper: { value: new Color('#f4f0e7') },
  uInk: { value: new Color('#161514') },
  uAccent: { value: new Color('#2743d6') },
}

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec3 vView;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec4 view = viewMatrix * world;
    vWorld = world.xyz;
    vView = view.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * view;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uLight;
  uniform vec3 uPaper;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform float uAccentMix; // 0 tinta, 1 cobalto
  uniform float uSolid;     // piso de tinta: 0 solo rayado, 1 relleno
  uniform float uFreq;      // líneas por unidad del mundo
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec3 vView;

  // 1 sobre la línea, 0 en el papel. w = medio grosor (0..0.5)
  float hatch(float x, float w) {
    if (w < 0.03) return 0.0;
    float d = abs(fract(x) - 0.5);
    float aa = fwidth(x) * 1.2;
    return 1.0 - smoothstep(w - aa, w + aa, d);
  }

  void main() {
    vec3 n = normalize(vNormal);
    if (!gl_FrontFacing) n = -n;
    // Tope 0.86: hasta lo más iluminado lleva líneas finas, como en un grabado
    float lum = 0.14 + 0.72 * max(dot(n, normalize(uLight)), 0.0);
    float lines = hatch(vWorld.y * uFreq, clamp((0.97 - lum) * 0.52, 0.0, 0.48));
    float cross1 = hatch((vWorld.x + vWorld.y) * uFreq * 0.8, clamp((0.45 - lum) * 0.9, 0.0, 0.42));
    float cross2 = hatch((vWorld.x - vWorld.y) * uFreq * 0.8, clamp((0.22 - lum) * 1.4, 0.0, 0.45));
    float ink = max(max(lines, cross1), max(cross2, uSolid));
    // Contorno: donde la superficie se pone de canto respecto a la cámara
    float rim = 1.0 - smoothstep(0.08, 0.2, abs(dot(n, normalize(-vView))));
    ink = max(ink, rim);
    vec3 color = mix(uInk, uAccent, uAccentMix);
    gl_FragColor = vec4(mix(uPaper, color, ink), 1.0);
  }
`

type Options = { accent?: boolean; solid?: number; freq?: number }

export function engraved({ accent = false, solid = accent ? 0.35 : 0, freq = 16 }: Options = {}) {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      ...shared,
      uAccentMix: { value: accent ? 1 : 0 },
      uSolid: { value: solid },
      uFreq: { value: freq },
    },
  })
}

/**
 * Contorno de tinta por "casco invertido": la misma malla, inflada por la normal y
 * dibujada por dentro. Barato y no necesita posproceso (funciona con varias vistas).
 */
export function outline(thickness = 0.022) {
  return new ShaderMaterial({
    side: BackSide,
    uniforms: { uInk: shared.uInk, uThick: { value: thickness } },
    vertexShader: /* glsl */ `
      uniform float uThick;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * uThick, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uInk;
      void main() { gl_FragColor = vec4(uInk, 1.0); }
    `,
  })
}

/** Sombra rayada en el piso, como en el planeta: una elipse de líneas que se desvanece. */
export function floorShadow() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uInk: shared.uInk },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorld;
      void main() {
        vUv = uv;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uInk;
      varying vec2 vUv;
      varying vec3 vWorld;
      void main() {
        float e = length((vUv - 0.5) * 2.0);
        float x = vWorld.z * 46.0;
        float w = 0.45 * (1.0 - smoothstep(0.35, 1.0, e));
        float d = abs(fract(x) - 0.5);
        float aa = fwidth(x) * 1.2;
        float ink = w < 0.03 ? 0.0 : 1.0 - smoothstep(w - aa, w + aa, d);
        gl_FragColor = vec4(uInk, ink * step(e, 1.0));
      }
    `,
  })
}
