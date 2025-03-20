# Sankey Vibe App

An interactive application for creating and visualizing Sankey diagrams using Svelte and D3.

## Technologies

-   **[Bun](https://bun.sh)** - JavaScript runtime & package manager
-   **[Vite](https://vitejs.dev/)** - Frontend build tool
-   **[Svelte](https://svelte.dev/)** - Component framework
-   **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
-   **[D3.js](https://d3js.org/)** - Data visualization library
-   **[Handsontable](https://handsontable.com/)** - Spreadsheet component

## Getting Started

### Install dependencies

```bash
bun install
```

### Development workflow

Run the development server with hot-reload:

```bash
bun run dev
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

-   `src/components/` - Svelte components
-   `src/lib/` - Utility classes and functions
-   `src/main.js` - Application entry point
-   `src/App.svelte` - Main application component

## Contributing

See PLAN.md for detailed implementation steps and component structure.

---

This project was created using `bun init` in bun v1.2.5. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
