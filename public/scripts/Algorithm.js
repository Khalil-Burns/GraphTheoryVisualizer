class Algorithm {

    static running = false;

    constructor(type) {
        this.type = type;
        this.complete = false;

        if (this.type == 'bfs') {
            this.bfsQueue = [curSelected];
            this.bfsVisited = {}; this.bfsVisited[curSelected] = true;
            this.steps = [{"queued": curSelected}];
            this.bfs();
        }
        else if (this.type == 'dfs') {
            this.dfsVisited = {}; this.dfsVisited[curSelected] = true;
            this.steps = [];
            this.dfs(curSelected, null);
        }
    }
    step() {
        if (this.steps.length <= 0) {
            this.complete = true;
            return;
        }

        for (var step in this.steps[0]) {
            switch (step) {
                case 'queueEdge':
                    nodes[this.steps[0][step]['from']].connections[this.steps[0][step]['to']]['color'] = Node.EDGE_COLOUR_QUEUED;
                    if (adjMat[this.steps[0][step]['to']][this.steps[0][step]['from']] != null) {
                        nodes[this.steps[0][step]['to']].connections[this.steps[0][step]['from']]['color'] = Node.EDGE_COLOUR_QUEUED;
                    }
                    break;
                case 'defaultEdge':
                    nodes[this.steps[0][step]['from']].connections[this.steps[0][step]['to']]['color'] = Node.EDGE_COLOUR_DEFAULT;
                    if (adjMat[this.steps[0][step]['to']][this.steps[0][step]['from']] != null) {
                        nodes[this.steps[0][step]['to']].connections[this.steps[0][step]['from']]['color'] = Node.EDGE_COLOUR_DEFAULT;
                    }
                    break;
                case 'queued':
                    nodes[this.steps[0][step]].states[step] = true;
                    break;
                case 'visiting':
                    if (nodes[this.steps[0][step]].states['queued']) {
                        delete nodes[this.steps[0][step]].states['queued'];
                    }
                    nodes[this.steps[0][step]].states[step] = true;
                    break;
                case 'visited':
                    if (nodes[this.steps[0][step]].states['visiting']) {
                        delete nodes[this.steps[0][step]].states['visiting'];
                    }
                    nodes[this.steps[0][step]].states[step] = true;
                    break;
                default:
                    nodes[this.steps[0][step]].states[step] = true;
                    break;
            }
        }
        this.steps.shift();
    }

    bfs() {
        while (!this.bfsQueue.length <= 0) {
            this.steps.push({"visiting": this.bfsQueue[0]});
            
            var connectionCnt = 0;
            for (var node in adjMat[this.bfsQueue[0]]) {
                if (this.bfsVisited[node]) {
                    continue;
                }
                this.bfsVisited[node] = true;
                this.bfsQueue.push(node);
                if (connectionCnt == 0) { //edge removals are stored ahead, but there will be none stored ahead if this is the first visited node
                    this.steps.push({"queued": node});
                }
                else {
                    this.steps[this.steps.length - 1]["queued"] = node;
                }
                this.steps[this.steps.length - 1]["queueEdge"] = {"from": this.bfsQueue[0], "to": node};
                this.steps.push({"defaultEdge": {"from": this.bfsQueue[0], "to": node}})

                connectionCnt++;
            }
            if (connectionCnt > 0) { //there is an edge removal step stored ahead, so don't create a new index, use that index
                this.steps[this.steps.length - 1]["visited"] = this.bfsQueue[0];
            }
            else {
                this.steps.push({"visited":this.bfsQueue[0]});
            }
            // this.steps[this.steps.length - 1]["visited"] = this.bfsQueue[0];
            this.bfsQueue.shift();
        } 
    }

    dfs(curNode, prev) {
        if (this.steps[this.steps.length - 1]) {
            this.steps[this.steps.length - 1]["visiting"] = curNode;
        }
        else {
            this.steps.push({"visiting": curNode});
        }

        // this.steps[this.steps.length - 1]["visiting"] = curNode;

        var connectionCnt = 0;
        for (var node in adjMat[curNode]) {
            if (this.dfsVisited[node]) {
                continue;
            }

            this.dfsVisited[node] = true;
            // if (connectionsCnt == 0) {
            this.steps.push({"queueEdge": {"from": curNode, "to": node}});
            // }
            // this.steps.push({"visiting": {"to": node, "from": curNode}})
            this.dfs(node, curNode);

            connectionCnt++;
        }
        
        this.steps.push({"visited": curNode});
        if (prev != null) {
            this.steps[this.steps.length - 1]["defaultEdge"] = {"from": prev, "to": curNode};
        }
    }
    isComplete() {
        return(this.complete);
    }
}