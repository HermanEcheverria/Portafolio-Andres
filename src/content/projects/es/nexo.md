---
title: 'Nexo: un sistema operativo de agentes'
summary: Una capa que coordina, administra y gobierna a varios agentes que cuidan mi PC. Proponen; yo decido. Con app de escritorio y un modelo local.
year: 2026
role: Diseño, arquitectura y desarrollo
stack: [TypeScript, Node.js, SQLite, Hono, Tauri 2, Rust, React, Ollama, Vitest]
order: 2
emblem: nucleo
repos:
  - label: Núcleo (nexo-os)
    url: https://github.com/HermanEcheverria/nexo-os
  - label: App de Windows (nexo-desktop)
    url: https://github.com/HermanEcheverria/nexo-desktop
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
- **Seis agentes** que revisan el disco y las descargas, las cachés, los proyectos con git, las
  actualizaciones de Ubuntu y Windows, la seguridad (antivirus, firewall, puertos expuestos y secretos
  en los repositorios) y la salud del equipo (batería, GPU y memoria).
- **Una cola de aprobaciones.** Los agentes solo _proponen_ cambios concretos; nada se ejecuta sin
  mi aprobación, lo aprobado va a una cuarentena que se puede deshacer durante 30 días y lo
  rechazado no se vuelve a proponer en un mes.
- **Una app de escritorio** (Tauri y React) que arranca con Windows, enciende el núcleo en WSL si
  no está corriendo, avisa con una notificación y vive en la bandeja del sistema.
- **Un asistente local** (Ollama con Qwen 3.5 en la GPU) con conversaciones que recuerdan lo que
  hablamos, al que le pregunto en español qué pasa en la PC. Nada sale de la computadora.
- **Transparencia en vivo:** al ejecutar un agente se ven sus pasos, lo que encontró y qué cambió
  desde la revisión anterior; el logo de Nexo se anima según lo que está haciendo. La interfaz pasó
  por una revisión de diseño completa: lo urgente primero, el nombre del archivo antes que la
  acción y color solo donde importa.

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
- **Un resumen que nunca contradice a las cifras.** Al revisar el diseño de la app encontré que
  el resumen del modelo decía 25.6 GB mientras el parte decía 24.8: se redactaba solo al iniciar
  sesión y los agentes seguían trabajando. Ahora se vuelve a redactar en cuanto un agente termina o
  decido una propuesta.
- **Elegir con datos.** Armé una evaluación con respuestas esperadas: el modelo de 4B acertó 8 de 8
  en 1.5 segundos y superó al de 9B, así que me quedé con el más pequeño.
- **API local blindada.** La app habla con el núcleo mediante un token secreto, validación del
  encabezado Host contra _DNS rebinding_ y CORS solo para la app; la parte nativa en Rust ejecuta
  únicamente comandos fijos.

## Resultado

En uso diario en mi PC. Desde el primer día me ayudó a liberar unos 64 GB con aprobaciones que
se pueden deshacer, sin un solo error, y el Centinela detectó una base de datos expuesta a la red.
Tiene 61 pruebas en el núcleo, 14 en la app, integración continua y un instalador de Windows de
2.4 MB.
