class Algorithm {

    static running = false;

    constructor(type) {
        this.type = type;
        this.complete = false;

        if (this.type == 'bfs') {
            this.bfsQueue = [curSelected];
            this.bfsVisited = {}; this.bfsVisited[curSelected] = true;
            this.steps = [{"queued": {'new': curSelected, 'from': null}}];
            this.bfs();
        }
        else if (this.type == 'dfs') {
            this.dfsVisited = {}; this.dfsVisited[curSelected] = true;
            this.steps = [{"queued": {'new': curSelected, 'from': null}}];
            this.dfs(curSelected);
        }
    }
    step() {
        if (this.steps.length <= 0) {
            this.complete = true;
            
        }
        if (this.complete) {
            for (var node in nodes) {
                if (nodes[node].states['visited']) {
                    delete nodes[node].states['visited'];
                }
                if (nodes[node].states['visiting']) {
                    delete nodes[node].states['visiting'];
                }
                if (nodes[node].states['queued']) {
                    delete nodes[node].states['queued'];
                }
            }
        }
        for (var step in this.steps[0]) {
            switch (step) {
                case 'queued':
                    nodes[this.steps[0][step]['new']].states[step] = true;
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
            for (var node in adjMat[this.bfsQueue[0]]) {
                if (this.bfsVisited[node]) {
                    continue;
                }
                this.bfsVisited[node] = true;
                this.bfsQueue.push(node)
                this.steps.push({"queued": {"new": node, "from": this.bfsQueue[0]}})
            }
            this.steps.push({"visited": this.bfsQueue[0]});
            // this.steps[this.steps.length - 1]["visited"] = this.bfsQueue[0];
            this.bfsQueue.shift();
        }
    }

    dfs(curNode) {
        // this.steps.push({"visiting": curNode});
        this.steps[this.steps.length - 1]["visiting"] = curNode;

        for (var node in adjMat[curNode]) {
            if (this.dfsVisited[node]) {
                continue;
            }

            this.dfsVisited[node] = true;
            this.steps.push({"queued": {"new": node, "from": adjMat[curNode]}})
            this.dfs(node);
        }

        this.steps.push({"visited": curNode});
        // this.steps[this.steps.length - 1]["visited"] = curNode;
    }
    isComplete() {
        return(this.complete);
    }
}