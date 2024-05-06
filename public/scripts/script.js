var canvasObj;
var canvas;
var cW = window.innerWidth, cH = window.innerHeight; //canvas width and height
var TIME_INTERVAL_MS = 1;
var TIME_INTERVALE_SEC = TIME_INTERVAL_MS / 1000;
var nodes = [];
var adjList = {};
var curSelected;
var nodesNum = 0;

window.onload = function() {
    canvasObj = new Canvas(cW, cH, "canvas")
    canvas = canvasObj.canvas;

    setInterval(loop, TIME_INTERVAL_MS);

    canvas.addEventListener("dblclick", (eDbclick) => { //double click to add new node
        var mousePos = getMousePos(canvas, eDbclick);
        adjList[nodesNum] = {};
        nodes[nodesNum] = (new Node(mousePos.x, mousePos.y, 0, 0, [], 25, {}, nodesNum))
        nodes[nodesNum].element.onmousedown = dragMouseDown;
        nodes[nodesNum].element.addEventListener("dblclick", (e) => { //double click node to delete it
            nodes[e.target.id].element.remove();
            for (var v in adjList[e.target.id]) {
                delete adjList[e.target.id][v];
                delete adjList[v][e.target.id];
            }
            delete nodes[e.target.id];
            if (curSelected == e.target.id) {
                curSelected = null;
            }
        });
        nodes[nodesNum].element.addEventListener("mouseover", (e) => { //double click node to delete it
            nodes[e.target.id].states['hover'] = true;
        });
        nodes[nodesNum].element.addEventListener("mouseout", (e) => { //double click node to delete it
            delete nodes[e.target.id].states['hover'];
        });
        nodesNum++;
    });
    window.addEventListener("resize", (e) => {
        canvasObj.resize(window.innerWidth, window.innerHeight);
    });
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
    delete nodes[id].states['click'];
    delete nodes[id].states['preselected'];
    
    if (nodes[id].states['selected']) {
        if (curSelected == id) {
            delete curSelected;
        }
        delete nodes[id].states['selected'];
    }
    else if (e.shiftKey) {
        nodes[id].states['selected'] = true;

        if (curSelected) {
            if (adjList[curSelected][id] || adjList[id][curSelected]) {
                delete adjList[curSelected][id];
                delete adjList[id][curSelected];
            }
            else {
                adjList[curSelected][id] = true;
                adjList[id][curSelected] = true;
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

function loop() {
    canvasObj.clear();

    canvasObj.drawEdges()
    for (node in nodes) {
        nodes[node].update();
        // canvasObj.drawNode(nodes[i]);
    }
}