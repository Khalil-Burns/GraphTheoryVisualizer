class Examples {
    static loadExample(example) {
        var graph;
        var maxID = 0;
        switch (example) {
            case 'kruskals':
                var rand = Math.floor(Math.random() * mstExamples.length);
                graph = mstExamples[rand];
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