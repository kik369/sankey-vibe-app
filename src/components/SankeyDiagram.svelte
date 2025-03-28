<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import {
        sankey as d3Sankey,
        sankeyLinkHorizontal,
        type SankeyNode,
        type SankeyLink,
    } from 'd3-sankey';
    import type DiagramData from '@/lib/DiagramData.svelte';
    // Import Node and Link types
    import type { Node, Link } from '@/lib/DiagramData.svelte';
    // Import theme store
    import { themeStore } from '@/lib/theme.svelte';
    // Add these imports for the color scale
    import { scaleOrdinal } from 'd3-scale';
    import { schemeCategory10 } from 'd3-scale-chromatic';

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
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };

    // Create a color scale for nodes with better color scheme
    const colorScale = scaleOrdinal([
        '#3b82f6', // blue-500
        '#6366f1', // indigo-500
        '#8b5cf6', // violet-500
        '#ec4899', // pink-500
        '#ef4444', // red-500
        '#f97316', // orange-500
        '#f59e0b', // amber-500
        '#10b981', // emerald-500
    ]);

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
            // Remove nodeId to use default index-based node identification
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
            .attr('stroke-opacity', 0.4) // Reduced opacity
            .selectAll('g')
            .data(layoutLinks)
            .join('g')
            .style('mix-blend-mode', 'multiply');

        linkGroup
            .append('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('stroke', d => {
                // Use the source node color with reduced opacity for links
                const sourceNode = d.source as LayoutNode;
                return d.value > 0 ? colorScale(sourceNode.name) : '#9CA3AF';
            })
            .attr('stroke-width', d => Math.max(1, d.width ?? 1))
            .attr('stroke-opacity', 0.4); // Reduced from 0.5 for a more subtle look

        // Add titles for tooltips on links
        linkGroup.append('title').text(d => {
            // After layout, source and target are LayoutNode objects
            const sourceNode = d.source as LayoutNode;
            const targetNode = d.target as LayoutNode;
            return `${sourceNode.name} → ${targetNode.name}\nValue: ${d.value}`;
        });

        // Add nodes (rectangles)
        const nodeGroup = svgSelection
            .append('g')
            .attr('stroke', '#000')
            .attr('stroke-opacity', 0.15) // Reduced from 0.5 for a more subtle border
            .selectAll('rect')
            .data(layoutNodes)
            .join('rect')
            .attr('x', d => d.x0 ?? 0)
            .attr('y', d => d.y0 ?? 0)
            .attr('height', d => Math.max(1, (d.y1 ?? 0) - (d.y0 ?? 0)))
            .attr('width', d => (d.x1 ?? 0) - (d.x0 ?? 0))
            .attr('fill', d => colorScale(d.name))
            .attr('rx', 4) // Add rounded corners to nodes
            .attr('ry', 4);

        // Add titles for tooltips on nodes
        nodeGroup.append('title').text(d => `${d.name}\nValue: ${d.value}`); // d.value is calculated by d3-sankey

        // Add node labels (text)
        svgSelection
            .append('g')
            .attr('font-family', 'system-ui, sans-serif')
            .attr('font-size', 12) // Larger font
            .attr('font-weight', 600) // Semi-bold for better readability
            .selectAll('text')
            .data(layoutNodes)
            .join('text')
            .attr('x', d =>
                (d.x0 ?? 0) < width / 2 ? (d.x1 ?? 0) + 8 : (d.x0 ?? 0) - 8
            )
            .attr('y', d => ((d.y1 ?? 0) + (d.y0 ?? 0)) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d =>
                (d.x0 ?? 0) < width / 2 ? 'start' : 'end'
            )
            .text(d => d.name)
            .attr('fill', 'currentColor'); // This ensures text matches the theme color
    });
</script>

<div class="w-full overflow-x-auto">
    <div class="min-h-[400px] flex items-center justify-center">
        <svg bind:this={svgRef} class="w-full h-full min-w-[800px] max-w-full"
        ></svg>
    </div>
</div>
