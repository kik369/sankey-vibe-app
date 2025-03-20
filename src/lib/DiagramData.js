export default class DiagramData {
    constructor() {
        this.data = {
            nodes: [{ name: 'Start' }, { name: 'End' }],
            links: [{ source: 0, target: 1, value: 10 }],
        };
    }

    updateLinks(newLinks) {
        this.data.links = newLinks;
    }
    updateNodes(newNodes) {
        this.data.nodes = newNodes;
    }
    getData() {
        return this.data;
    }
}
