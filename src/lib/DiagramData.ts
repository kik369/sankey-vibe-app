interface Node {
    name: string;
}

interface Link {
    source: number;
    target: number;
    value: number;
}

interface DiagramDataStructure {
    nodes: Node[];
    links: Link[];
}

export default class DiagramData {
    private data: DiagramDataStructure;

    constructor() {
        this.data = {
            nodes: [{ name: 'Start' }, { name: 'End' }],
            links: [{ source: 0, target: 1, value: 10 }],
        };
    }

    updateLinks(newLinks: Link[]): void {
        this.data.links = newLinks;
    }

    updateNodes(newNodes: Node[]): void {
        this.data.nodes = newNodes;
    }

    getData(): DiagramDataStructure {
        return this.data;
    }
}
