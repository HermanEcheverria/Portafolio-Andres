---
title: Tienda en línea para una marca de café
summary: Catálogo, carrito y pedidos confirmados por WhatsApp, con un panel para administrar productos y pedidos.
year: 2026
role: Diseño y desarrollo completo
stack: [Next.js 16, Payload CMS, PostgreSQL, Tailwind CSS, Playwright]
order: 1
---

## El problema

Una marca de café ya vendía su producto, pero no tenía tienda en línea. Necesitaba una tienda donde los clientes armaran su pedido
solos y un panel sencillo para que el equipo administrara productos, precios y pedidos.

## Decisiones clave

- **Pedidos por WhatsApp.** Es como compra la mayoría de clientes locales y permitió lanzar sin
  integrar una pasarela de pago desde el primer día.
- **El servidor manda en los precios.** El carrito solo envía identificadores y cantidades; el total se
  recalcula con la base de datos para que nadie pueda pagar menos modificando el navegador.
- **Panel listo para no técnicos.** Payload CMS da un panel en español con roles, borradores y fotos
  optimizadas automáticamente.

## Resultado

[PENDIENTE: enlace a la tienda publicada y aprendizajes.]
