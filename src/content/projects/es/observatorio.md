---
title: 'Observatorio: USDC en tiempo real'
summary: Indexador propio de la red Base y un panel en vivo que muestra cómo se mueve el dólar digital de Circle, también en quetzales.
year: 2026
role: Diseño, desarrollo y datos
stack: [TypeScript, viem, PostgreSQL, Drizzle, Hono, Astro, D3, Vitest]
order: 3
---

## El problema

USDC, el dólar digital de Circle, mueve miles de millones de dólares al día en Base, una red de
Ethereum. Los exploradores de bloques muestran transacciones sueltas y los sitios de precios
muestran el mercado, pero ninguno responde preguntas simples: ¿cuánto se movió en la última hora?,
¿se está emitiendo o quemando USDC?, ¿de qué tamaño son las transferencias? Quería responderlas
leyendo la blockchain directamente, sin depender de una API de terceros para los datos principales.

## Lo que construí

- **Un indexador propio** que lee los eventos `Transfer` del contrato oficial de USDC por lotes
  de bloques confirmados, con viem sobre un nodo JSON-RPC.
- **Un modelo de datos pensado para el volumen real.** Base tiene unas 130 000 transferencias por
  hora; guardarlas todas no cabe en una base pequeña. Cada bloque se resume en una fila (conteo,
  volumen, histograma por tamaño, emisiones y quemas) y solo se guardan completas las
  transferencias de un millón de dólares o más.
- **Tareas programadas** que traen precios de CoinGecko, la oferta de stablecoins de DefiLlama y
  el tipo de cambio de referencia del Banguat, para mostrar todo también en quetzales.
- **Una API de solo lectura con Hono** y **un panel en Astro** con gráficas hechas a mano en SVG,
  en el mismo estilo grabado de este portafolio.

## Decisiones clave

- **Confiable ante fallas.** Cada lote y su punto de control se guardan en una sola transacción,
  repetir un lote no duplica datos y, si el hash del último bloque cambia (una reorganización de
  la cadena), se borra lo afectado y se reindexa.
- **Sin estado en memoria.** El paso del indexador lee todo de la base, así que lo puede llamar un
  bucle de Node en local o un cron en la nube sin reescribirlo.
- **Sin Docker para desarrollar.** En local usa PGlite, PostgreSQL compilado a WebAssembly; en
  producción basta con una variable de entorno para usar un Postgres real.
- **Gráficas honestas y accesibles.** La paleta pasó un validador de contraste y daltonismo, cada
  gráfica tiene navegación con teclado y su tabla equivalente, y los intervalos incompletos se
  marcan como parciales en lugar de parecer caídas.

## Resultado

En desarrollo local. Indexa una hora de la red en unos 30 segundos y mantiene los datos con
unos 20 segundos de atraso, lo que tardan en confirmarse los bloques. Tiene 30 pruebas
automatizadas, incluidas reorganizaciones simuladas con una cadena falsa.
