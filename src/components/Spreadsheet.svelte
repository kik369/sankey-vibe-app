<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Handsontable from 'handsontable';
    import 'handsontable/dist/handsontable.full.min.css';
    import type DiagramData from '@/lib/DiagramData';

    const { diagramData }: { diagramData: DiagramData } = $props();
    let container: HTMLDivElement;
    let hot: Handsontable | null = null;

    onMount(() => {
        if (!container) return;

        hot = new Handsontable(container, {
            data: [
                ['A', 'B', 10],
                ['B', 'C', 5],
                ['B', 'D', 5],
            ],
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

        const initialRawData = (hot.getData() as Array<Array<string | number>>)
            .filter(row => row[0] != null && row[1] != null && row[2] != null)
            .map(([source, target, value]) => ({
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
    });
</script>

<div
    bind:this={container}
    class="w-full border border-gray-300 rounded shadow"
></div>
