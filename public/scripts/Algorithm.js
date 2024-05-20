class Algorithm {

    static running = false;

    constructor(type) {
        this.type = type;
        this.complete = false;
        console.log(nodes)
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
        else if (this.type == 'kruskals') {
            this.steps = [[]];
            this.kruskalsMST();
        }
        else if (this.type == 'prims') {
            this.steps = [[]];
            this.primsMST();
        }
    }
    step() {
        if (this.steps.length <= 0) {
            this.complete = true;
            return;
        }

        for (var idx in this.steps[0]) {
            for (var step in this.steps[0][idx]) {
                switch (step) {
                    case 'queueEdge':
                        nodes[this.steps[0][idx][step]['from']].connections[this.steps[0][idx][step]['to']]['color'] = Node.EDGE_COLOUR_QUEUED;
                        if (adjMat[this.steps[0][idx][step]['to']][this.steps[0][idx][step]['from']] != null) {
                            nodes[this.steps[0][idx][step]['to']].connections[this.steps[0][idx][step]['from']]['color'] = Node.EDGE_COLOUR_QUEUED;
                        }
                        break;
                    case 'defaultEdge':
                        nodes[this.steps[0][idx][step]['from']].connections[this.steps[0][idx][step]['to']]['color'] = Node.EDGE_COLOUR_DEFAULT;
                        if (adjMat[this.steps[0][idx][step]['to']][this.steps[0][idx][step]['from']] != null) {
                            nodes[this.steps[0][idx][step]['to']].connections[this.steps[0][idx][step]['from']]['color'] = Node.EDGE_COLOUR_DEFAULT;
                        }
                        break;
                    case 'errorEdge':
                        nodes[this.steps[0][idx][step]['from']].connections[this.steps[0][idx][step]['to']]['color'] = Node.EDGE_COLOUR_ERROR;
                        if (adjMat[this.steps[0][idx][step]['to']][this.steps[0][idx][step]['from']] != null) {
                            nodes[this.steps[0][idx][step]['to']].connections[this.steps[0][idx][step]['from']]['color'] = Node.EDGE_COLOUR_ERROR;
                        }
                        break;
                    case 'hiddenEdge':
                            nodes[this.steps[0][idx][step]['from']].connections[this.steps[0][idx][step]['to']]['color'] = Node.EDGE_COLOUR_HIDDEN;
                            if (adjMat[this.steps[0][idx][step]['to']][this.steps[0][idx][step]['from']] != null) {
                                nodes[this.steps[0][idx][step]['to']].connections[this.steps[0][idx][step]['from']]['color'] = Node.EDGE_COLOUR_HIDDEN;
                            }
                            break;
                    case 'selectedEdge':
                        nodes[this.steps[0][idx][step]['from']].connections[this.steps[0][idx][step]['to']]['color'] = Node.EDGE_COLOUR_SELECTED;
                        if (adjMat[this.steps[0][idx][step]['to']][this.steps[0][idx][step]['from']] != null) {
                            nodes[this.steps[0][idx][step]['to']].connections[this.steps[0][idx][step]['from']]['color'] = Node.EDGE_COLOUR_SELECTED;
                        }
                        break;
                    case 'queued':
                        if (nodes[this.steps[0][idx][step]].states['visiting']) {
                            delete nodes[this.steps[0][idx][step]].states['visiting'];
                        }
                        if (nodes[this.steps[0][idx][step]].states['visited']) {
                            delete nodes[this.steps[0][idx][step]].states['visited'];
                        }
                        nodes[this.steps[0][idx][step]].states[step] = true;
                        break;
                    case 'visiting':
                        if (nodes[this.steps[0][idx][step]].states['queued']) {
                            delete nodes[this.steps[0][idx][step]].states['queued'];
                        }
                        if (nodes[this.steps[0][idx][step]].states['visited']) {
                            delete nodes[this.steps[0][idx][step]].states['visited'];
                        }
                        nodes[this.steps[0][idx][step]].states[step] = true;
                        break;
                    case 'visited':
                        if (nodes[this.steps[0][idx][step]].states['visiting']) {
                            delete nodes[this.steps[0][idx][step]].states['visiting'];
                        }
                        if (nodes[this.steps[0][idx][step]].states['queued']) {
                            delete nodes[this.steps[0][idx][step]].states['queued'];
                        }
                        nodes[this.steps[0][idx][step]].states[step] = true;
                        break;
                    case 'default':
                        if (nodes[this.steps[0][idx][step]].states['visiting']) {
                            delete nodes[this.steps[0][idx][step]].states['visiting'];
                        }
                        if (nodes[this.steps[0][idx][step]].states['queued']) {
                            delete nodes[this.steps[0][idx][step]].states['queued'];
                        }
                        if (nodes[this.steps[0][idx][step]].states['visited']) {
                            delete nodes[this.steps[0][idx][step]].states['visited'];
                        }
                        break;
                    default:
                        nodes[this.steps[0][idx][step]].states[step] = true;
                        break;
                }
            }
        }
        this.steps.shift();
    }

    bfs() {
        while (!this.bfsQueue.length <= 0) {
            this.steps.push([{"visiting": this.bfsQueue[0]}]);
            
            var connectionCnt = 0;
            for (var node in adjMat[this.bfsQueue[0]]) {
                this.steps[this.steps.length - 1].push({"queueEdge": {"from": this.bfsQueue[0], "to": node}})
                connectionCnt++;
            }

            connectionCnt = 0;
            for (var node in adjMat[this.bfsQueue[0]]) {
                if (connectionCnt == 0) { //edge removals are stored ahead, but there will be none stored ahead if this is the first visited node
                    this.steps.push([{"defaultEdge": {"from": this.bfsQueue[0], "to": node}}]);
                }
                else {
                    this.steps[this.steps.length - 1].push({"defaultEdge": {"from": this.bfsQueue[0], "to": node}});
                }
                connectionCnt++;
            }

            for (var node in adjMat[this.bfsQueue[0]]) {

                this.steps[this.steps.length - 1].push({"queueEdge": {"from": this.bfsQueue[0], "to": node}});
                
                this.steps.push([{"defaultEdge": {"from": this.bfsQueue[0], "to": node}}])

                if (this.bfsVisited[node]) {
                    continue;
                }
                this.bfsVisited[node] = true;
                this.bfsQueue.push(node);

                this.steps[this.steps.length - 2].push({"queued": node});
            }
            if (connectionCnt > 0) { //there is an edge removal step stored ahead, so don't create a new index, use that index
                this.steps[this.steps.length - 1].push({"visited": this.bfsQueue[0]});
            }
            else {
                this.steps.push([{"visited":this.bfsQueue[0]}]);
            }

            this.bfsQueue.shift();
        } 
    }

    dfs(curNode, prev) {
        if (this.steps[this.steps.length - 1]) {
            this.steps[this.steps.length - 1].push({"visiting": curNode});
        }
        else {
            this.steps.push([{"visiting": curNode}]);
        }

        // this.steps[this.steps.length - 1]["visiting"] = curNode;

        var connectionCnt = 0;
        for (var node in adjMat[curNode]) {
            if (this.dfsVisited[node]) {
                continue;
            }

            this.dfsVisited[node] = true;
            // if (connectionCnt == 0) {
            //     this.steps.push({"queueEdge": {"from": curNode, "to": node}});
            // }
            // else {
                this.steps.push([{"queueEdge": {"from": curNode, "to": node}}, {"queued": curNode}]);
            // }
            // this.steps.push({"visiting": {"to": node, "from": curNode}})
            this.dfs(node, curNode);
            this.steps[this.steps.length - 1].push({"visiting": curNode});

            connectionCnt++;
        }
        
        this.steps.push([{"visited": curNode}]);
        if (prev != null) {
            this.steps[this.steps.length - 1].push({"defaultEdge": {"from": prev, "to": curNode}});
        }
    }
    kruskalsMST() { //https://www.w3schools.com/dsa/dsa_algo_mst_kruskal.php
        var edges = [];
        var result = [];
        var visited = {};

        for (var u in Object.keys(adjMat)) {
            for (var v in adjMat[u]) {
                edges.push({"weight": adjMat[u][v], "u": u, "v": v});
                this.steps[0].push({"hiddenEdge": {"from": u, "to": v}});
            }
        }
        edges.sort(function(a, b) {
            return parseFloat(a["weight"]) - parseFloat(b["weight"]);
        });

        var i = 0 // edge counter

        var parent = []
        var rank = []

        for (var node in nodes) {
            parent.push(node)
            rank.push(0)
        }

        var append = false; //whether to append to the last step (true) or create new step (false)
        while (i < edges.length) {
            var u = edges[i]["u"];
            var v = edges[i]["v"];
            var weight = edges[i]["weight"];
            i++;

            var x = Algorithm.find(parent, u)
            var y = Algorithm.find(parent, v)
            if (x != y) {
                Algorithm.union(parent, rank, x, y)
                result.push({"u": u, "v": v, "weight": weight});
                if (append) {
                    this.steps[this.steps.length - 1].push({"defaultEdge": {"from": u, "to": v}});
                    append = false
                }
                else {
                    this.steps.push([{"defaultEdge": {"from": u, "to": v}}]);
                }
            }
            else {
                if (visited[v]) {
                    if (visited[v][u]) {
                        continue;
                    }
                }
                if (append) {
                    this.steps[this.steps.length - 1].push({"errorEdge": {"from": u, "to": v}});
                }
                else {
                    this.steps.push([{"errorEdge": {"from": u, "to": v}}]);
                }
                this.steps.push([{"hiddenEdge": {"from": u, "to": v}}]);
                append = true;
            }
            if (!(visited[u] != null)) {
                visited[u] = {}
            }
            visited[u][v] = true;
        }

        this.steps.push([]);
        for (var edge in result) {
            this.steps[this.steps.length - 1].push({"selectedEdge": {"from": result[edge]['u'], "to": result[edge]['v']}});
        }

        this.steps.push([]);
        for (var edge in result) {
            this.steps[this.steps.length - 1].push({"selectedEdge": {"from": result[edge]['u'], "to": result[edge]['v']}});
        }

        this.steps.push([]);
        for (var edge in result) {
            this.steps[this.steps.length - 1].push({"selectedEdge": {"from": result[edge]['u'], "to": result[edge]['v']}});
        }
    }

    primsMST() { //https://www.w3schools.com/dsa/dsa_algo_mst_prim.php

        var in_mst = []
        var key_values = []
        var parents = []
        var result = [];

        for (var u in Object.keys(adjMat)) {
            for (var v in adjMat[u]) {
                this.steps[0].push({"hiddenEdge": {"from": u, "to": v}});
            }
        }
        this.steps.push([]);

        for (var node in nodes) {
            in_mst.push(false);
            key_values.push(Number.POSITIVE_INFINITY);
            parents.push(-1);
        }
        key_values[Object.keys(nodes)[Math.floor(Math.random() * Object.keys(nodes).length)]] = 0 // starting vertex

        var u;
        var min;
        for (var _ in nodes) {
            min = null;
            for (var node in nodes) {
                if (in_mst[node]) {
                    continue;
                }
                if (min == null) {
                    min = node;
                    continue;
                }
                if (key_values[node] < key_values[min]) {
                    min = node;
                }
            }
            u = min
            this.steps[this.steps.length - 1].push({"queued": u});

            in_mst[u] = true

            if (parents[u] != -1) {
                this.steps.push([{"defaultEdge": {"from": parents[u], "to": u}}]);
                result.push({"u": parents[u], "v": u, "weight": adjMat[parents[u]][u]});
            }

            this.steps.push([]);
            this.steps.push([{"default": u}])
            for (var v in nodes) {
                if (0 < adjMat[u][v] && adjMat[u][v] < key_values[v] && !in_mst[v]) {
                    key_values[v] = adjMat[u][v]
                    this.steps[this.steps.length - 2].push({"queueEdge": {"from": u, "to": v}});
                    // this.steps[this.steps.length - 1].push({"hiddenEdge": {"from": u, "to": v}});
                    parents[v] = u
                }
            }
        }

        this.steps.push([]);
        for (var u in Object.keys(adjMat)) {
            for (var v in adjMat[u]) {
                this.steps[this.steps.length - 1].push({"hiddenEdge": {"from": u, "to": v}});
            }
        }
        for (var edge in result) {
            this.steps[this.steps.length - 1].push({"selectedEdge": {"from": result[edge]['u'], "to": result[edge]['v']}});
        }

        this.steps.push([]);
        for (var edge in result) {
            this.steps[this.steps.length - 1].push({"selectedEdge": {"from": result[edge]['u'], "to": result[edge]['v']}});
        }

        this.steps.push([]);
        for (var edge in result) {
            this.steps[this.steps.length - 1].push({"selectedEdge": {"from": result[edge]['u'], "to": result[edge]['v']}});
        }
    }

    isComplete() {
        return(this.complete);
    }

    static find(parent, i) {
        if (parent[i] == i) {
            return i
        }
        return Algorithm.find(parent, parent[i])
    }

    static union(parent, rank, x, y) {
        var xroot = Algorithm.find(parent, x);
        var yroot = Algorithm.find(parent, y);
        if (rank[xroot] < rank[yroot])
            parent[xroot] = yroot;
        else if (rank[xroot] > rank[yroot]) {
            parent[yroot] = xroot;
        }
        else {
            parent[yroot] = xroot;
            rank[xroot] += 1;
        }
    }
}