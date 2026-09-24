---
title: Sistema de gestión de becas
summary: Trabajo de graduación. Seguimiento automatizado de becas universitarias, con avisos y asistente por WhatsApp.
year: 2026
role: Autor · diseño, desarrollo y despliegue
stack: [Next.js, TypeScript, Prisma, PostgreSQL, n8n, Docker, Ollama, Vitest]
order: 1
---

## El problema

El departamento de becas de la Universidad del Istmo controlaba el ciclo de vida de cada beca,
crédito educativo y descuento en hojas de cálculo que se reconstruían cada semestre. Los
promedios se consultaban a mano, las faltas llegaban por correo y no quedaba constancia de los
avisos enviados a los estudiantes.

## Lo que construí

- **Un portal de 10 pantallas** para beneficiarios, semestres, avisos, reportes y respaldos.
- **Un motor de reglas** como funciones puras, que evalúa el rendimiento académico, la cobertura
  y las horas beca según las condiciones de la carta de otorgamiento.
- **Una bitácora de solo escritura** que registra cada cambio de estado. Es el instrumento de
  medición de la investigación, así que distingue lo que ocurrió de verdad de lo reconstruido.
- **Automatización con n8n**: avisos por correo, resúmenes semanales y recordatorios programados.
- **Un asistente por WhatsApp** donde cada estudiante consulta su beca después de verificar su
  identidad. Un modelo de lenguaje local reconoce las preguntas que las palabras clave no
  alcanzan.

## Decisiones clave

- **El sistema propone, no impone.** Las reglas sugieren valores que la coordinación confirma;
  nunca sobrescriben un dato ya registrado.
- **Nada se borra.** Una falta registrada por error se descarta con su motivo, y los semestres se
  cierran y reabren en lugar de eliminarse.
- **La constancia va antes del envío.** Cada aviso se registra antes de intentar mandarlo, para
  que una falla nunca deje un envío sin rastro.
- **Datos sintéticos.** Las pruebas y la base de demostración usan datos generados, nunca
  información real de estudiantes.

## Resultado

Desplegado en un servidor con HTTPS (Caddy y Docker Compose), con más de 330 pruebas
automatizadas y cobertura superior al 90 % en los módulos críticos.
