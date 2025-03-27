<script lang="ts">
    import Spreadsheet from './components/Spreadsheet.svelte';
    import SankeyDiagram from './components/SankeyDiagram.svelte';
    import DiagramData from './lib/DiagramData.svelte';
    import ThemeToggle from './components/ThemeToggle.svelte';

    const diagramData = new DiagramData();
</script>

<main
    class="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300"
>
    <div
        class="w-full max-w-5xl mx-auto flex justify-between items-center mb-10"
    >
        <div class="flex items-center">
            <h1
                class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
            >
                Sankey Vibe!
            </h1>
            <span class="ml-3 text-sm text-gray-500 dark:text-gray-400">
                Interactive Flow Visualization
            </span>
        </div>
        <ThemeToggle />
    </div>

    <div class="w-full max-w-5xl mx-auto space-y-8">
        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
            <div
                class="border-b border-gray-200 dark:border-gray-700 px-6 py-4"
            >
                <h2
                    class="text-xl font-semibold text-gray-800 dark:text-gray-200"
                >
                    Data Input
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Enter source, target, and value for each connection
                </p>
            </div>
            <div class="p-6">
                <Spreadsheet {diagramData} />
            </div>
        </div>

        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
            <div
                class="border-b border-gray-200 dark:border-gray-700 px-6 py-4"
            >
                <h2
                    class="text-xl font-semibold text-gray-800 dark:text-gray-200"
                >
                    Visualization
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Interactive Sankey diagram showing flow relationships
                </p>
            </div>
            <div class="p-6">
                <SankeyDiagram {diagramData} />
            </div>
        </div>
    </div>

    <footer class="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Hover over nodes and connections for more details</p>
    </footer>
</main>
