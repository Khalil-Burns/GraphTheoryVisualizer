class Canvas {
    constructor(width, height, id, parent) {
        this.width = width;
        this.height = height;
        this.id = id
        this.parent = parent

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width
        this.canvas.height = this.height
        if (parent) {
            document.getElementById(this.parent).appendChild(this.canvas)
        }
        else {
            document.body.appendChild(this.canvas)
        }
        this.context = this.canvas.getContext("2d");
    }
    
    drawEdges() {
        for (var u in Object.keys(adjList)) {
            for (var v in adjList[u]) {
                this.context.beginPath();
                this.context.strokeStyle = "black";
                this.context.moveTo(nodes[u].x, nodes[u].y);
                this.context.lineTo(nodes[v].x, nodes[v].y);
                this.context.stroke();
            }
        }
    }
    drawNode(node) {
        this.context.strokeStyle = "black";
        this.context.beginPath();
        this.context.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        this.context.fillStyle = `rgb(${node.color["r"]}, ${node.color["g"]}, ${node.color["b"]})`;
        this.context.fill();
        this.context.stroke();
    }
    
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    resize(width, height) {
        this.width = width;
        this.height = height;
        
        this.canvas.width = this.width
        this.canvas.height = this.height
    }
}