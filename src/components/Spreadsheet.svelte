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

        // Force Handsontable to redraw with new theme
        hot.render();

        // Optional: Update some settings based on theme
        if (theme === 'dark') {
            // Apply any dark theme specific settings
            container.classList.add('hot-dark-theme');
        } else {
            container.classList.remove('hot-dark-theme');
        }
    }

    // Better initial example data
    const initialData = [
        ['Product A', 'Process 1', 15],
        ['Product A', 'Process 2', 10],
        ['Process 1', 'Process 3', 8],
        ['Process 2', 'Output', 7],
        ['Process 3', 'Output', 12],
    ];

    onMount(() => {
        if (!container) return;

        // Add custom CSS to style Handsontable in both themes
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            /* Light theme styles */
            .handsontable {
                font-size: 14px;
                font-family: system-ui, sans-serif;
            }

            /* Headers */
            .ht_clone_top th, .ht_clone_left th {
                background-color: #EEF2FF !important;
                color: #4F46E5 !important;
                font-weight: 600 !important;
            }

            /* Dark theme adjustments */
            .dark .ht_clone_top th, .dark .ht_clone_left th {
                background-color: #312E81 !important;
                color: #C7D2FE !important;
            }

            .dark .handsontable td {
                color: #E5E7EB !important;
                background-color: #1F2937 !important;
            }

            .dark .handsontable tr:hover td {
                background-color: #374151 !important;
            }

            .dark .handsontable .current {
                background-color: rgba(79, 70, 229, 0.2) !important;
            }
        `;
        document.head.appendChild(styleElement);

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
                        pattern: '0,0.00',
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
        class="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-sm"
    >
        <p class="font-medium text-gray-800 dark:text-gray-200">
            Instructions:
        </p>
        <ul class="list-disc list-inside mt-2 space-y-1.5">
            <li>Enter source and target names for each flow connection</li>
            <li>Use numeric values for the flow magnitude</li>
            <li>Add rows as needed for additional connections</li>
        </ul>
    </div>

    <div
        bind:this={container}
        class="w-full rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200"
    ></div>
</div>

<style>
    /* Moving global styles to src/styles.css for better organization */
</style>
