const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');//获得一个2d绘画区域和环境

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const countshow = document.querySelector('#count');

let count = 0;//赋初值


function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;//返回一个随机的颜色
}

function Shape(x, y, vx, vy) {//定义基类
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
}

function Ball(x, y, vx, vy, size, color, isexists) {//定义球类
    Shape.call(this, x, y, vx, vy);//这里面写的是实参
    this.size = size;
    this.color = color;
    this.isexists = isexists;//是否还存在，如果被吃掉，就变为false
}
// console.log(Ball.prototype.constructor);
Object.defineProperty(Ball.prototype, 'constructor', {
    value: Ball,
    enumerable: false
})

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function () {
    if (this.x + this.size >= width) {
        this.vx = -this.vx;
    }
    if (this.x - this.size <= 0) {
        this.vx = -this.vx;
    }
    if (this.y + this.size >= height) {
        this.vy = -this.vy;
    }
    if (this.y - this.size <= 0) {
        this.vy = -this.vy;
    }

    this.x += this.vx;
    this.y += this.vy;
}

Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j] !== this) {
            const dx = balls[j].x - this.x;
            const dy = balls[j].y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.size + balls[j].size && balls[j].isexists) {
                this.color = balls[j].color = randomColor();
            }
        }
    }
}

function EvilCircle(x, y, vx, vy) {
    Shape.call(this, x, y, 20, 20);
    this.size = 10;
    this.color = 'white';
}

Object.defineProperty(EvilCircle.prototype, 'constructor', {
    value: EvilCircle,
    enumerable: false
})

EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}

EvilCircle.prototype.checkBounds = function () {
    //如果超出边缘的话，改变一下x,y的值
    if (this.x + this.size >= width) {
        this.x -= this.size;
    }
    if (this.x - this.size <= 0) {
        this.x += this.size;
    }
    if (this.y + this.size >= height) {
        this.y -= this.size;
    }
    if (this.y - this.size <= 0) {
        this.y += this.size;
    }
}

EvilCircle.prototype.setControls = function () {
    window.onkeydown = ({key}) => {
        console.log(key);
        switch (key) {
            case 'a':
                this.x -= this.vx;
                break;
            case 'd':
                this.x += this.vx;
                break;
            case 'w':
                this.y -= this.vy;
                break;
            case 's':
                this.y += this.vy;
                break;
        }
    }
}

EvilCircle.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        const dx = balls[j].x - this.x;
        const dy = balls[j].y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + balls[j].size && balls[j].isexists) {
            balls[j].isexists = false;
            count--;
            countshow.innerHTML = count;
        }
    }
}


const balls = [];
//把加球封装为一个函数，通过用户输入；来获得球的数量
while (balls.length < 30) {
    let size = random(8, 14);
    let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-3, 7),
        size,
        randomColor(),
        true
    )
    balls.push(ball);
    count++;
}
countshow.innerHTML = count;
const dasha = new EvilCircle(100, 400);
dasha.setControls();



function loop() {
    // ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0,0.25)';
    ctx.fillRect(0, 0, width, height);
    // ctx.clearRect(0,0,width,height)
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].isexists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }
    dasha.draw();
    dasha.checkBounds();
    dasha.collisionDetect();
    window.requestAnimationFrame(loop);
}loop();


