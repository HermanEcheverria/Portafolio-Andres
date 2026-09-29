import type { Localizable } from '@/data/localized'

/**
 * Diagramas de arquitectura de los casos de estudio, indexados por el slug del proyecto.
 * Las coordenadas están en unidades del viewBox; el componente ArchitectureDiagram las dibuja.
 */
export type DiagramNode = {
  id: string
  /** actor: persona o servicio externo · service: pieza del sistema · database: cilindro */
  kind: 'actor' | 'service' | 'database'
  x: number
  y: number
  w: number
  h: number
  label: Localizable
  detail: Localizable
}

export type DiagramEdge = {
  id: string
  from: string
  to: string
  /** Trazo SVG en el sentido del flujo: los paquetes lo recorren de principio a fin. */
  d: string
  label: Localizable
  /** Posición de la etiqueta. */
  lx: number
  ly: number
}

/** Un recorrido por el sistema: qué conexiones se activan y en qué orden. */
export type DiagramFlow = {
  label: Localizable
  description: Localizable
  edges: string[]
}

export type Diagram = {
  width: number
  height: number
  /** Recuadro que agrupa lo que corre en el servidor. */
  frame: { x: number; y: number; w: number; h: number; label: Localizable }
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  flows: DiagramFlow[]
}

export const diagrams: Record<string, Diagram> = {
  'gestor-de-becas': {
    width: 1180,
    height: 580,
    frame: {
      x: 280,
      y: 20,
      w: 880,
      h: 540,
      label: {
        es: 'Servidor · Docker Compose y Caddy (HTTPS)',
        en: 'Server · Docker Compose and Caddy (HTTPS)',
      },
    },
    nodes: [
      {
        id: 'coordinacion',
        kind: 'actor',
        x: 20,
        y: 90,
        w: 200,
        h: 90,
        label: { es: 'Coordinación', en: 'Scholarship office' },
        detail: { es: 'navegador', en: 'browser' },
      },
      {
        id: 'estudiante',
        kind: 'actor',
        x: 20,
        y: 420,
        w: 200,
        h: 90,
        label: { es: 'Estudiante', en: 'Student' },
        detail: 'WhatsApp',
      },
      {
        id: 'portal',
        kind: 'service',
        x: 330,
        y: 90,
        w: 230,
        h: 90,
        label: { es: 'Portal web', en: 'Web portal' },
        detail: { es: 'Next.js · 10 pantallas', en: 'Next.js · 10 screens' },
      },
      {
        id: 'asistente',
        kind: 'service',
        x: 330,
        y: 420,
        w: 230,
        h: 90,
        label: { es: 'Asistente', en: 'Assistant' },
        detail: { es: 'verifica la identidad', en: 'verifies identity' },
      },
      {
        id: 'reglas',
        kind: 'service',
        x: 650,
        y: 50,
        w: 220,
        h: 80,
        label: { es: 'Motor de reglas', en: 'Rules engine' },
        detail: { es: 'funciones puras', en: 'pure functions' },
      },
      {
        id: 'db',
        kind: 'database',
        x: 650,
        y: 215,
        w: 220,
        h: 130,
        label: 'PostgreSQL',
        detail: { es: 'Prisma · bitácora', en: 'Prisma · event log' },
      },
      {
        id: 'llm',
        kind: 'service',
        x: 650,
        y: 440,
        w: 220,
        h: 90,
        label: { es: 'Modelo local', en: 'Local model' },
        detail: 'Ollama',
      },
      {
        id: 'n8n',
        kind: 'service',
        x: 940,
        y: 235,
        w: 190,
        h: 90,
        label: 'n8n',
        detail: { es: 'tareas programadas', en: 'scheduled jobs' },
      },
      {
        id: 'correo',
        kind: 'actor',
        x: 940,
        y: 50,
        w: 190,
        h: 80,
        label: { es: 'Correo', en: 'Email' },
        detail: { es: 'avisos y resúmenes', en: 'notices and digests' },
      },
    ],
    edges: [
      {
        id: 'registra',
        from: 'coordinacion',
        to: 'portal',
        d: 'M220 135 H330',
        label: { es: 'registra', en: 'records' },
        lx: 275,
        ly: 124,
      },
      {
        id: 'evalua',
        from: 'portal',
        to: 'reglas',
        d: 'M560 115 C 605 115, 605 90, 650 90',
        label: { es: 'propone', en: 'suggests' },
        lx: 605,
        ly: 92,
      },
      {
        id: 'guarda',
        from: 'portal',
        to: 'db',
        d: 'M560 155 C 610 155, 600 255, 650 255',
        label: { es: 'guarda', en: 'saves' },
        lx: 612,
        ly: 200,
      },
      {
        id: 'pregunta',
        from: 'estudiante',
        to: 'asistente',
        d: 'M220 465 H330',
        label: { es: 'pregunta', en: 'asks' },
        lx: 275,
        ly: 454,
      },
      {
        id: 'interpreta',
        from: 'asistente',
        to: 'llm',
        d: 'M560 485 H650',
        label: { es: 'interpreta', en: 'interprets' },
        lx: 607,
        ly: 473,
      },
      {
        id: 'consulta',
        from: 'asistente',
        to: 'db',
        d: 'M560 440 C 610 440, 600 305, 650 305',
        label: { es: 'consulta', en: 'looks up' },
        lx: 612,
        ly: 372,
      },
      {
        id: 'lee',
        from: 'db',
        to: 'n8n',
        d: 'M870 280 H940',
        label: { es: 'lee', en: 'reads' },
        lx: 905,
        ly: 269,
      },
      {
        id: 'envia',
        from: 'n8n',
        to: 'correo',
        d: 'M1035 235 V130',
        label: { es: 'envía', en: 'sends' },
        lx: 1062,
        ly: 186,
      },
    ],
    flows: [
      {
        label: { es: 'Registrar una falta', en: 'Record a warning' },
        description: {
          es: 'La coordinación registra la falta en el portal. El motor de reglas propone el nuevo estado de la beca, la coordinación lo confirma y el cambio queda en la bitácora.',
          en: 'The office records the warning in the portal. The rules engine suggests the scholarship’s new status, the office confirms it, and the change lands in the event log.',
        },
        edges: ['registra', 'evalua', 'guarda'],
      },
      {
        label: { es: 'Consulta por WhatsApp', en: 'WhatsApp question' },
        description: {
          es: 'El estudiante escribe por WhatsApp. Tras verificar su identidad, el asistente reconoce la pregunta; si las palabras clave no alcanzan, la interpreta el modelo local, y luego consulta su beca.',
          en: 'A student writes on WhatsApp. After verifying their identity, the assistant recognizes the question, falls back to the local model when keywords miss, and looks up their scholarship.',
        },
        edges: ['pregunta', 'interpreta', 'consulta'],
      },
      {
        label: { es: 'Aviso programado', en: 'Scheduled notice' },
        description: {
          es: 'n8n revisa los datos según su calendario. Cada aviso se registra antes de enviarse, así una falla nunca deja un envío sin rastro.',
          en: 'n8n checks the data on a schedule. Every notice is logged before it is sent, so a failure never leaves a message without a trace.',
        },
        edges: ['lee', 'envia'],
      },
    ],
  },

  'tienda-cafe': {
    width: 1020,
    height: 560,
    frame: {
      x: 280,
      y: 20,
      w: 720,
      h: 520,
      label: {
        es: 'Una sola aplicación · Next.js 16 y Payload CMS',
        en: 'One app · Next.js 16 and Payload CMS',
      },
    },
    nodes: [
      {
        id: 'cliente',
        kind: 'actor',
        x: 20,
        y: 50,
        w: 200,
        h: 90,
        label: { es: 'Cliente', en: 'Customer' },
        detail: { es: 'carrito local', en: 'local cart' },
      },
      {
        id: 'whatsapp',
        kind: 'actor',
        x: 20,
        y: 235,
        w: 200,
        h: 90,
        label: 'WhatsApp',
        detail: { es: 'mensaje prellenado', en: 'prefilled message' },
      },
      {
        id: 'equipo',
        kind: 'actor',
        x: 20,
        y: 420,
        w: 200,
        h: 90,
        label: { es: 'Equipo', en: 'Team' },
        detail: { es: 'administra la tienda', en: 'runs the store' },
      },
      {
        id: 'tienda',
        kind: 'service',
        x: 330,
        y: 50,
        w: 240,
        h: 90,
        label: { es: 'Tienda', en: 'Storefront' },
        detail: { es: 'páginas estáticas', en: 'static pages' },
      },
      {
        id: 'checkout',
        kind: 'service',
        x: 330,
        y: 235,
        w: 240,
        h: 90,
        label: 'Checkout',
        detail: { es: 'Zod · precios del servidor', en: 'Zod · server-side prices' },
      },
      {
        id: 'panel',
        kind: 'service',
        x: 330,
        y: 420,
        w: 240,
        h: 90,
        label: { es: 'Panel /admin', en: '/admin panel' },
        detail: { es: 'roles y borradores', en: 'roles and drafts' },
      },
      {
        id: 'db',
        kind: 'database',
        x: 740,
        y: 215,
        w: 220,
        h: 130,
        label: 'PostgreSQL',
        detail: { es: 'productos y pedidos', en: 'products and orders' },
      },
    ],
    edges: [
      {
        id: 'navega',
        from: 'cliente',
        to: 'tienda',
        d: 'M220 95 H330',
        label: { es: 'elige', en: 'browses' },
        lx: 275,
        ly: 84,
      },
      {
        id: 'carrito',
        from: 'tienda',
        to: 'checkout',
        d: 'M450 140 V235',
        label: { es: 'ids y cantidades', en: 'ids and quantities' },
        lx: 520,
        ly: 192,
      },
      {
        id: 'pedido',
        from: 'checkout',
        to: 'db',
        d: 'M570 280 H740',
        label: { es: 'recalcula y guarda', en: 'reprices and saves' },
        lx: 655,
        ly: 269,
      },
      {
        id: 'confirma',
        from: 'checkout',
        to: 'whatsapp',
        d: 'M330 280 H220',
        label: 'wa.me',
        lx: 275,
        ly: 269,
      },
      {
        id: 'avisa',
        from: 'whatsapp',
        to: 'equipo',
        d: 'M120 325 V420',
        label: { es: 'confirma', en: 'confirms' },
        lx: 160,
        ly: 376,
      },
      {
        id: 'edita',
        from: 'equipo',
        to: 'panel',
        d: 'M220 465 H330',
        label: { es: 'edita', en: 'edits' },
        lx: 275,
        ly: 454,
      },
      {
        id: 'publica',
        from: 'panel',
        to: 'db',
        d: 'M570 465 C 670 465, 690 320, 740 318',
        label: { es: 'publica', en: 'publishes' },
        lx: 676,
        ly: 420,
      },
      {
        id: 'regenera',
        from: 'db',
        to: 'tienda',
        d: 'M850 215 C 850 120, 700 95, 570 95',
        label: { es: 'regenera', en: 'rebuilds' },
        lx: 790,
        ly: 118,
      },
    ],
    flows: [
      {
        label: { es: 'Hacer un pedido', en: 'Place an order' },
        description: {
          es: 'El carrito solo envía identificadores y cantidades. El servidor valida los datos, recalcula el total con la base de datos y guarda el pedido; el cliente lo confirma por WhatsApp con un mensaje ya escrito.',
          en: 'The cart only sends IDs and quantities. The server validates the data, reprices the order from the database and saves it; the customer confirms it on WhatsApp with a prefilled message.',
        },
        edges: ['navega', 'carrito', 'pedido', 'confirma', 'avisa'],
      },
      {
        label: { es: 'Cambiar un producto', en: 'Edit a product' },
        description: {
          es: 'El equipo edita y publica desde el panel. Un hook de Payload regenera las páginas estáticas, así la tienda nunca muestra un precio viejo.',
          en: 'The team edits and publishes from the panel. A Payload hook rebuilds the static pages, so the store never shows a stale price.',
        },
        edges: ['edita', 'publica', 'regenera'],
      },
    ],
  },

  observatorio: {
    width: 1180,
    height: 580,
    frame: {
      x: 280,
      y: 20,
      w: 880,
      h: 540,
      label: { es: 'Un solo comando · pnpm dev', en: 'One command · pnpm dev' },
    },
    nodes: [
      {
        id: 'base',
        kind: 'actor',
        x: 20,
        y: 90,
        w: 200,
        h: 90,
        label: { es: 'Red Base', en: 'Base network' },
        detail: { es: 'un bloque cada 2 s', en: 'a block every 2 s' },
      },
      {
        id: 'fuentes',
        kind: 'actor',
        x: 20,
        y: 420,
        w: 200,
        h: 90,
        label: { es: 'Fuentes', en: 'Sources' },
        detail: { es: 'precios y cambio', en: 'prices and FX' },
      },
      {
        id: 'indexador',
        kind: 'service',
        x: 330,
        y: 90,
        w: 230,
        h: 90,
        label: { es: 'Indexador', en: 'Indexer' },
        detail: { es: 'viem · lotes confirmados', en: 'viem · confirmed batches' },
      },
      {
        id: 'tareas',
        kind: 'service',
        x: 330,
        y: 420,
        w: 230,
        h: 90,
        label: { es: 'Tareas', en: 'Jobs' },
        detail: { es: 'cada 5 min · 1 h · 6 h', en: 'every 5 min · 1 h · 6 h' },
      },
      {
        id: 'db',
        kind: 'database',
        x: 650,
        y: 215,
        w: 220,
        h: 130,
        label: 'PostgreSQL',
        detail: { es: 'una fila por bloque', en: 'one row per block' },
      },
      {
        id: 'api',
        kind: 'service',
        x: 940,
        y: 90,
        w: 190,
        h: 90,
        label: 'API',
        detail: { es: 'Hono · solo lectura', en: 'Hono · read-only' },
      },
      {
        id: 'panel',
        kind: 'service',
        x: 940,
        y: 420,
        w: 190,
        h: 90,
        label: { es: 'Panel', en: 'Dashboard' },
        detail: { es: 'Astro · SVG', en: 'Astro · SVG' },
      },
    ],
    edges: [
      {
        id: 'lee',
        from: 'base',
        to: 'indexador',
        d: 'M220 135 H330',
        label: { es: 'lee logs', en: 'reads logs' },
        lx: 275,
        ly: 124,
      },
      {
        id: 'resume',
        from: 'indexador',
        to: 'db',
        d: 'M560 155 C 610 155, 600 255, 650 255',
        label: { es: 'resume', en: 'summarizes' },
        lx: 612,
        ly: 200,
      },
      {
        id: 'trae',
        from: 'fuentes',
        to: 'tareas',
        d: 'M220 465 H330',
        label: 'HTTP',
        lx: 275,
        ly: 454,
      },
      {
        id: 'guarda',
        from: 'tareas',
        to: 'db',
        d: 'M560 440 C 610 440, 600 305, 650 305',
        label: { es: 'guarda', en: 'stores' },
        lx: 612,
        ly: 372,
      },
      {
        id: 'consulta',
        from: 'db',
        to: 'api',
        d: 'M870 250 C 905 250, 905 135, 940 135',
        label: 'SQL',
        lx: 905,
        ly: 196,
      },
      {
        id: 'sirve',
        from: 'api',
        to: 'panel',
        d: 'M1035 180 V420',
        label: 'JSON',
        lx: 1068,
        ly: 304,
      },
    ],
    flows: [
      {
        label: { es: 'Un bloque nuevo', en: 'A new block' },
        description: {
          es: 'El indexador espera 10 confirmaciones, lee las transferencias del lote y las resume en una fila por bloque. El panel pide los datos agregados a la API cada 15 segundos.',
          en: 'The indexer waits for 10 confirmations, reads the batch’s transfers and summarizes them into one row per block. The dashboard asks the API for aggregated data every 15 seconds.',
        },
        edges: ['lee', 'resume', 'consulta', 'sirve'],
      },
      {
        label: { es: 'Montos en quetzales', en: 'Amounts in quetzales' },
        description: {
          es: 'Las tareas traen precios de CoinGecko, la oferta de stablecoins de DefiLlama y el tipo de cambio del Banguat. La API entrega los montos en dólares y el panel los convierte a quetzales al instante.',
          en: 'Jobs pull prices from CoinGecko, stablecoin supply from DefiLlama and the Bank of Guatemala’s exchange rate. The API returns dollar amounts and the dashboard converts them to quetzales instantly.',
        },
        edges: ['trae', 'guarda', 'consulta', 'sirve'],
      },
      {
        label: { es: 'La cadena se reorganiza', en: 'The chain reorganizes' },
        description: {
          es: 'Antes de cada lote, el indexador compara el hash del último bloque guardado con el de la red. Si cambió, borra lo afectado en una transacción y vuelve a indexar desde un punto seguro.',
          en: 'Before each batch, the indexer compares the last saved block’s hash with the network’s. If it changed, it deletes the affected rows in one transaction and reindexes from a safe point.',
        },
        edges: ['lee', 'resume'],
      },
    ],
  },

  nexo: {
    width: 1180,
    height: 580,
    frame: {
      x: 280,
      y: 20,
      w: 880,
      h: 540,
      label: {
        es: 'Todo corre en tu PC · nada sale a internet',
        en: 'Everything runs on your PC · nothing leaves it',
      },
    },
    nodes: [
      {
        id: 'tu',
        kind: 'actor',
        x: 20,
        y: 90,
        w: 200,
        h: 90,
        label: { es: 'Tú', en: 'You' },
        detail: { es: 'decides y preguntas', en: 'decide and ask' },
      },
      {
        id: 'pc',
        kind: 'actor',
        x: 20,
        y: 420,
        w: 200,
        h: 90,
        label: { es: 'Tu PC', en: 'Your PC' },
        detail: 'Windows · WSL',
      },
      {
        id: 'app',
        kind: 'service',
        x: 330,
        y: 90,
        w: 230,
        h: 90,
        label: 'App',
        detail: { es: 'Tauri · bandeja', en: 'Tauri · tray' },
      },
      {
        id: 'nucleo',
        kind: 'service',
        x: 650,
        y: 90,
        w: 220,
        h: 90,
        label: { es: 'Núcleo', en: 'Kernel' },
        detail: { es: 'procesos · planificador', en: 'processes · scheduler' },
      },
      {
        id: 'modelo',
        kind: 'service',
        x: 940,
        y: 90,
        w: 190,
        h: 90,
        label: { es: 'Modelo local', en: 'Local model' },
        detail: { es: 'Qwen 3.5 · GPU', en: 'Qwen 3.5 · GPU' },
      },
      {
        id: 'db',
        kind: 'database',
        x: 940,
        y: 250,
        w: 190,
        h: 130,
        label: 'SQLite',
        detail: { es: 'bitácora · acciones', en: 'log · actions' },
      },
      {
        id: 'agentes',
        kind: 'service',
        x: 650,
        y: 420,
        w: 220,
        h: 90,
        label: { es: 'Agentes', en: 'Agents' },
        detail: { es: 'solo leen y proponen', en: 'read and propose' },
      },
      {
        id: 'herramientas',
        kind: 'service',
        x: 330,
        y: 420,
        w: 230,
        h: 90,
        label: { es: 'Herramientas', en: 'Tools' },
        detail: { es: 'capacidades · privacidad', en: 'capabilities · privacy' },
      },
    ],
    edges: [
      {
        id: 'decides',
        from: 'tu',
        to: 'app',
        d: 'M220 135 H330',
        label: { es: 'decides', en: 'decide' },
        lx: 275,
        ly: 124,
      },
      {
        id: 'api',
        from: 'app',
        to: 'nucleo',
        d: 'M560 135 H650',
        label: { es: 'token', en: 'token' },
        lx: 605,
        ly: 124,
      },
      {
        id: 'pregunta',
        from: 'nucleo',
        to: 'modelo',
        d: 'M870 135 H940',
        label: { es: 'pregunta', en: 'asks' },
        lx: 905,
        ly: 124,
      },
      {
        id: 'registra',
        from: 'nucleo',
        to: 'db',
        d: 'M870 160 C 905 160, 905 315, 940 315',
        label: { es: 'registra', en: 'logs' },
        lx: 905,
        ly: 240,
      },
      {
        id: 'lanza',
        from: 'nucleo',
        to: 'agentes',
        d: 'M760 180 V420',
        label: { es: 'lanza', en: 'runs' },
        lx: 792,
        ly: 304,
      },
      {
        id: 'usan',
        from: 'agentes',
        to: 'herramientas',
        d: 'M650 465 H560',
        label: { es: 'usan', en: 'use' },
        lx: 605,
        ly: 454,
      },
      {
        id: 'leen',
        from: 'herramientas',
        to: 'pc',
        d: 'M330 465 H220',
        label: { es: 'leen', en: 'read' },
        lx: 275,
        ly: 454,
      },
    ],
    flows: [
      {
        label: { es: 'Una revisión', en: 'A check-up' },
        description: {
          es: 'El planificador despierta a un agente. El agente solo puede usar las herramientas de su manifiesto, y esas herramientas no entran a las zonas privadas. Lo que encuentra y lo que propone queda en la bitácora.',
          en: 'The scheduler wakes an agent. The agent can only use the tools in its manifest, and those tools never enter private zones. What it finds and proposes goes to the log.',
        },
        edges: ['lanza', 'usan', 'leen', 'registra'],
      },
      {
        label: { es: 'Tú apruebas', en: 'You approve' },
        description: {
          es: 'Apruebas una propuesta en la app. El núcleo ejecuta exactamente lo aprobado: mueve los archivos a una cuarentena que puedes deshacer durante 30 días, y el agente vuelve a revisar para que el parte refleje la PC real.',
          en: 'You approve a proposal in the app. The kernel runs exactly what was approved: it moves the files to a quarantine you can undo for 30 days, and the agent checks again so the report reflects the real PC.',
        },
        edges: ['decides', 'api', 'registra'],
      },
      {
        label: { es: 'Le preguntas', en: 'You ask' },
        description: {
          es: 'Preguntas en español. El modelo local responde con los datos del núcleo y solo puede elegir entre cuatro intenciones: ninguna aprueba ni borra. Las cifras las calcula el código, no el modelo.',
          en: 'You ask in Spanish. The local model answers with the kernel’s data and can only choose among four intents: none approves or deletes. Figures are computed by the code, not the model.',
        },
        edges: ['decides', 'api', 'pregunta'],
      },
    ],
  },
}
