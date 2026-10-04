import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  LatheGeometry,
  Mesh,
  OctahedronGeometry,
  PlaneGeometry,
  Shape,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  type Material,
} from 'three'

import { engraved, floorShadow, outline } from './material'

/**
 * Los objetos de cada lámina, construidos con geometría (sin archivos de modelo):
 * cero peticiones extra y control total del estilo. Cada uno devuelve su grupo y
 * una función que lo anima con el tiempo en segundos.
 */
export type EngravedObject = { root: Group; update: (t: number) => void }

const ink = () => engraved()
const accent = (solid = 0.35) => engraved({ accent: true, solid })

/** Una malla con su contorno de tinta. */
function part(geometry: BufferGeometry, material: Material, thickness = 0.02) {
  const group = new Group()
  group.add(new Mesh(geometry, material))
  if (thickness > 0) group.add(new Mesh(geometry, outline(thickness)))
  return group
}

function withShadow(object: Group, y: number, width = 2.2) {
  const shadow = new Mesh(new PlaneGeometry(width, width * 0.32), floorShadow())
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = y
  const root = new Group()
  root.add(object, shadow)
  return root
}

const v = (x: number, y: number, z = 0) => new Vector3(x, y, z)

/** I · Birrete con su borla: la beca, el estudio, la graduación. */
export function birrete(): EngravedObject {
  const cap = new Group()
  cap.add(part(new CylinderGeometry(0.62, 0.7, 0.5, 48), ink()))
  cap.children[0].position.y = -0.18

  const board = part(new BoxGeometry(1.9, 0.07, 1.9), ink(), 0.018)
  board.position.y = 0.1
  board.rotation.y = Math.PI / 4
  cap.add(board)

  const button = part(new CylinderGeometry(0.09, 0.09, 0.05, 20), accent(1), 0.012)
  button.position.y = 0.16
  cap.add(button)

  // La borla: el cordón va del botón a una esquina del tablero y cae
  const tassel = new Group()
  const corner = 0.95 * Math.SQRT2
  const cord = new CatmullRomCurve3([
    v(0, 0.17, 0),
    v(corner * 0.55, 0.16, 0),
    v(corner, 0.13, 0),
    v(corner + 0.03, -0.2, 0),
    v(corner + 0.04, -0.5, 0),
  ])
  tassel.add(part(new TubeGeometry(cord, 48, 0.022, 8), accent(1), 0))
  const end = part(new ConeGeometry(0.09, 0.32, 16), accent(), 0.012)
  end.position.set(corner + 0.04, -0.62, 0)
  tassel.add(end)
  cap.add(tassel)

  cap.rotation.x = 0.42
  const root = withShadow(cap, -0.95)
  return {
    root,
    update: (t) => {
      cap.rotation.y = t * 0.35
      tassel.rotation.x = Math.sin(t * 1.6) * 0.05
    },
  }
}

/** II · El logo de Nexo en relieve: la placa, los arcos, el núcleo y sus agentes. */
export function nexo(): EngravedObject {
  const logo = new Group()

  const size = 2
  const r = 0.36
  const h = size / 2
  const plate = new Shape()
  plate.moveTo(-h + r, -h)
  plate.lineTo(h - r, -h)
  plate.quadraticCurveTo(h, -h, h, -h + r)
  plate.lineTo(h, h - r)
  plate.quadraticCurveTo(h, h, h - r, h)
  plate.lineTo(-h + r, h)
  plate.quadraticCurveTo(-h, h, -h, h - r)
  plate.lineTo(-h, -h + r)
  plate.quadraticCurveTo(-h, -h, -h + r, -h)
  const plateGeometry = new ExtrudeGeometry(plate, {
    depth: 0.22,
    bevelEnabled: true,
    bevelSize: 0.04,
    bevelThickness: 0.04,
    bevelSegments: 3,
  })
  plateGeometry.translate(0, 0, -0.22)
  logo.add(part(plateGeometry, ink(), 0.02))

  // Coordenadas del SVG del logo (1024 × 1024) llevadas a la placa
  const at = (x: number, y: number) => v((x - 512) / 420, (512 - y) / 420, 0.1)

  const arcs = new Group()
  for (const radius of [330, 240]) {
    const arc = part(new TorusGeometry(radius / 420, 0.045, 12, 64, Math.PI), ink(), 0)
    arc.position.copy(at(487, 500))
    arcs.add(arc)
  }
  logo.add(arcs)

  const core = part(new SphereGeometry(0.17, 32, 16), accent(), 0.014)
  core.position.copy(at(487, 500))
  logo.add(core)

  // Los agentes: cuadrado, rombo, punto, guion y círculo, como en el logo
  const agents: Group[] = [
    part(new BoxGeometry(0.17, 0.17, 0.08), ink(), 0.012),
    part(new OctahedronGeometry(0.11), ink(), 0.012),
    part(new SphereGeometry(0.05, 16, 8), ink(), 0),
    part(new BoxGeometry(0.16, 0.035, 0.05), ink(), 0),
    part(new TorusGeometry(0.09, 0.025, 8, 24), ink(), 0),
  ]
  const spots = [at(218, 596), at(318, 728), at(487, 790), at(660, 742), at(760, 596)]
  agents.forEach((agent, i) => {
    agent.position.copy(spots[i])
    logo.add(agent)
  })

  const root = withShadow(logo, -1.3, 2.6)
  return {
    root,
    update: (t) => {
      logo.rotation.y = Math.sin(t * 0.5) * 0.55
      logo.rotation.x = -0.15 + Math.sin(t * 0.4) * 0.08
      core.scale.setScalar(1 + Math.sin(t * 2) * 0.08)
      // Los agentes se encienden por turnos, como en la animación del logo
      agents.forEach((agent, i) => {
        const phase = (t * 0.8 - i * 0.4) % 2
        agent.scale.setScalar(phase > 0 && phase < 0.4 ? 1.35 : 1)
      })
    },
  }
}

