<script>
    import Spreadsheet from './components/Spreadsheet.svelte';
    import SankeyDiagram from './components/SankeyDiagram.svelte';
    import DiagramData from './lib/DiagramData.js';

    const diagramData = new DiagramData();
</script>

<main
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100"
>
    <h1 class="text-3xl font-bold mb-8">Hello, Sankey Vibe!</h1>
    <Spreadsheet {diagramData} />
    <SankeyDiagram {diagramData} />
</main>
