class Examples {

    static weightedConnectedExamples = [weightedConnectedExample1, weightedConnectedExample2];
    static allExamples = [weightedConnectedExample1, weightedConnectedExample2, unweightedConnectedExample1, unweightedTreeExample1];

    static loadExample(example) {
        var graph;
        var maxID = 0;
        switch (example) {
            case 'kruskals':
                var rand = Math.floor(Math.random() * this.weightedConnectedExamples.length);
                graph = this.weightedConnectedExamples[rand];
                break;
            case 'dfs':
            case 'bfs':
                var rand = Math.floor(Math.random() * this.allExamples.length);
                graph = this.allExamples[rand];
                break;
            default:
                break;
        }
        resetNodes();

        for (var i in graph) {
            createNode(graph[i]['x'], graph[i]['y'], graph[i]['vX'], graph[i]['vY'], graph[i]['connections'], graph[i]['radius'], graph[i]['states'], graph[i]['ID']);
            // nodes.push(new Node(graph[i]['x'], graph[i]['y'], graph[i]['vX'], graph[i]['vY'], graph[i]['connections'], graph[i]['radius'], graph[i]['states'], graph[i]['ID']))
            adjMat[graph[i]['ID']] = {}
            maxID = Math.max(maxID, graph[i]['ID']);

            for (var connection in graph[i]['connections']) {
                adjMat[graph[i]['ID']][connection] = graph[i]['connections'][connection]['weight'];
            }
        }
        nodesNum = maxID + 1
    }
}