/** III · Una moneda con "$" y un gráfico que se mueve: el dólar digital en vivo. */
export function moneda(): EngravedObject {
  const scene = new Group()

  const coin = new Group()
  // De abajo hacia arriba: el sentido del perfil decide hacia dónde miran las caras
  const profile = [
    [0, -0.12],
    [0.84, -0.12],
    [0.92, -0.09],
    [0.95, -0.04],
    [0.95, 0.04],
    [0.92, 0.09],
    [0.84, 0.12],
    [0, 0.12],
  ].map(([x, y]) => new Vector2(x, y))
  const body = part(new LatheGeometry(profile, 64), ink(), 0.018)
  body.rotation.x = Math.PI / 2
  coin.add(body)

  for (const side of [1, -1]) {
    const ring = part(new TorusGeometry(0.68, 0.03, 10, 64), accent(1), 0)
    ring.position.z = 0.12 * side
    coin.add(ring)
    // El "$": una S hecha con un tubo y la barra que la cruza
    const s = new CatmullRomCurve3([
      v(0.2, 0.27),
      v(0.02, 0.36),
      v(-0.2, 0.27),
      v(-0.18, 0.08),
      v(0, 0.01),
      v(0.19, -0.07),
      v(0.21, -0.27),
      v(0, -0.36),
      v(-0.21, -0.27),
    ])
    const dollar = new Group()
    dollar.add(part(new TubeGeometry(s, 64, 0.045, 10), accent(1), 0))
    const bar = part(new CylinderGeometry(0.03, 0.03, 0.92, 10), accent(1), 0)
    dollar.add(bar)
    dollar.position.z = 0.13 * side
    if (side < 0) dollar.rotation.y = Math.PI
    coin.add(dollar)
  }
  coin.position.set(-0.75, 0.1, 0)
  scene.add(coin)

  // El gráfico en vivo: barras que suben y bajan
  const bars: Group[] = []
  for (let i = 0; i < 5; i++) {
    const bar = part(new BoxGeometry(0.18, 1, 0.18), i === 4 ? accent() : ink(), 0.012)
    bar.position.set(0.45 + i * 0.27, 0, 0)
    bars.push(bar)
    scene.add(bar)
  }

  const root = withShadow(scene, -0.95, 2.8)
  return {
    root,
    update: (t) => {
      coin.rotation.y = Math.sin(t * 0.6) * 0.8
      coin.rotation.x = -0.12
      bars.forEach((bar, i) => {
        const height = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.1 + i * 0.9))
        bar.scale.y = height
        bar.position.y = -0.95 + height / 2
      })
      scene.rotation.y = Math.sin(t * 0.3) * 0.2
    },
  }
}

/** IV · Una taza de café humeante sobre su plato, con un par de granos. */
export function cafe(): EngravedObject {
  const cup = new Group()

  const wall = [
    [0, -0.45],
    [0.46, -0.45],
    [0.54, -0.38],
    [0.6, 0.36],
    [0.63, 0.43],
    [0.57, 0.43],
    [0.53, -0.3],
    [0, -0.34],
  ].map(([x, y]) => new Vector2(x, y))
  cup.add(part(new LatheGeometry(wall, 64), ink(), 0.018))

  const coffee = part(new CircleGeometry(0.54, 48), engraved({ solid: 0.8 }), 0)
  coffee.rotation.x = -Math.PI / 2
  coffee.position.y = 0.3
  cup.add(coffee)

  const handle = part(new TorusGeometry(0.2, 0.055, 12, 32, Math.PI), ink(), 0.014)
  handle.rotation.z = -Math.PI / 2
  handle.position.set(0.6, 0.02, 0)
  cup.add(handle)

  const plate = [
    [0, -0.5],
    [0.95, -0.49],
    [1.07, -0.41],
    [1.02, -0.39],
    [0.55, -0.45],
    [0, -0.45],
  ].map(([x, y]) => new Vector2(x, y))
  cup.add(part(new LatheGeometry(plate, 64), accent(), 0.014))

  for (const [x, z, a] of [
    [-0.78, 0.25, 0.4],
    [-0.62, 0.5, -0.6],
  ]) {
    const bean = part(new SphereGeometry(0.09, 16, 12), ink(), 0.01)
    bean.scale.set(1, 0.6, 1.45)
    bean.position.set(x, -0.42, z)
    bean.rotation.y = a
    cup.add(bean)
  }

  // El vapor: tres hilos que suben ondulando
  const steam = new Group()
  for (let i = 0; i < 3; i++) {
    const x = (i - 1) * 0.2
    const curve = new CatmullRomCurve3(
      [0, 1, 2, 3, 4].map((k) =>
        v(x + Math.sin(k * 1.4 + i) * 0.07, 0.52 + k * 0.2, (i - 1) * 0.05),
      ),
    )
    steam.add(part(new TubeGeometry(curve, 40, 0.018, 6), ink(), 0))
  }
  // El vapor no gira con la taza: así sus hilos siempre se ven separados
  const scene = new Group()
  scene.add(cup, steam)
  scene.rotation.x = 0.3
  const root = withShadow(scene, -0.75, 2.4)
  return {
    root,
    update: (t) => {
      cup.rotation.y = t * 0.35
      steam.children.forEach((thread, i) => {
        thread.position.y = ((t * 0.12 + i * 0.07) % 0.18) - 0.05
        thread.position.x = Math.sin(t * 0.9 + i * 2) * 0.04
      })
    },
  }
}

