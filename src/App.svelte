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

    <div class="w-full max-w-6xl mx-auto space-y-12 px-4">
        <div class="mb-8">
            <div
                class="border-b border-gray-200 dark:border-gray-700 pb-5 mb-6 flex justify-between items-center"
            >
                <h2
                    class="text-xl font-semibold text-gray-800 dark:text-gray-200"
                >
                    Data Input
                </h2>
                <div class="relative group">
                    <button
                        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                        aria-label="View instructions"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                    <div
                        class="absolute right-0 w-64 p-4 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 z-10 border border-gray-200 dark:border-gray-700"
                    >
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                            <h3 class="font-semibold mb-2">Instructions:</h3>
                            <ul class="list-disc pl-4 space-y-1">
                                <li>
                                    Enter source and target names for each flow
                                    connection
                                </li>
                                <li>
                                    Use numeric values for the flow magnitude
                                </li>
                                <li>
                                    Add rows as needed for additional
                                    connections
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Spreadsheet {diagramData} />
            </div>
        </div>

        <div class="mb-8">
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
