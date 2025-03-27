<script lang="ts">
    import Spreadsheet from './components/Spreadsheet.svelte';
    import SankeyDiagram from './components/SankeyDiagram.svelte';
    import DiagramData from './lib/DiagramData.svelte';
    import ThemeToggle from './components/ThemeToggle.svelte';

    const diagramData = new DiagramData();
</script>

<main
    class="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 py-10 transition-colors duration-200 px-4"
>
    <div
        class="w-full max-w-4xl mx-auto flex justify-between items-center mb-8"
    >
        <h1 class="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Sankey Vibe!
        </h1>
        <ThemeToggle />
    </div>

    <div
        class="w-full max-w-4xl mx-auto mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
        <h2 class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Data Input
        </h2>
        <Spreadsheet {diagramData} />
    </div>

    <div
        class="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
        <h2 class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Visualization
        </h2>
        <SankeyDiagram {diagramData} />
    </div>
</main>
