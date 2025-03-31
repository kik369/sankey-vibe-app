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
    import { drag } from 'd3-drag';

    const { diagramData }: { diagramData: DiagramData } = $props();
    let svgRef: SVGSVGElement;
    let svgSelection: d3.Selection<SVGSVGElement, unknown, null, undefined>;

    // Get nodes and links directly from the reactive state
    const nodes = $derived(diagramData.nodes);
    const links = $derived(diagramData.links);

    // Define layout result types
    type LayoutNode = SankeyNode<Node, Link>;
    type LayoutLink = SankeyLink<Node, Link>;

    // Define dimensions with width being responsive
    let width = 1200; // Default width, will be updated based on container
    const height = 800; // Increased from 600 to 800
    const margin = { top: 40, right: 120, bottom: 40, left: 120 }; // Increased top/bottom margins

    // Container reference for measuring available width
    let containerRef: HTMLDivElement;

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
        // Set initial SVG attributes
        svgSelection = d3
            .select(svgRef)
            .attr('height', height)
            .attr('preserveAspectRatio', 'xMinYMid meet');

        // Initial render with responsive sizing
        updateDiagramSize();

        // Add window resize listener
        window.addEventListener('resize', updateDiagramSize);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', updateDiagramSize);
        };
    });

    // Update diagram size based on container width
    function updateDiagramSize() {
        if (!containerRef || !svgSelection) return;

        // Use window width for full viewport width rather than container width
        const viewportWidth = window.innerWidth;

        // Update width to use nearly full viewport width (with small margin)
        width = viewportWidth - 40; // 20px margin on each side

        // Update the SVG viewBox to use the new width
        svgSelection
            .attr('width', width)
            .attr('viewBox', `0 0 ${width} ${height}`);

        // Redraw diagram if we have data
        if (nodes && nodes.length > 0 && links && links.length > 0) {
            renderSankeyDiagram();
        }
    }

    // Separate the diagram rendering logic for reuse
    function renderSankeyDiagram() {
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

        // Create a deep copy for d3-sankey to mutate.
        // d3-sankey modifies the nodes/links objects directly, which would cause
        // errors if done on Svelte's reactive $state proxies.
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

        // Add a group for links
        const linkGroup = svgSelection
            .append('g')
            .attr('class', 'links')
            .attr('fill', 'none')
            .attr('stroke-opacity', 0.4)
            .selectAll('path')
            .data(layoutLinks)
            .join('path')
            .attr('class', 'link')
            .attr('d', sankeyLinkHorizontal())
            .attr('stroke', d => {
                // Use the source node color with reduced opacity for links
                const sourceNode = d.source as LayoutNode;
                return d.value > 0 ? colorScale(sourceNode.name) : '#9CA3AF';
            })
            .attr('stroke-width', d => Math.max(1, d.width ?? 1))
            .attr('stroke-opacity', 0.4);

        // Add titles for tooltips on links
        linkGroup.append('title').text(d => {
            // After layout, source and target are LayoutNode objects
            const sourceNode = d.source as LayoutNode;
            const targetNode = d.target as LayoutNode;
            return `${sourceNode.name} → ${targetNode.name}\nValue: $${d.value}M`;
        });

        // Create a group for each node with dragging behavior
        const nodeGroups = svgSelection
            .append('g')
            .attr('class', 'nodes')
            .attr('stroke', '#000')
            .attr('stroke-opacity', 0.15)
            .selectAll<SVGGElement, LayoutNode>('g')
            .data(layoutNodes)
            .join('g')
            .attr('class', 'node')
            .call(setupDragBehavior);

        // Add rectangles to each node group
        nodeGroups
            .append('rect')
            .attr('x', d => d.x0 ?? 0)
            .attr('y', d => d.y0 ?? 0)
            .attr('height', d => Math.max(1, (d.y1 ?? 0) - (d.y0 ?? 0)))
            .attr('width', d => (d.x1 ?? 0) - (d.x0 ?? 0))
            .attr('fill', d => colorScale(d.name))
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('cursor', 'move');

        // Add titles for tooltips on nodes
        nodeGroups.append('title').text(d => `${d.name}\nValue: $${d.value}M`);

        // Add node labels (text) to each node group
        nodeGroups
            .append('text')
            .attr('font-family', 'system-ui, sans-serif')
            .attr('font-size', 12)
            .attr('font-weight', 600)
            .attr('x', d =>
                (d.x0 ?? 0) < width / 2 ? (d.x1 ?? 0) + 8 : (d.x0 ?? 0) - 8
            )
            .attr('y', d => ((d.y1 ?? 0) + (d.y0 ?? 0)) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d =>
                (d.x0 ?? 0) < width / 2 ? 'start' : 'end'
            )
            .text(d => d.name)
            .attr('fill', 'currentColor')
            .attr('pointer-events', 'none'); // Prevent interfering with drag

        // Add value labels inside nodes
        nodeGroups
            .append('text')
            .attr('font-family', 'system-ui, sans-serif')
            .attr('font-size', 10)
            .attr('font-weight', 'bold')
            .attr('fill', 'white')
            .attr('stroke', 'none')
            .filter(d => (d.y1 ?? 0) - (d.y0 ?? 0) > 14)
            .attr('x', d => ((d.x0 ?? 0) + (d.x1 ?? 0)) / 2)
            .attr('y', d => ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .text(d => `$${(d.value ?? 0).toFixed(0)}M`)
            .attr('pointer-events', 'none'); // Prevent interfering with drag

        // Function to create drag behavior
        function setupDragBehavior(
            selection: d3.Selection<SVGGElement, LayoutNode, any, any>
        ) {
            selection.call(
                drag<SVGGElement, LayoutNode>()
                    .subject(d => d)
                    .on('start', function (event, d) {
                        d3.select(this).raise().attr('opacity', 0.7);
                    })
                    .on('drag', function (event, d) {
                        // Only allow vertical movement (within reasonable bounds)
                        const originalHeight = (d.y1 ?? 0) - (d.y0 ?? 0);
                        const newY = Math.max(
                            margin.top,
                            Math.min(
                                height - margin.bottom - originalHeight,
                                event.y
                            )
                        );

                        // Calculate the vertical shift
                        const deltaY = newY - (d.y0 ?? 0);

                        // Update node position
                        d.y0 = newY;
                        d.y1 = newY + originalHeight;

                        // Update the visual position of this node
                        const nodeGroup = d3.select(this);
                        nodeGroup.select('rect').attr('y', d.y0);

                        nodeGroup
                            .select('text:first-of-type')
                            .attr('y', ((d.y1 ?? 0) + (d.y0 ?? 0)) / 2);

                        nodeGroup
                            .select('text:nth-of-type(2)')
                            .attr('y', ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2);

                        // Update all links to and from this node
                        const nodeIndex = d.index;

                        // Find all connected links and update them
                        svgSelection
                            .selectAll<SVGPathElement, LayoutLink>('.link')
                            .each(function (link) {
                                const source = link.source as LayoutNode;
                                const target = link.target as LayoutNode;

                                if (source.index === nodeIndex) {
                                    // This is a source link - update y0 coordinates
                                    link.y0 =
                                        (source.y0 ?? 0) +
                                        ((source.y1 ?? 0) - (source.y0 ?? 0)) /
                                            2;
                                } else if (target.index === nodeIndex) {
                                    // This is a target link - update y1 coordinates
                                    link.y1 =
                                        (target.y0 ?? 0) +
                                        ((target.y1 ?? 0) - (target.y0 ?? 0)) /
                                            2;
                                }
                            })
                            .attr('d', sankeyLinkHorizontal());

                        // Update link label positions
                        svgSelection
                            .selectAll<SVGTextElement, LayoutLink>(
                                '.link-labels text'
                            )
                            .filter(link => {
                                const source = link.source as LayoutNode;
                                const target = link.target as LayoutNode;
                                return (
                                    source.index === nodeIndex ||
                                    target.index === nodeIndex
                                );
                            })
                            .attr('y', d => (d.y0 ?? 0) - 3);

                        // Also update the background of the link labels
                        svgSelection
                            .selectAll<SVGTextElement, LayoutLink>(
                                '.link-labels text + text'
                            )
                            .filter(link => {
                                const source = link.source as LayoutNode;
                                const target = link.target as LayoutNode;
                                return (
                                    source.index === nodeIndex ||
                                    target.index === nodeIndex
                                );
                            })
                            .attr('y', d => (d.y0 ?? 0) - 3);
                    })
                    .on('end', function (event, d) {
                        d3.select(this).attr('opacity', 1);

                        // Get current node positions to preserve after layout recalculation
                        const nodePositions = new Map<
                            number,
                            { y0: number; y1: number }
                        >();
                        layoutNodes.forEach(node => {
                            nodePositions.set(node.index as number, {
                                y0: node.y0 ?? 0,
                                y1: node.y1 ?? 0,
                            });
                        });

                        // Recalculate layout to ensure proper link positions
                        sankeyLayout.update(layoutResult);

                        // Restore custom node positions
                        layoutNodes.forEach(node => {
                            const savedPos = nodePositions.get(
                                node.index as number
                            );
                            if (savedPos) {
                                node.y0 = savedPos.y0;
                                node.y1 = savedPos.y1;
                            }
                        });

                        // Update all visual elements with new positions
                        svgSelection
                            .selectAll<SVGRectElement, LayoutNode>('.node rect')
                            .attr('y', d => d.y0 ?? 0)
                            .attr('height', d =>
                                Math.max(1, (d.y1 ?? 0) - (d.y0 ?? 0))
                            );

                        svgSelection
                            .selectAll<
                                SVGTextElement,
                                LayoutNode
                            >('.node text:first-of-type')
                            .attr('y', d => ((d.y1 ?? 0) + (d.y0 ?? 0)) / 2);

                        svgSelection
                            .selectAll<
                                SVGTextElement,
                                LayoutNode
                            >('.node text:nth-of-type(2)')
                            .attr('y', d => ((d.y0 ?? 0) + (d.y1 ?? 0)) / 2);

                        // Update all links
                        svgSelection
                            .selectAll<SVGPathElement, LayoutLink>('.link')
                            .attr('d', sankeyLinkHorizontal());

                        // Update link labels
                        svgSelection
                            .selectAll<SVGTextElement, LayoutLink>(
                                '.link-labels text'
                            )
                            .attr(
                                'x',
                                d =>
                                    (((d.source as LayoutNode).x1 ?? 0) +
                                        ((d.target as LayoutNode).x0 ?? 0)) /
                                    2
                            )
                            .attr('y', d => (d.y0 ?? 0) - 3);
                    })
            );
        }

        // Add link value labels (near the center of the links)
        const linkLabelGroup = svgSelection
            .append('g')
            .attr('class', 'link-labels')
            .attr('font-family', 'system-ui, sans-serif')
            .attr('font-size', 9)
            .attr('fill', 'currentColor')
            .attr('stroke', 'none')
            .selectAll('text')
            .data(layoutLinks.filter(d => (d.width ?? 0) >= 1 && d.value > 0))
            .join('text')
            .attr(
                'x',
                d =>
                    (((d.source as LayoutNode).x1 ?? 0) +
                        ((d.target as LayoutNode).x0 ?? 0)) /
                    2
            )
            .attr('y', d => (d.y0 ?? 0) - 3)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .text(d => `$${(d.value ?? 0).toFixed(0)}M`);

        // Add a subtle background to link labels for better readability
        linkLabelGroup
            .clone(true)
            .lower()
            .attr('stroke', 'var(--diagram-background, #ffffff)')
            .attr('stroke-width', 2.5)
            .attr('stroke-linejoin', 'round');
    }

    // Add reactive effect to call renderSankeyDiagram when data changes
    $effect(() => {
        if (svgSelection && nodes && links) {
            renderSankeyDiagram();
        }
    });
</script>

<div class="full-width-container">
    <div
        bind:this={containerRef}
        class="min-h-[800px] flex items-center justify-center bg-white dark:bg-gray-900"
        style="--diagram-background: {$themeStore === 'dark'
            ? '#1f2937'
            : '#ffffff'};"
    >
        <svg bind:this={svgRef} class="w-full h-full px-6"></svg>
    </div>
</div>

<style>
    /* Full width container that breaks out of parent constraints */
    .full-width-container {
        width: 100vw;
        position: relative;
        left: 50%;
        right: 50%;
        margin-left: -50vw;
        margin-right: -50vw;
        margin-bottom: 2rem;
    }
</style>
