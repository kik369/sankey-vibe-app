<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import {
        sankey as d3Sankey,
        sankeyLinkHorizontal,
        type SankeyNode,
        type SankeyLink,
    } from 'd3-sankey';
    import type DiagramData from '@/lib/DiagramData';
    // Import Node and Link types
    import type { Node, Link } from '@/lib/DiagramData';

    const { diagramData }: { diagramData: DiagramData } = $props();
    let svgRef: SVGSVGElement;
    let svgSelection: d3.Selection<SVGSVGElement, unknown, null, undefined>;

    // Get nodes and links directly from the reactive state
    const nodes = $derived(diagramData.nodes);
    const links = $derived(diagramData.links);

    // Define layout result types
    type LayoutNode = SankeyNode<Node, Link>;
    type LayoutLink = SankeyLink<Node, Link>;

    // Define dimensions
    const width = 800;
    const height = 400;
    const margin = { top: 10, right: 100, bottom: 10, left: 100 };

    onMount(() => {
        svgSelection = d3
            .select(svgRef)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('style', 'max-width: 100%; height: auto;');
    });

    $effect(() => {
        // Ensure svgSelection is initialized and we have valid data
        if (!svgSelection || !nodes || !links || nodes.length === 0) {
            if (svgSelection) svgSelection.selectAll('*').remove(); // Clear SVG if no data
            return;
        }

        // Filter out links with invalid values just in case
        const validLinks = links.filter(d => d.value >= 0 && !isNaN(d.value));
        if (validLinks.length === 0) {
            // Handle case with nodes but no valid links
            if (svgSelection) svgSelection.selectAll('*').remove();
            return;
        }

        // Create a deep copy for d3-sankey to mutate without affecting Svelte's state directly
        const graphData = {
            nodes: nodes.map(d => ({ ...d })),
            links: validLinks.map(d => ({ ...d })),
        };

        // Clear previous SVG content before drawing new one
        svgSelection.selectAll('*').remove();

        // Specify Node and Link types for d3Sankey
        const sankeyLayout = d3Sankey<Node, Link>()
            .nodeId(d => d.name) // d is now typed as Node
            .nodeWidth(15)
            .nodePadding(10)
            // Adjust extent based on margins
            .extent([
                [margin.left, margin.top],
                [width - margin.right, height - margin.bottom],
            ]);

        // Type the layout result
        let layoutResult: { nodes: LayoutNode[]; links: LayoutLink[] };
        try {
            layoutResult = sankeyLayout(graphData);
        } catch (error) {
            console.error('Error computing Sankey layout:', error);
            // Optionally display an error message to the user in the SVG
            svgSelection
                .append('text')
                .attr('x', width / 2)
                .attr('y', height / 2)
                .attr('text-anchor', 'middle')
                .text(
                    'Error generating diagram. Check data for circular links or errors.'
                );
            return; // Stop execution if layout fails
        }

        const { nodes: layoutNodes, links: layoutLinks } = layoutResult;

        // Add links (paths)
        const linkGroup = svgSelection
            .append('g')
            .attr('fill', 'none')
            .attr('stroke-opacity', 0.5)
            .selectAll('g') // Select groups for hover effects later
            .data(layoutLinks)
            .join('g') // Use join for enter/update/exit
            .style('mix-blend-mode', 'multiply'); // Blending mode for overlapping links

        linkGroup
            .append('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('stroke', d => (d.value > 0 ? '#3B82F6' : '#9CA3AF')) // Color based on value
            .attr('stroke-width', d => Math.max(1, d.width ?? 1)); // Use d.width from layout

        // Add titles for tooltips on links
        // Using a simpler approach - after layout computation, source and target in d3-sankey are objects
        linkGroup.append('title').text(d => {
            // Cast to any to avoid TypeScript errors - we know the structure
            const sourceNode = d.source as any;
            const targetNode = d.target as any;
            return `${sourceNode.name} → ${targetNode.name}\nValue: ${d.value}`;
        });

        // Add nodes (rectangles)
        const nodeGroup = svgSelection
            .append('g')
            .attr('stroke', '#000') // Node border color
            .attr('stroke-opacity', 0.5)
            .selectAll('rect')
            .data(layoutNodes)
            .join('rect')
            .attr('x', d => d.x0 ?? 0)
            .attr('y', d => d.y0 ?? 0)
            .attr('height', d => Math.max(1, (d.y1 ?? 0) - (d.y0 ?? 0))) // Ensure height is positive
            .attr('width', d => (d.x1 ?? 0) - (d.x0 ?? 0)) // Use layout width
            .attr('fill', '#60A5FA'); // Node fill color

        // Add titles for tooltips on nodes
        nodeGroup.append('title').text(d => `${d.name}\nValue: ${d.value}`); // d.value is calculated by d3-sankey

        // Add node labels (text)
        svgSelection
            .append('g')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 10)
            .selectAll('text')
            .data(layoutNodes)
            .join('text')
            .attr('x', d =>
                (d.x0 ?? 0) < width / 2 ? (d.x1 ?? 0) + 6 : (d.x0 ?? 0) - 6
            ) // Position left/right
            .attr('y', d => ((d.y1 ?? 0) + (d.y0 ?? 0)) / 2) // Center vertically
            .attr('dy', '0.35em')
            .attr('text-anchor', d =>
                (d.x0 ?? 0) < width / 2 ? 'start' : 'end'
            ) // Anchor left/right
            .text(d => d.name);
    });
</script>

<svg
    bind:this={svgRef}
    class="w-full border border-gray-200 rounded shadow-inner bg-white"
></svg>
