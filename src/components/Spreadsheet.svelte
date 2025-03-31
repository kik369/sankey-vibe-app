<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Handsontable from 'handsontable';
    import 'handsontable/dist/handsontable.full.min.css';
    import type DiagramData from '@/lib/DiagramData.svelte';
    import { themeStore } from '@/lib/theme.svelte';

    const { diagramData }: { diagramData: DiagramData } = $props();
    let container: HTMLDivElement;
    let hot: Handsontable | null = null;
    let unsubscribe: (() => void) | undefined;

    // Add theme change handler
    function updateHotTheme(theme: string) {
        if (!hot) return;

        // Force Handsontable to redraw with new theme styling from global CSS
        hot.render();
    }

    // Better initial example data
    const initialData = [
        ['Product A', 'Revenue', 35],
        ['Product B', 'Revenue', 10],
        ['Product C', 'Revenue', 5],
        ['Revenue', 'Gross profit', 30],
        ['Revenue', 'Cost of revenue', 20],
        ['Gross profit', 'Operating profit', 15],
        ['Gross profit', 'Operating expenses', 15],
        ['Operating profit', 'Net profit', 10],
        ['Operating profit', 'Tax', 5],
    ];

    onMount(() => {
        if (!container) return;

        hot = new Handsontable(container, {
            data: initialData,
            colHeaders: ['Source', 'Target', 'Value'],
            rowHeaders: true,
            licenseKey: 'non-commercial-and-evaluation',
            contextMenu: true,
            manualRowMove: true,
            manualColumnMove: true,
            autoWrapRow: true,
            autoWrapCol: true,
            minSpareRows: 1,
            width: '100%',
            height: 'auto',
            stretchH: 'all',
            // New settings for better visualization
            className: 'htCenter',
            rowHeights: 30,
            colWidths: [150, 150, 100],
            columns: [
                { type: 'text' },
                { type: 'text' },
                {
                    type: 'numeric',
                    numericFormat: {
                        pattern: '0,0',
                        culture: 'en-US',
                    },
                },
            ],
            cells: function (row, col) {
                const cellProperties: { className?: string } = {};
                if (col === 2) {
                    // Value column
                    cellProperties.className = 'htRight';
                }
                return cellProperties;
            },

            afterChange: (changes, source) => {
                if (source === 'loadData') {
                    return;
                }

                if (changes && hot) {
                    const rawData = hot
                        .getData()
                        .filter(
                            row =>
                                row[0] != null &&
                                row[1] != null &&
                                row[2] != null
                        )
                        .map(([source, target, value]) => ({
                            source: String(source),
                            target: String(target),
                            value: parseFloat(String(value)),
                        }));

                    diagramData.updateFromRawData(rawData);
                }
            },
        });

        // Add theme subscription
        unsubscribe = themeStore.subscribe(updateHotTheme);

        // Process initial data
        const initialRawData = initialData.map(([source, target, value]) => ({
            source: String(source),
            target: String(target),
            value: parseFloat(String(value)),
        }));
        diagramData.updateFromRawData(initialRawData);
    });

    onDestroy(() => {
        if (hot) {
            hot.destroy();
        }
        // Clean up subscription
        if (typeof unsubscribe === 'function') {
            unsubscribe();
        }
    });
</script>

<div class="space-y-6">
    <div
        bind:this={container}
        class="w-full rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200"
    ></div>
</div>

<style>
    /* Moving global styles to src/styles.css for better organization */
</style>
