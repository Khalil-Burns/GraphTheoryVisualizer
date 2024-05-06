class Node {

    static COLOUR_DEFAULT = {"r": 255, "g": 255, "b": 255};
    static COLOUR_HOVER = {"r": 235, "g": 235, "b": 240};
    static COLOUR_SELECTED = {"r": 150, "g": 255, "b": 150};
    static COLOUR_CLICK = {"r": 210, "g": 210, "b": 215};

    constructor(x, y, vX, vY, connections, radius, states, ID) {
        this.x = x;
        this.y = y;
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
        
        if (this.states['selected'] || this.states['preselected']) {
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
        this.vX /= 1.1;
        if (this.vX < 1) {
            this.vX = 0;
        }

        this.vY /= 1.1;
        if (this.vY < 1) {
            this.vY = 0;
        }
    }
    updatePosition() {
        this.x += this.vX;
        this.y += this.vY;

        this.element.style.marginTop = `${this.y - this.radius}px`;
        this.element.style.marginLeft = `${this.x - this.radius}px`;
    }
}