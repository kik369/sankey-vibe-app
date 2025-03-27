// For Svelte 5, $state is a special rune for reactivity
// Node interface
export interface Node {
    name: string;
    // d3-sankey adds properties like index, x0, y0 etc.
    [key: string]: any;
}

// Link interface (expecting numbers)
export interface Link {
    source: number; // Index of source node in nodes array
    target: number; // Index of target node in nodes array
    value: number;
    // d3-sankey adds properties like index, y0, y1, width etc.
    [key: string]: any;
}

// Interface for the raw data coming from the spreadsheet
export interface RawLink {
    source: string;
    target: string;
    value: number;
}

export default class DiagramData {
    // Use $state() initializer for reactive state in Svelte 5
    nodes = $state<Node[]>([{ name: 'Start' }, { name: 'End' }]);
    links = $state<Link[]>([{ source: 0, target: 1, value: 10 }]);

    constructor() {
        // Initial state is set via $state() above
    }

    // Method to update nodes and links based on raw spreadsheet data
    updateFromRawData(rawData: RawLink[]): void {
        // Filter out any invalid links (e.g., NaN values, missing source/target)
        const validRawLinks = rawData.filter(
            link =>
                link.source &&
                link.target &&
                !isNaN(link.value) &&
                link.value >= 0
        );

        // Create a unique set of node names from the valid links
        const nodeNames = Array.from(
            new Set(
                validRawLinks.flatMap(link => [link.source, link.target])
            )
        );

        // Update the nodes state directly
        this.nodes = nodeNames.map((name: string) => ({ name }));

        // Create a mapping from node name to its index
        const nodeIndexMap = new Map(
            this.nodes.map((node: Node, index: number) => [node.name, index])
        );

        // Update the links state by mapping names to indices
        this.links = validRawLinks
            .map(link => ({
                source: nodeIndexMap.get(link.source),
                target: nodeIndexMap.get(link.target),
                value: link.value,
            }))
            // Filter out links where source or target name wasn't found (shouldn't happen with the logic above, but good practice)
            .filter(
                link => link.source !== undefined && link.target !== undefined
            ) as Link[]; // Assert type as Link after filtering undefined indices
    }

    // For backward compatibility if needed
    getData(): { nodes: Node[]; links: Link[] } {
        return { nodes: this.nodes, links: this.links };
    }
}
