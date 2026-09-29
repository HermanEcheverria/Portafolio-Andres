---
title: 'Nexo: an agentic operating system'
summary: A layer that coordinates, manages and governs several agents that look after my PC. They propose; I decide. With a desktop app and a local model.
year: 2026
role: Design, architecture and development
stack: [TypeScript, Node.js, SQLite, Hono, Tauri 2, Rust, React, Ollama, Vitest]
order: 2
repos:
  - label: Kernel (nexo-os)
    url: https://github.com/HermanEcheverria/nexo-os
  - label: Windows app (nexo-desktop)
    url: https://github.com/HermanEcheverria/nexo-desktop
---

## The problem

"Agentic OS" is a trendy label, but it usually describes an app with a chatbot. I wanted to build
the genuinely hard part: a layer that **coordinates, manages and governs** several agents so they
work autonomously, collaboratively and continuously, without losing control. And I wanted to use
it for something real: my own computer, which piles up downloads, caches, half-finished projects
and pending updates.

## What I built

- **A kernel with operating-system parts.** Every agent run is a process with a lifecycle; a
  scheduler wakes agents on their schedule and at login; a supervisor retries what fails and stops
  what runs too long; and everything lands in an append-only log.
- **Four agents** that check disk space and downloads, caches, git projects, and Ubuntu and
  Windows updates.
- **An approval queue.** Agents only _propose_ concrete changes; nothing runs without my approval,
  approved changes go to a quarantine that can be undone for 30 days, and rejected ones are not
  proposed again for a month.
- **A desktop app** (Tauri and React) that starts with Windows, boots the kernel in WSL if it is not
  running, sends a notification and lives in the system tray.
- **A local assistant** (Ollama with Qwen 3.5 on the GPU) I can ask in Spanish what is going on
  with the PC. Nothing leaves the computer.

## Key decisions

- **Capabilities, not a shell.** Each agent declares which tools it may use and the kernel denies
  everything else. Tools carry a risk level: reading is free; changing the PC goes through the
  approval queue, and every path is checked again at execution time.
- **Privacy enforced by the tools.** Photos and university documents are forbidden zones; no agent
  can read them, not even to measure their size.
- **Durability tested, not assumed.** The first version used PGlite and a Windows restart corrupted
  the database. I switched to SQLite in WAL mode and added a test that kills the process in the
  middle of thousands of writes: the database always reopens healthy.
- **A model that cannot do harm.** Its output is constrained by a schema to four intents and none of
  them approves or deletes, so a file that "gives orders" is just data. Figures are computed by the
  code, and the summary is checked number by number before it is shown.
- **Choosing with data.** I built an evaluation with expected answers: the 4B model scored 8 out of
  8 in 1.5 seconds and beat the 9B one, so I kept the smaller model.
- **A hardened local API.** The app talks to the kernel with a secret token, Host header validation
  against DNS rebinding and CORS for the app only; the native Rust side runs fixed commands only.

## Outcome

In daily use on my PC. On its first day it helped me free about 64 GB through approvals that can
be undone, without a single error. It has 42 tests in the kernel, 7 in the app, continuous
integration and a 2.4 MB Windows installer.
