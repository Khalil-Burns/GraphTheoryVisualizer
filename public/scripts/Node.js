class Node {

    static COLOUR_DEFAULT = {"r": 255, "g": 255, "b": 255};
    static COLOUR_HOVER = {"r": 235, "g": 235, "b": 240};
    static COLOUR_SELECTED = {"r": 125, "g": 220, "b": 125};
    static COLOUR_CLICK = {"r": 210, "g": 210, "b": 215};
    static COLOUR_QUEUED = {"r": 255, "g": 193, "b": 128};
    static COLOUR_VISITED = {"r": 125, "g": 125, "b": 125};
    static FRICTION_ACCEL = 9.8;
    static VELOCITY_REDUCTION = 1.05;
    static PREV_POSITION_DEPTH = 20;

    constructor(x, y, vX, vY, connections, radius, states, ID) {
        this.x = x;
        this.y = y;
        this.prevX = this.x;
        this.prevY = this.y;
        this.prevXAverage = []
        this.prevYAverage = []
        this.resetPrevPositionAverage()
        this.vX = vX;
        this.vY = vY;
        this.connections = connections;
        this.radius = radius;
        this.states = states;
        this.ID = ID;
        this.elementSetup();
    }
    elementSetup() {
        this.element = document.createElement('div');
        this.element.classList.add('node')
        this.element.style.width = `${2 * this.radius}px`;
        this.element.style.height = `${2 * this.radius}px`;
        this.element.id = this.ID;
        this.element.style.textAlign = 'center';
        this.element.style.verticalAlign = 'center';
        this.element.style.lineHeight = `${2 * this.radius}px`;
        this.element.style.userSelect = 'none';
        this.element.innerHTML = `${this.ID}`
        
        this.update();

        document.body.appendChild(this.element);
    }
    update() {
        this.updateVelocity();
        this.updatePosition();
        
        if (this.states['visited']) {
            this.color = Node.COLOUR_VISITED;
        }
        else if (this.states['queued']) {
            this.color = Node.COLOUR_QUEUED;
        }
        else if (this.states['visiting']) {
            this.color = Node.COLOUR_SELECTED;
        }
        else if (this.states['selected'] || this.states['preselected']) {
            this.color = Node.COLOUR_SELECTED;
        }
        else if (this.states['click']) {
            this.color = Node.COLOUR_CLICK;
        }
        else if (this.states['hover']) {
            this.color = Node.COLOUR_HOVER;
        }
        else {
            this.color = Node.COLOUR_DEFAULT;
        }
        this.element.style.backgroundColor = `rgb(${this.color["r"]}, ${this.color["g"]}, ${this.color["b"]})`;
    }
    updateVelocity() { //decrease the velocity until it gets close enough to 0
        // this.vX = (this.x - this.prevX) / TIME_INTERVAL_MS;
        // this.vX -= Node.FRICTION_ACCEL * TIME_INTERVAL_SEC * Math.sign(this.vX);
        this.vX /= Node.VELOCITY_REDUCTION;
        // if (this.vX < 1) {
        //     this.vX = 0;
        // }

        // this.vY = (this.y - this.prevY) / TIME_INTERVAL_MS;
        // this.vY -= Node.FRICTION_ACCEL * TIME_INTERVAL_SEC * Math.sign(this.vY);
        this.vY /= Node.VELOCITY_REDUCTION;
        // if (this.vY < 1) {
        //     this.vY = 0;
        // }
    }
    updatePosition() {
        this.prevX = this.x;
        this.prevY = this.y;

        if (!this.states['click'] && !this.states['selected']) {
            this.x += this.vX;
            this.y += this.vY;
            // this.resetPrevPositionAverage();
        }
        else {
            
        }
        this.prevXAverage.shift();
        this.prevYAverage.shift();

        this.prevXAverage.push(this.x);
        this.prevYAverage.push(this.y);

        this.element.style.marginTop = `${this.y - this.radius}px`;
        this.element.style.marginLeft = `${this.x - this.radius}px`;
    }
    release() {
        for (var i = 1; i < Node.PREV_POSITION_DEPTH; i++) {
            this.vX += (this.prevXAverage[i] - this.prevXAverage[i - 1]) / TIME_INTERVAL_MS;
        }
        this.vX /= Node.PREV_POSITION_DEPTH - 1;

        for (var i = 1; i < Node.PREV_POSITION_DEPTH; i++) {
            this.vY += (this.prevYAverage[i] - this.prevYAverage[i - 1]) / TIME_INTERVAL_MS;
        }
        this.vY /= Node.PREV_POSITION_DEPTH - 1;
    }
    resetPrevPositionAverage() {
        this.prevXAverage = [];
        this.prevYAverage = [];
        for (var i = 0; i < Node.PREV_POSITION_DEPTH; i++) {
            this.prevXAverage.push(this.x);
            this.prevYAverage.push(this.y);
        }
    }
    delete() {
        this.element.remove();
        for (var v in adjMat[this.ID]) {
            delete adjMat[this.ID][v];
            delete adjMat[v][this.ID];
        }
        delete nodes[this.ID];
        if (curSelected == this.ID) {
            curSelected = null;
        }
    }
}