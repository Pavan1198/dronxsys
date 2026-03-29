# Drone System

A Vite + React prototype for a futuristic drone defense dashboard. The app includes a landing page, a command center view, animated hero visuals, and simulated drone/telemetry state powered by local mock data.

## Features

- Cinematic landing page with animated hero canvas
- Command center dashboard for fleet status and launch actions
- Simulated telemetry updates with TanStack Query
- Tactical UI built with Tailwind CSS and Radix primitives
- Fully client-side mock data, so no backend is required to preview the experience

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Wouter
- TanStack Query
- Framer Motion

## Getting Started

### Prerequisites

- Node.js 22 or newer
- npm

### Install

```bash
npm install
```

### Run the Dev Server

```bash
npm run dev
```

Open `http://127.0.0.1:5173` in your browser.

### Build for Production

```bash
npm run build
```

### Preview the Production Build

```bash
npm run serve
```

## Available Scripts

- `npm run dev` starts the local development server
- `npm run build` creates the production build in `dist/`
- `npm run serve` previews the production build locally
- `npm run typecheck` runs TypeScript checks

## Project Structure

```text
src/
  components/
    canvas/        Hero animation
    layout/        Shared layout pieces
    ui/            UI primitives
  hooks/           App state and simulated data hooks
  pages/           Route-level screens
  App.tsx          App router and providers
  main.tsx         App entry point
public/
  images/          Visual assets used by the UI
```

## Routes

- `/` overview and marketing-style landing page
- `/command` command center dashboard
- `/swarm` currently mapped to the home page
- `/defense` currently mapped to the home page

## Notes

- The current drone and telemetry data are mocked in `src/hooks/use-drones.ts`.
- The command center is designed to fail gracefully if API-backed data is unavailable in the future.
