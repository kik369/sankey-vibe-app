<script lang="ts">
    import Spreadsheet from './components/Spreadsheet.svelte';
    import SankeyDiagram from './components/SankeyDiagram.svelte';
    import DiagramData from './lib/DiagramData.svelte';

    const diagramData = new DiagramData();
</script>

<main
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10"
>
    <h1 class="text-3xl font-bold mb-8 text-blue-600">Sankey Vibe!</h1>
    <!-- Spreadsheet component -->
    <div class="w-full max-w-4xl mb-8 px-4">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Data Input</h2>
        <Spreadsheet {diagramData} />
    </div>
    <!-- Sankey Diagram component -->
    <div class="w-full max-w-4xl px-4">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Visualization</h2>
        <SankeyDiagram {diagramData} />
    </div>
</main>
