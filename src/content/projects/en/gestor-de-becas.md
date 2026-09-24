---
title: Scholarship management system
summary: Graduation project. Automates a university's scholarship tracking, with automatic notices and a WhatsApp assistant.
year: 2026
role: Author · design, development and deployment
stack: [Next.js, TypeScript, Prisma, PostgreSQL, n8n, Docker, Ollama, Vitest]
order: 1
---

## The problem

The scholarship office at Universidad del Istmo tracked the lifecycle of every scholarship, student
loan and discount in spreadsheets rebuilt every semester. Grades were looked up by hand, academic
warnings arrived by email and there was no record of the notices sent to students.

## What I built

- **A 10-screen portal** for beneficiaries, semesters, notices, reports and backups.
- **A rules engine** made of pure functions that evaluates academic performance, coverage and
  service hours according to the award letter's conditions.
- **An append-only event log** that records every state change. It is the research's measurement
  instrument, so it tells real events apart from reconstructed ones.
- **Automation with n8n**: email notices, weekly summaries and scheduled reminders.
- **A WhatsApp assistant** where each student checks their scholarship after verifying their
  identity. A local language model recognizes the questions keywords miss.

## Key decisions

- **The system suggests, it does not impose.** Rules propose values the office confirms; they
  never overwrite recorded data.
- **Nothing is deleted.** A warning recorded by mistake is dismissed with its reason, and semesters
  are closed and reopened instead of removed.
- **The record comes before the send.** Every notice is logged before it is sent, so a failure
  never leaves a message without a trace.
- **Synthetic data.** Tests and the demo database use generated data, never real student
  information.

## Outcome

Deployed on a server with HTTPS (Caddy and Docker Compose), with more than 330 automated tests and
over 90% coverage on the critical modules.
