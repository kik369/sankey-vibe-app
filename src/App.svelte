<script lang="ts">
    import Spreadsheet from './components/Spreadsheet.svelte';
    import SankeyDiagram from './components/SankeyDiagram.svelte';
    import DiagramData from './lib/DiagramData.svelte';
    import ThemeToggle from './components/ThemeToggle.svelte';

    const diagramData = new DiagramData();
</script>

<main
    class="min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-gray-900"
>
    <div
        class="w-full max-w-5xl mx-auto flex justify-between items-center mb-16 px-4"
    >
        <div class="flex items-center">
            <svg
                class="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M14 5H20M20 5V11M20 5L10 15M4 13V19M4 19H10M4 19L8 15"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
            <h1
                class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
            >
                Sankey Vibe!
            </h1>
            <span class="ml-4 text-base text-gray-600 dark:text-gray-400">
                Interactive Flow Visualization
            </span>
        </div>
        <ThemeToggle />
    </div>

    <div class="w-full max-w-5xl mx-auto space-y-12 px-4">
        <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700 transition-shadow duration-300"
        >
            <div
                class="border-b border-gray-200 dark:border-gray-700 pb-5 mb-6"
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
            <div>
                <Spreadsheet {diagramData} />
            </div>
        </div>

        <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700 transition-shadow duration-300"
        >
            <div
                class="border-b border-gray-200 dark:border-gray-700 pb-5 mb-6"
            >
                <h2
                    class="text-xl font-semibold text-gray-800 dark:text-gray-200"
                >
                    Visualization
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1"></p>
            </div>
            <div>
                <SankeyDiagram {diagramData} />
            </div>
        </div>
    </div>

    <footer class="mt-20 py-4 text-center"></footer>
</main>
