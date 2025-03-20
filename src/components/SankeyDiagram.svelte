<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

    export let diagramData;
    let svg;

    let data;
    $: data = diagramData.getData();

    onMount(() => {
        const width = 600,
            height = 300;
        const svgEl = d3
            .select(svg)
            .attr('width', width)
            .attr('height', height);

        $: if (data) {
            svgEl.selectAll('*').remove();

            const sankeyGenerator = sankey()
                .nodeWidth(20)
                .nodePadding(10)
                .extent([
                    [1, 1],
                    [width - 1, height - 5],
                ]);

            const { nodes, links } = sankeyGenerator({ ...data });

            svgEl
                .append('g')
                .selectAll('rect')
                .data(nodes)
                .enter()
                .append('rect')
                .attr('x', d => d.x0)
                .attr('y', d => d.y0)
                .attr('height', d => d.y1 - d.y0)
                .attr('width', sankeyGenerator.nodeWidth())
                .attr('fill', '#60A5FA');

            svgEl
                .append('g')
                .selectAll('path')
                .data(links)
                .enter()
                .append('path')
                .attr('d', sankeyLinkHorizontal())
                .attr('stroke', '#3B82F6')
                .attr('stroke-width', d => Math.max(1, d.width))
                .attr('fill', 'none')
                .attr('opacity', 0.5);
        }
    });
</script>

<svg bind:this={svg} class="w-3/4 mx-auto"></svg>
