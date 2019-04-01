
let canvas = document.getElementById('game');
let ctx    = canvas.getContext('2d');

let width  = canvas.width;
let height = canvas.height;

let mouseX = null;
let mouseY = null;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

let Vector = function(x, y) {
    this.x = x;
    this.y = y;
};

Vector.prototype.add = function(vector) {
    this.x = this.x + vector.x;
    this.y = this.y + vector.y;
};

Vector.prototype.sub = function(vector) {
    this.x = this.x - vector.x;
    this.y = this.y - vector.y;
};

Vector.prototype.mag = function() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
};

Vector.prototype.mult = function(int) {
    this.x *= int;
    this.y *= int;
};

Vector.prototype.setMag = function(int) {
    this.normalize();
    this.mult(int);
};

Vector.prototype.normalize = function() {
    let mag = this.mag();
    this.x = this.x / mag;
    this.y = this.y / mag;
};

Vector.prototype.randomize = function(limit) {
    this.x = getRandomArbitrary(-2, 2);
    this.y = getRandomArbitrary(-2, 2);
};

let rectangle = function(origin, width, height) {
    //ctx.fillStyle = `rgba(255, 255, 255, 1)`;
    ctx.strokeRect(origin.x, origin.y, width, height);
};

let Mover = function() {
    this.location = new Vector(width/2, height/2);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
};

Mover.prototype.update = function() {
    let mouse = new Vector(mouseX, mouseY);
    mouse.sub(this.location);
    mouse.setMag(0.1);

    this.acceleration = mouse;
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);

    if(this.velocity.mag() > 5) this.velocity.setMag(5);
};

Mover.prototype.edges = function() {
    if(this.location.x > width) this.location.x = 0;
    if(this.location.x < 0) this.location.x = width;
    if(this.location.y > height) this.location.y = 0;
    if(this.location.y < 0) this.location.y = height;
};

Mover.prototype.display = function() {
    rectangle(this.location, 50, 50);
};


let updateMouseLocation = function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
};

let m = new Mover();

let translate = function(x, y) {
    ctx.translate(x, y);
};

function draw() {
    ctx.clearRect(0, 0, width, height);
    m.update();
    m.edges();
    m.display();
}

setInterval(() => {
    draw();
}, 1000 / 30);

document.addEventListener('mousemove', updateMouseLocation, false);