/**
 * @type {HTMLCanvasElement}
 */

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 720;

const enemies = [];

class InputHandler {
    constructor() {
        this.keys = [];
        this.init();
    }
    init() {
        window.addEventListener("keydown", e => {
            if ((e.key === "ArrowUp" ||
                e.key === "ArrowDown" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight")
                && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
        })
        window.addEventListener("keyup", e => {
            if (e.key === "ArrowUp" ||
                e.key === "ArrowDown" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight") {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        })
    }
}
class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;//整个画布的宽高
        this.width = 200;
        this.height = 200;
        this.sourceWidth = 200;
        this.sourceHeight = 200;
        this.x = 0;
        this.y = this.gameHeight - this.height;
        this.frameX = 0;
        this.frameY = 0;
        this.vx = 0;
        this.vy = 0;
        this.gravity = 1;//重力加速度
        this.image = new Image();
        this.image.src = "./images/player.png";
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.frameX * this.sourceWidth, this.frameY * this.sourceHeight, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    update(input) {

        if (input.keys.indexOf("ArrowRight") > -1) {
            this.vx = 5;
        }
        else if (input.keys.indexOf("ArrowLeft") > -1) {
            this.vx = -5;
        }
        else if (input.keys.indexOf("ArrowUp") > -1 && this.onGround()) {
            this.vy = -24;
        }
        else {
            this.vx = 0;
            // this.vy = 0;
        }
        // x轴移动
        this.x += this.vx;
        if (this.x < 0) this.x = 0;
        else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
        // y轴移动
        this.y += this.vy;
        if (!this.onGround()) {
            this.vy += this.gravity;
            this.frameY = 1;
        } else {
            this.vy = 0;
            this.frameY = 0;
        }
        if (this.y <= 0) this.y = 0
    }
    onGround() {
        return this.y >= this.gameHeight - this.height
    }

}
class BackGround {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.x = 0;
        this.y = 0;
        this.sourceWidth = 2400;
        this.sourceHeight = 720;
        this.width = 2400;
        this.height = 720;
        this.speed = 10;
        this.image = new Image();
        this.image.src = "./images/background.png";
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.sourceWidth, this.sourceHeight);
        ctx.drawImage(this.image, this.x + this.width - this.speed, this.y, this.sourceWidth, this.sourceHeight);
    }
    update() {
        this.x -= this.speed;
        if (this.x <= - this.width) this.x = 0;

    }
}
class Enemy {
    constructor(gameWidth, gameHeight) {
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.sourceWidth = 160;
        this.sourceHeight = 119;
        this.width = this.sourceWidth / 2;
        this.height = this.sourceHeight / 2;
        this.x = this.gameWidth - this.width;
        this.y = 0;
        this.frameX = 0;
        this.image = new Image();
        this.image.src = "./images/enemy.png";

    }
    draw(ctx) {
        ctx.drawImage(this.image, this.frameX * this.sourceWidth, 0, this.sourceWidth, this.sourceHeight, this.x, this.y, this.width, this.height)
    }
    update() {
        this.x--;
    }
}


function handlerEnemies(deltaTime) {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
        enemies.push(new Enemy(canvas.width, canvas.height));
        randomEnemyInterval = Math.random() * 1000 + 500;
        enemyTimer = 0;
    } else {
        enemyTimer += deltaTime;
    }

    enemies.forEach(enemy => {
        enemy.draw(ctx);
        enemy.update();
    })
}

const input = new InputHandler();
const player = new Player(canvas.width, canvas.height);
const background = new BackGround(canvas.width, canvas.height);

let lastTime = 0;
let enemyTimer = 0;
let enemyInterval = 1000;
let randomEnemyInterval = Math.random() * 1000 + 500;
function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    background.update();
    player.update(input);
    player.draw(ctx);
    handlerEnemies(deltaTime);
    requestAnimationFrame(animate);
} animate(0)