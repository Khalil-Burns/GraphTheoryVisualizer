var canvasObj;
var canvas;
var cW = window.innerWidth, cH = window.innerHeight; //canvas width and height
var TIME_INTERVAL_MS = 1;
var TIME_INTERVAL_SEC = TIME_INTERVAL_MS / 1000;
var nodes = [];
var adjMat = {};
var curSelected;
var nodesNum = 0;
var edgeDirection;
var edgeWeight;

window.onload = function() {
    buttonScriptStart();

    canvasObj = new Canvas(cW, cH, "canvas")
    canvas = canvasObj.canvas;

    edgeDirection = document.getElementById('edge-direction');
    edgeWeight = document.getElementById('edge-weight');

    canvas.addEventListener("dblclick", (eDbclick) => { //double click to add new node
        if (Algorithm.running) {
            return;
        }

        var mousePos = getMousePos(canvas, eDbclick);
        adjMat[nodesNum] = {};
        nodes[nodesNum] = (new Node(mousePos.x, mousePos.y, Math.random() * 4 - 2, Math.random() * 4 - 2, {}, 25, {}, nodesNum))
        nodes[nodesNum].element.onmousedown = dragMouseDown;
        nodes[nodesNum].element.addEventListener("dblclick", (e) => { //double click node to delete it
            if (Algorithm.running) {
                return;
            }
            if (e.shiftKey) {
                return;
            }
            nodes[e.target.id].delete();
        });
        nodes[nodesNum].element.addEventListener("mouseover", (e) => {
            nodes[e.target.id].states['hover'] = true;
        });
        nodes[nodesNum].element.addEventListener("mouseout", (e) => {
            delete nodes[e.target.id].states['hover'];
        });
        nodesNum++;
    });
    window.addEventListener("resize", (e) => {
        canvasObj.resize(window.innerWidth, window.innerHeight);
    });

    setInterval(loop, TIME_INTERVAL_MS);
}
function getMousePos(canvas, evt) { //doesnt need to be this complicated, its a long story
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function dragMouseDown(e) {
    draggedElementID = e.target.id;
    if (e.shiftKey) {
        nodes[e.target.id].states['preselected'] = true;
    }
    else {
        nodes[e.target.id].states['click'] = true;
    }
    e.preventDefault();
    // get the mouse cursor position at startup:
    oldMouseX = e.clientX;
    oldMouseY = e.clientY;
    document.onmouseup = function(e) {
        closeDragElement(e, draggedElementID)
    }
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
}
function elementDrag(e) {
    e.preventDefault();
    // calculate the new cursor position:
    mouseXChange = oldMouseX - e.clientX;
    mouseYChange = oldMouseY - e.clientY;
    oldMouseX = e.clientX;
    oldMouseY = e.clientY;
    // set the element's new position:
    nodes[draggedElementID].x -= mouseXChange;
    nodes[draggedElementID].y -= mouseYChange;
}
function closeDragElement(e, id) {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    nodes[id].release();
    delete nodes[id].states['click'];
    delete nodes[id].states['preselected'];
    
    if (nodes[id].states['selected']) {
        if (Algorithm.running) {
            return;
        }
        if (curSelected == id) {
            curSelected = null;
        }
        delete nodes[id].states['selected'];
    }
    else if (e.shiftKey) {
        if (Algorithm.running) {
            return;
        }
        nodes[id].states['selected'] = true;

        if (curSelected) {
            if (edgeDirection.value == 'undirected') {
                if (adjMat[curSelected][id] != null || adjMat[id][curSelected] != null) {
                    removeEdge(curSelected, id);
                    removeEdge(id, curSelected);
                }
                else {
                    addEdge(curSelected, id);
                    addEdge(id, curSelected);

                    edgeWeight.value = '';
                }
            }
            else {
                if (adjMat[curSelected][id] != null) {
                    if (adjMat[id][curSelected] != null) {
                        removeEdge(id, curSelected);
                    }
                    else {
                        removeEdge(curSelected, id);
                    }
                    // delete adjMat[curSelected][id];
                }
                else {
                    addEdge(curSelected, id);
                    edgeWeight.value = '';
                }
            }

            delete nodes[curSelected].states['selected'];
            delete nodes[id].states['selected'];

            curSelected = null;
        }
        else {
            curSelected = id;
        }
    }
}
function addEdge(u, v) {
    adjMat[u][v] = edgeWeight.value?Number(edgeWeight.value):0;
    nodes[u].connections[v] = {'weight': adjMat[u][v], 'color': Node.EDGE_COLOUR_DEFAULT, 'time': new Date().getTime()};
    if (adjMat[v][u] != null) {
        adjMat[v][u] = adjMat[u][v];
        nodes[v].connections[u] = {'weight': adjMat[u][v], 'color': Node.EDGE_COLOUR_DEFAULT, 'time': new Date().getTime()};
    }
}
function removeEdge(u, v) {
    delete adjMat[u][v];
    delete nodes[u].connections[v];
}

function setNodesToDefault() {
    for (var node in nodes) {
        nodes[node].states = {'selected': nodes[node].states['selected'], 'preselected': nodes[node].states['preselected'], 'click': nodes[node].states['click'], 'hover': nodes[node].states['hover']}
        for (var connection in nodes[node].connections) {
            nodes[node].connections[connection]['color'] = Node.EDGE_COLOUR_DEFAULT;
        }
    }
}

function loop() {
    stepHandler();
    canvasObj.clear();

    canvasObj.drawEdges()
    for (var node in nodes) {
        nodes[node].update();
        // canvasObj.drawNode(nodes[i]);
    }
}