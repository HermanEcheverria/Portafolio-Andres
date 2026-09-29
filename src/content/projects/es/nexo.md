---
title: 'Nexo: un sistema operativo de agentes'
summary: Una capa que coordina, administra y gobierna a varios agentes que cuidan mi PC. Proponen; yo decido. Con app de escritorio y un modelo local.
year: 2026
role: Diseño, arquitectura y desarrollo
stack: [TypeScript, Node.js, SQLite, Hono, Tauri 2, Rust, React, Ollama, Vitest]
order: 2
---

## El problema

"Agentic OS" es una etiqueta de moda, pero casi siempre describe una app con un chatbot. Quería
construir la parte difícil de verdad: una capa que **coordine, administre y gobierne** a varios
agentes para que trabajen de forma autónoma, colaborativa y continua, sin perder el control. Y
quería usarla en algo real: mi propia computadora, que acumula descargas, cachés, proyectos a
medias y actualizaciones pendientes.

## Lo que construí

- **Un núcleo con piezas de sistema operativo.** Cada ejecución de un agente es un proceso con
  ciclo de vida; un planificador los despierta según su horario y al iniciar sesión; un supervisor
  reintenta lo que falla y detiene lo que se pasa de tiempo; y todo queda en una bitácora de solo
  escritura.
- **Cuatro agentes** que revisan el disco y las descargas, las cachés, los proyectos con git y las
  actualizaciones de Ubuntu y Windows.
- **Una cola de aprobaciones.** Los agentes solo _proponen_ cambios concretos; nada se ejecuta sin
  mi aprobación, lo aprobado va a una cuarentena que se puede deshacer durante 30 días y lo
  rechazado no se vuelve a proponer en un mes.
- **Una app de escritorio** (Tauri y React) que arranca con Windows, enciende el núcleo en WSL si
  no está corriendo, avisa con una notificación y vive en la bandeja del sistema.
- **Un asistente local** (Ollama con Qwen 3.5 en la GPU) al que le pregunto en español qué pasa en
  la PC. Nada sale de la computadora.

## Decisiones clave

- **Capacidades, no terminal.** Cada agente declara qué herramientas puede usar y el núcleo niega
  cualquier otra. Las herramientas tienen nivel de riesgo: leer es libre; cambiar la PC pasa por la
  cola de aprobaciones, y al ejecutar se vuelve a verificar cada ruta.
- **Privacidad aplicada por las herramientas.** Fotos y documentos de la universidad son zonas
  prohibidas; ningún agente las puede leer, ni siquiera para medir su tamaño.
- **Durabilidad probada, no supuesta.** La primera versión usaba PGlite y un reinicio de Windows
  dañó la base. La cambié a SQLite en modo WAL y agregué una prueba que mata el proceso a mitad de
  miles de escrituras: la base siempre vuelve a abrir sana.
- **Un modelo que no puede hacer daño.** Su salida está limitada por un esquema a cuatro
  intenciones y ninguna aprueba ni borra, así que un archivo que "da órdenes" es solo un dato. Las
  cifras las calcula el código, y el resumen se verifica número por número antes de mostrarse.
- **Elegir con datos.** Armé una evaluación con respuestas esperadas: el modelo de 4B acertó 8 de 8
  en 1.5 segundos y superó al de 9B, así que me quedé con el más pequeño.
- **API local blindada.** La app habla con el núcleo mediante un token secreto, validación del
  encabezado Host contra _DNS rebinding_ y CORS solo para la app; la parte nativa en Rust ejecuta
  únicamente comandos fijos.

## Resultado

En uso diario en mi PC. Desde el primer día me ayudó a liberar unos 64 GB con aprobaciones que
se pueden deshacer, sin un solo error. Tiene 42 pruebas en el núcleo, 7 en la app, integración
continua y un instalador de Windows de 2.4 MB.