/** Una hoguera con su espada en espiral: el descanso de los juegos de FromSoftware. */
export function hoguera(): EngravedObject {
  const fire = new Group()

  // Piedras alrededor y troncos apoyados hacia el centro
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const stone = part(new SphereGeometry(0.16, 14, 10), ink(), 0.012)
    stone.scale.set(1.2, 0.6, 1)
    stone.position.set(Math.cos(a) * 0.72, -0.62, Math.sin(a) * 0.72)
    stone.rotation.y = a
    fire.add(stone)
  }
  // Troncos en tienda: cada uno va de un punto del suelo hacia la punta, sobre el centro
  const apex = v(0, -0.05, 0)
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.3
    const base = v(Math.cos(a) * 0.55, -0.62, Math.sin(a) * 0.55)
    const direction = apex.clone().sub(base)
    const log = part(new CylinderGeometry(0.07, 0.08, direction.length(), 12), ink(), 0.012)
    log.position.copy(base.clone().add(apex).multiplyScalar(0.5))
    log.quaternion.setFromUnitVectors(v(0, 1, 0), direction.normalize())
    fire.add(log)
  }

  // Las llamas, en cobalto: tres lenguas que titilan
  const flames: Group[] = []
  for (let i = 0; i < 3; i++) {
    // Perfil de llama: ancha abajo y terminada en punta
    const profile = [
      [0, 0],
      [0.12, 0.05],
      [0.17, 0.18],
      [0.14, 0.34],
      [0.08, 0.5],
      [0.03, 0.66],
      [0, 0.78],
    ].map(([x, y]) => new Vector2(x * 1.5 * (1 - i * 0.2), y * 1.45 * (1 - i * 0.15)))
    const flame = part(new LatheGeometry(profile, 24), accent(0.45), 0.012)
    const a = (i / 3) * Math.PI * 2
    flame.position.set(Math.cos(a) * 0.14 * i, -0.55, Math.sin(a) * 0.14 * i)
    flames.push(flame)
    fire.add(flame)
  }

  // La espada clavada, con su espiral
  const sword = new Group()
  sword.add(part(new BoxGeometry(0.09, 1.25, 0.025), ink(), 0.01))
  const guard = part(new BoxGeometry(0.42, 0.06, 0.06), ink(), 0.01)
  guard.position.y = 0.66
  sword.add(guard)
  const grip = part(new CylinderGeometry(0.035, 0.035, 0.32, 10), ink(), 0.01)
  grip.position.y = 0.85
  sword.add(grip)
  const pommel = part(new SphereGeometry(0.06, 12, 8), ink(), 0.01)
  pommel.position.y = 1.04
  sword.add(pommel)
  const coil = new CatmullRomCurve3(
    Array.from({ length: 40 }, (_, k) => {
      const a = k * 0.55
      return v(Math.cos(a) * 0.08, -0.55 + k * 0.028, Math.sin(a) * 0.08)
    }),
  )
  sword.add(part(new TubeGeometry(coil, 160, 0.012, 6), ink(), 0))
  sword.position.y = -0.05
  sword.rotation.z = 0.12
  fire.add(sword)

  fire.rotation.x = 0.25
  const root = withShadow(fire, -0.78, 2.4)
  return {
    root,
    update: (t) => {
      fire.rotation.y = Math.sin(t * 0.25) * 0.5
      flames.forEach((flame, i) => {
        flame.scale.y = 1 + Math.sin(t * (6 + i * 1.7) + i) * 0.12 + Math.sin(t * 13 + i * 3) * 0.05
        flame.rotation.z = Math.sin(t * (3 + i) + i) * 0.08
      })
    },
  }
}

export const OBJECTS = { birrete, nexo, moneda, cafe, hoguera }
export type ObjectName = keyof typeof OBJECTS
