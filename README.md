# Sankey Vibe App

This project is a web application built with Svelte, Vite, TypeScript, and Tailwind CSS. It utilizes D3.js, specifically the `d3-sankey` module, for creating Sankey diagrams and Handsontable for spreadsheet-like data input.

## Project Structure

```
.
├── .git/             # Git repository files
├── node_modules/     # Project dependencies (managed by Bun)
├── src/              # Source code
│   ├── components/   # Reusable Svelte components
│   ├── lib/          # Utility functions or libraries
│   ├── types/        # TypeScript type definitions
│   ├── App.svelte    # Main application component
│   ├── main.ts       # Application entry point
│   └── styles.css    # Global styles (Tailwind base/components/utilities imported here)
├── .gitignore        # Files and directories ignored by Git
├── bun.lockb         # Bun lockfile for dependency management
├── index.html        # Main HTML file
├── package.json      # Project metadata and dependencies
├── postcss.config.js # PostCSS configuration
├── README.md         # This file
├── svelte.config.js  # Svelte configuration
├── tailwind.config.js# Tailwind CSS configuration
├── tsconfig.json     # TypeScript configuration
└── vite.config.ts    # Vite configuration
```

## Technologies Used

-   **Framework:** Svelte 5
-   **Build Tool:** Vite
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS, PostCSS
-   **Charting:** D3.js (`d3`, `d3-sankey`)
-   **Data Input:** Handsontable
-   **Package Manager:** Bun

## Getting Started

**Prerequisites:**

-   Bun installed (see [Bun installation guide](https://bun.sh/docs/installation))

**Installation:**

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd sankey-vibe-app
    ```
2.  Install dependencies using Bun:
    ```bash
    bun install
    ```

**Running the Development Server:**

```bash
bun run dev
```

This command starts the Vite development server.

**Important Note for AI Assistants:** The development server uses Vite's Hot Module Replacement (HMR). This means that **changes made to the source code (e.g., `.svelte`, `.ts` files) will be reflected in the running application automatically without needing to restart the server.**

**Building for Production:**

```bash
bun run build
```

This command creates an optimized production build in the `dist/` directory.

**Previewing the Production Build:**

```bash
bun run preview
```

This command serves the production build locally.

## Linting and Type Checking

```bash
bun run check
```

This command uses `svelte-check` to perform type checking based on the `tsconfig.json` configuration.

## AI Assistant Guidance

-   **Primary Goal:** Visualize data flows using a Sankey diagram based on user input from a Handsontable interface.
-   **Key Components:**
    -   `src/App.svelte`: Orchestrates the main application layout and data flow between input and visualization.
    -   `src/components/`: Contains UI elements, likely including the Handsontable wrapper and the D3 Sankey chart component.
    -   `src/lib/`: May contain data processing logic for transforming Handsontable data into the format required by `d3-sankey`.
-   **Data Flow:** User inputs data into Handsontable -> Data is processed (likely in `src/lib/` or `App.svelte`) -> Processed data is passed to the Sankey component -> D3 renders the Sankey diagram.
-   **Remember:** Use `bun` for all package management and script execution. The dev server has hot reload enabled.
