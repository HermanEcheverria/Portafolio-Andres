#version 300 es
// Escenas 3D dibujadas como grabado.
// Se traza cada píxel con raymarching; el sombreado se convierte en líneas cuyo
// grosor depende de la luz, así la forma se lee solo con "tinta".
// Una sola técnica, varias escenas: el planeta del inicio y un objeto por lámina.
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse; // -1..1, posición suavizada del cursor (controla la luz)
uniform int uScene;  // 0 planeta · 1 diploma · 2 núcleo · 3 moneda · 4 taza · 5 eslabones
uniform vec3 uPaper;
uniform vec3 uInk;
uniform vec3 uAccent;

out vec4 fragColor;

const float PI = 3.14159265;

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0., -s, 0., 1., 0., s, 0., c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1., 0., 0., 0., c, s, 0., -s, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0., -s, c, 0., 0., 0., 1.); }

float sdTorus(vec3 p, float R, float r) { return length(vec2(length(p.xz) - R, p.y)) - r; }
// Cilindro con eje Y: radio r, media altura h
float sdCylinder(vec3 p, float r, float h) {
  vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);
  return min(max(d.x, d.y), 0.) + length(max(d, 0.));
}

// Material: 1 tinta (rayado por luz) · 2 línea cobalto · 3 cobalto con bandas
vec2 pick(vec2 a, float d, float m) { return d < a.x ? vec2(d, m) : a; }

// 0 · El planeta con su anillo y su luna (retrato del autor)
vec2 planet(vec3 p) {
  vec3 q = rotX(1.18) * rotY(uTime * .25) * p;
  vec2 hit = vec2(length(p) - 1., 1.);
  hit = pick(hit, sdTorus(q, 1.6, .028), 2.);
  float a = uTime * .7;
  return pick(hit, length(q - vec3(cos(a) * 1.6, 0., sin(a) * 1.6)) - .14, 3.);
}

// 1 · Un diploma enrollado con su cinta (gestión de becas)
vec2 diploma(vec3 p) {
  vec3 q = rotY(uTime * .3) * rotZ(.35) * p;
  vec3 c = rotZ(PI * .5) * q; // eje del rollo a lo largo de X
  vec2 hit = vec2(sdCylinder(c, .36, 1.2) - .02, 1.);
  // Cinta: un aro alrededor del centro del rollo, en el plano YZ
  vec3 r = rotZ(PI * .5) * q;
  return pick(hit, sdTorus(r, .4, .055), 3.);
}

// 2 · Un núcleo con agentes en órbita (Nexo)
vec2 nexus(vec3 p) {
  vec2 hit = vec2(length(p) - .55, 1.);
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    vec3 q = rotX(.9 + fi * .55) * rotZ(fi * 2.1) * rotY(uTime * (.35 + fi * .12)) * p;
    float R = 1.05 + fi * .22;
    hit = pick(hit, sdTorus(q, R, .018), 2.);
    float a = uTime * (.8 - fi * .15) + fi * 2.;
    hit = pick(hit, length(q - vec3(cos(a) * R, 0., sin(a) * R)) - .12, 3.);
  }
  return hit;
}

// 3 · Una moneda que gira de canto (Observatorio de USDC)
vec2 coin(vec3 p) {
  // Casi de frente y balanceándose: nunca queda de canto (se vería como una raya)
  vec3 q = rotX(PI * .5 - .25) * rotZ(sin(uTime * .6) * .9) * p;
  vec3 c = vec3(q.x, q.z, q.y);
  float ridges = .012 * smoothstep(.0, .3, cos(atan(c.z, c.x) * 80.)); // canto estriado
  vec2 hit = vec2(sdCylinder(c, 1. - ridges, .1) - .015, 1.);
  // Relieve en ambas caras: un aro cobalto
  vec3 face = vec3(c.x, abs(c.y) - .11, c.z);
  return pick(hit, sdTorus(face, .62, .035), 2.);
}

// 4 · Una taza de café sobre su plato (tienda en línea)
vec2 cup(vec3 p) {
  vec3 q = rotY(uTime * .35) * (p - vec3(0., .1, 0.));
  float body = sdCylinder(q - vec3(0., .1, 0.), .62, .52) - .04;
  body = max(body, -sdCylinder(q - vec3(0., .42, 0.), .54, .5)); // hueca por dentro
  vec2 hit = vec2(body, 1.);
  // Asa: medio aro a un costado
  vec3 h = q - vec3(.68, .12, 0.);
  float handle = sdTorus(vec3(h.x, h.z, h.y), .24, .055);
  handle = max(handle, -h.x); // solo la mitad de afuera
  hit = pick(hit, handle, 1.);
  // Plato
  return pick(hit, sdCylinder(q - vec3(0., -.5, 0.), 1.05, .03) - .02, 3.);
}

// 5 · Dos eslabones entrelazados (la invitación a trabajar juntos)
vec2 links(vec3 p) {
  vec3 q = rotY(sin(uTime * .4) * .6) * rotZ(.45) * rotX(1.2) * p;
  // Eslabón de tinta: aro grueso en el plano XZ, corrido a la izquierda
  vec2 hit = vec2(sdTorus(q + vec3(.5, 0., 0.), .78, .2), 1.);
  // Eslabón cobalto: perpendicular, corrido a la derecha, pasa por dentro del otro
  vec3 r = q - vec3(.5, 0., 0.);
  return pick(hit, sdTorus(vec3(r.x, r.z, r.y), .78, .2), 3.);
}

vec2 scene(vec3 p) {
  if (uScene == 5) return links(p);
  if (uScene == 1) return diploma(p);
  if (uScene == 2) return nexus(p);
  if (uScene == 3) return coin(p);
  if (uScene == 4) return cup(p);
  return planet(p);
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
  // Los objetos de las láminas no tienen órbita: se acercan para llenar el cuadro
  vec3 rd = normalize(vec3(uv * (uScene == 0 || uScene == 2 ? .45 : .33), -1.));

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
      vec3 rp = rotY(uTime * .12) * p; // las líneas giran con el objeto
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
