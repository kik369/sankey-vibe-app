# Sankey Vibe App

An interactive application for creating and visualizing Sankey diagrams using Svelte and D3, built with TypeScript.

## Technologies

-   **[TypeScript](https://www.typescriptlang.org/)** - Strongly typed programming language
-   **[Bun](https://bun.sh)** - JavaScript/TypeScript runtime & package manager
-   **[Vite](https://vitejs.dev/)** - Frontend build tool
-   **[Svelte](https://svelte.dev/)** - Component framework
-   **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
-   **[D3.js](https://d3js.org/)** - Data visualization library
-   **[d3-sankey](https://github.com/d3/d3-sankey)** - D3 plugin for Sankey diagrams
-   **[Handsontable](https://handsontable.com/)** - Spreadsheet component

## Getting Started

### Install dependencies

```bash
bun install
```

### Development workflow

Run the development server with hot-reload:

```bash
bun run vite
```

This will start a Vite development server that automatically reloads when you make changes to your code.

### Build for production

```bash
bun run build
```

### Preview production build

```bash
bun run preview
```

### Run once (without hot-reload)

```bash
bun run index.ts
```

## Project Structure

The project follows the structure outlined in the PLAN.md file:

-   `src/components/` - Svelte components with TypeScript
-   `src/lib/` - TypeScript utility classes and functions
-   `src/main.ts` - Application entry point
-   `src/App.svelte` - Main application component
