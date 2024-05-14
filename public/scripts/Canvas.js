class Canvas {

    static headlen = 10; // length of head in pixels

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
        for (var u in Object.keys(adjMat)) {
            for (var v in adjMat[u]) {
                this.context.beginPath();
                this.context.lineWidth = 1.5 + 0.5 * Math.sin(new Date().getTime() / 750);
                this.context.strokeStyle = "black";
                this.context.moveTo(nodes[u].x, nodes[u].y);
                this.context.lineTo(nodes[v].x, nodes[v].y);
                this.context.stroke();

                if (!(adjMat[u][v] != null && adjMat[v][u] != null)) {
                    this.drawArrowFromMiddle(nodes[u].x, nodes[u].y, nodes[v].x, nodes[v].y);
                }
                if (adjMat[u][v] != 0) {
                    this.drawEdgeWeight(adjMat[u][v], nodes[u].x, nodes[u].y, nodes[v].x, nodes[v].y);
                }
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

    drawEdgeWeight(weight, fromX, fromY, toX, toY) {
        var dx = toX - fromX;
        var dy = toY - fromY;
        var angle = Math.atan2(dy, dx);

        toX = fromX/2 + toX/2;
        toY = fromY/2 + toY/2;

        this.context.moveTo(toX, toY);
        this.context.font = "20px Arial";
        this.context.fillText(weight, toX,toY);
        this.context.stroke();
    }
    drawArrowFromMiddle(fromX, fromY, toX, toY) {
        var dx = toX - fromX;
        var dy = toY - fromY;
        var angle = Math.atan2(dy, dx);

        toX = fromX/2 + toX/2;
        toY = fromY/2 + toY/2;

        this.context.moveTo(toX, toY);
        this.context.lineTo(toX - Canvas.headlen * Math.cos(angle - Math.PI / 6), toY - Canvas.headlen * Math.sin(angle - Math.PI / 6));
        this.context.moveTo(toX, toY);
        this.context.lineTo(toX - Canvas.headlen * Math.cos(angle + Math.PI / 6), toY - Canvas.headlen * Math.sin(angle + Math.PI / 6));
        this.context.stroke()
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