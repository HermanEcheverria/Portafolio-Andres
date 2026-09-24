#version 300 es
// Escena 3D dibujada como grabado.
// Se traza cada píxel con raymarching; el sombreado se convierte en líneas cuyo
// grosor depende de la luz, así la forma se lee solo con "tinta".
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse; // -1..1, posición suavizada del cursor (controla la luz)
uniform vec3 uPaper;
uniform vec3 uInk;
uniform vec3 uAccent;

out vec4 fragColor;

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0., -s, 0., 1., 0., s, 0., c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1., 0., 0., 0., c, s, 0., -s, c); }
mat3 ringFrame() { return rotX(1.18) * rotY(uTime * .25); }

// x: distancia, y: material (1 esfera, 2 anillo, 3 luna)
vec2 scene(vec3 p) {
  float sphere = length(p) - 1.;
  vec3 q = ringFrame() * p;
  float ring = length(vec2(length(q.xz) - 1.6, q.y)) - .028;
  float a = uTime * .7;
  float moon = length(q - vec3(cos(a) * 1.6, 0., sin(a) * 1.6)) - .14;
  vec2 hit = vec2(sphere, 1.);
  if (ring < hit.x) hit = vec2(ring, 2.);
  if (moon < hit.x) hit = vec2(moon, 3.);
  return hit;
}

vec3 normalAt(vec3 p) {
  vec2 e = vec2(.001, 0.);
  return normalize(vec3(
    scene(p + e.xyy).x - scene(p - e.xyy).x,
    scene(p + e.yxy).x - scene(p - e.yxy).x,
    scene(p + e.yyx).x - scene(p - e.yyx).x));
}

// Rayado antialiasado: 1 sobre la línea, 0 en el papel. w = medio grosor (0..0.5)
float hatch(float x, float w) {
  if (w < .03) return 0.;
  float d = abs(fract(x) - .5);
  float aa = fwidth(x) * 1.2;
  return 1. - smoothstep(w - aa, w + aa, d);
}

float softShadow(vec3 p, vec3 n, vec3 l) {
  float t = .02;
  for (int i = 0; i < 32; i++) {
    float d = scene(p + n * .01 + l * t).x;
    if (d < .001) return 1.;
    t += max(d, .02);
    if (t > 4.) break;
  }
  return 0.;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2. - uRes) / uRes.y;
  // Cámara lejana con lente cerrado: toda la órbita cabe siempre en el cuadro
  // (máximo ~0.83 del borde, calculado para cualquier momento de la rotación)
  vec3 ro = vec3(0., .12, 5.2);
  vec3 rd = normalize(vec3(uv * .45, -1.));

  float t = 0.;
  float nearest = 1e3;
  vec2 hit = vec2(1e3, 0.);
  for (int i = 0; i < 90; i++) {
    hit = scene(ro + rd * t);
    nearest = min(nearest, hit.x);
    if (hit.x < .001 || t > 8.) break;
    t += hit.x;
  }

  vec3 light = normalize(vec3(uMouse.x * 1.6 - .4, uMouse.y * 1.3 + .7, 1.1));
  float ink = 0.;
  vec3 color = uInk;

  if (hit.x < .001) {
    vec3 p = ro + rd * t;
    vec3 n = normalAt(p);
    float lum = .12 + .88 * max(dot(n, light), 0.);
    lum *= 1. - .55 * softShadow(p, n, light);

    if (hit.y == 1.) {
      vec3 rp = rotY(uTime * .12) * p; // las líneas giran con la esfera
      float latitude = hatch(rp.y * 19., clamp((.97 - lum) * .52, 0., .48));
      float longitude = hatch(atan(rp.z, rp.x) * 3.8197 + rp.y * 1.5, clamp((.5 - lum) * .8, 0., .42));
      float cross = hatch((rp.x + rp.y + rp.z) * 16., clamp((.25 - lum) * 1.4, 0., .45));
      ink = max(max(latitude, longitude), cross);
    } else {
      color = uAccent;
      float band = hatch((p.x + p.y) * 20., clamp((.9 - lum) * .5, .08, .48));
      ink = hit.y == 2. ? 1. : max(band, .35);
    }
    float rim = 1. - smoothstep(.12, .22, dot(n, -rd)); // contorno
    ink = max(ink, rim);
  } else {
    // Sombra rayada en el piso; se desplaza un poco con la luz
    vec2 g = (uv - vec2(-.18 * uMouse.x, -.72)) * vec2(1.7, 7.);
    float e = length(g);
    ink = hatch(uv.y * 90., .45 * (1. - smoothstep(.55, .9, e))) * step(e, .95);
    if (nearest < .012) ink = 1.;
  }

  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  fragColor = vec4(mix(uPaper, color, ink * (.9 + .1 * grain)), 1.);
}
