<script>
    import { onMount } from 'svelte';
    import Handsontable from 'handsontable';
    import 'handsontable/dist/handsontable.full.min.css';

    const { diagramData } = $props();
    let container;

    onMount(() => {
        const hot = new Handsontable(container, {
            data: [['Start', 'End', 10]],
            colHeaders: ['Source', 'Target', 'Value'],
            rowHeaders: true,
            licenseKey: 'non-commercial-and-evaluation',

            afterChange: changes => {
                if (changes) {
                    const links = hot
                        .getData()
                        .map(([source, target, value]) => ({
                            source,
                            target,
                            value: +value,
                        }));

                    const nodes = Array.from(
                        new Set(
                            links.flatMap(link => [link.source, link.target])
                        )
                    ).map(name => ({ name }));

                    diagramData.updateNodes(nodes);
                    diagramData.updateLinks(links);
                }
            },
        });
    });
</script>

<div bind:this={container} class="w-3/4 mx-auto mb-8"></div>
