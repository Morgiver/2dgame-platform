
const GRAVITY = { x: 0 , y: 20 };

const TYPE_PLAYER     = "TYPE_PLAYER";
const TYPE_ENNEMY     = "TYPE_ENNEMY";
const TYPE_PLATEFORME = "TYPE_PLATEFORME";

let Entity = function(type, x, y) {
    this.type = type;

    this.x = x;
    this.y = y;

    this.width  = null;
    this.height = null;
    this.verticalSpeed   = 0;
    this.horizontalSpeed = 0;
    this.shape = null;
    this.color = {
        r: null,
        g: null,
        b: null,
        a: null
    };
};

Entity.prototype.move = function() {
    this.x = this.x + this.horizontalSpeed;
    this.y = this.y + this.verticalSpeed;

    if(this.verticalSpeed < GRAVITY.y && this.type !== TYPE_PLATEFORME) {
        this.verticalSpeed = this.verticalSpeed + 1.5;
    }
};

Entity.prototype.draw = function(ctx) {
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;

    switch(this.shape) {
        case "rectangle":
            ctx.fillRect(this.x, this.y, this.width, this.height);
            break;
    }
};

// entity.y, entity.y + height
//

Entity.prototype.collisionTopSide = function(entity) {
    return (entity.y + entity.height > this.y && entity.y < this.y)
        && (entity.x < this.x + this.width && entity.x + entity.width > this.x);
};

Entity.prototype.collisionLeftSide = function(entity) {
    return (entity.x + entity.width > this.x && entity.x < this.x)
        && (entity.y + entity.height > this.y && entity.y < this.y + this.height);
};

Entity.prototype.collisionRightSide = function(entity) {
    return (entity.x < this.x + this.width && entity.x + entity.width > this.x + this.width)
        && (entity.y + entity.height > this.y && entity.y < this.y + this.height);
};

Entity.prototype.collisionBottomSide = function(entity) {
    return (entity.y < this.y + this.height && entity.y + entity.height > this.y)
        && (entity.x < this.x + this.width && entity.x + entity.width > this.x);
};

Entity.prototype.collision = function(entity) {
    return;
};

let Joueur = function(x, y) {
    Entity.call(this, TYPE_PLAYER, x, y);

    this.shape  = "rectangle";
    this.width  = 20;
    this.height = 60;
    this.color.r = 0;
    this.color.g = 255;
    this.color.b = 0;
    this.color.a = 1;
};

Joueur.prototype = Object.create(Entity.prototype);
Joueur.prototype.constructor = Joueur;

let Plateforme = function(x, y, width, height) {
    Entity.call(this, TYPE_PLATEFORME, x, y);

    this.shape   = "rectangle";
    this.width   = width;
    this.height  = height;
    this.color.r = 255;
    this.color.g = 0;
    this.color.b = 0;
    this.color.a = 1;
};

Plateforme.prototype = Object.create(Entity.prototype);
Plateforme.prototype.constructor = Plateforme;

Plateforme.prototype.collision = function(entity) {
    switch(entity.type) {
        case TYPE_PLAYER:
            if(this.collisionTopSide(entity)) {
                entity.verticalSpeed = 0;
                entity.y = this.y - entity.height;
            }

            if(this.collisionLeftSide(entity)) {
                entity.horizontalSpeed = 0;
                entity.x = this.x - entity.width;
            }

            if(this.collisionRightSide(entity)) {
                entity.horizontalSpeed = 0;
                entity.x = this.x + this.width;
            }

            if(this.collisionBottomSide(entity)) {
                entity.verticalSpeed = 0;
                entity.y = this.y + this.height;
            }
            break;
    }
};

let canvas = document.getElementById('game');
let ctx    = canvas.getContext('2d');

let entities = [];

function draw() {
    for(let i in entities) {
        entities[i].draw(ctx);
    }
}

function move() {
    for(let i in entities) {
        entities[i].move();
    }
}

function collisions() {
    for(let i in entities) {
        for(let j in entities) {
            if(i !== j) entities[i].collision(entities[j]);
        }
    }
}

let player = new Joueur(350, 100);
player.verticalSpeed = GRAVITY.y;
entities.push(player);

let sol  = new Plateforme(100, 350, 500, 50);
let sol2 = new Plateforme(100, 200, 150, 50);
let mur  = new Plateforme(150, 250, 50, 100);
let mur2 = new Plateforme(500, 300, 50, 50);

entities.push(sol);
entities.push(sol2);
entities.push(mur);
entities.push(mur2);

setInterval(() => {
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, 0, 1920, 1080);
    move();
    collisions();
    draw();
}, 1000 / 30);

document.addEventListener('keydown', (event) => {
    event.preventDefault();
    switch(event.key) {
        case "d":
            player.horizontalSpeed = 5;
            break;
        case "q":
            player.horizontalSpeed = -5;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    event.preventDefault();
    switch(event.key) {
        case "d":
            player.horizontalSpeed = 0;
            break;
        case "q":
            player.horizontalSpeed = 0;
            break;
        case " ":
            player.verticalSpeed = -10;
            break;
    }
});