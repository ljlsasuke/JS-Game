/**
 * @type {HTMLCanvasElement}
 */

const canvas = document.getElementById('canvas');
canvas.width = 500;
canvas.height = 800;

class Game {
    constructor(ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.enemies = [];
        this.addEnemyInterval = 500;
        this.enemyTime = 0;
        this.enemyTypes = ['worm', 'ghost', 'spider'];//我觉得这个应该是类的静态属性
        this.#addNewEnemy();
    }

    update(deltaTime) {//更新状态
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion)
        if (this.enemyTime >= this.addEnemyInterval) {
            this.#addNewEnemy()
            this.enemyTime = 0;
        } else {
            this.enemyTime += deltaTime;
        }
        this.enemies.forEach(enemy => enemy.update(deltaTime));
    }

    draw() {//将状态绘制到视图层
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
    }

    #addNewEnemy() {
        const randomEnemyType = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)]//这个方法可以封装

        switch (randomEnemyType) {
            case 'worm':
                this.enemies.push(new Worm(this));
                break;
            case 'ghost':
                this.enemies.push(new Ghost(this));
                break;
            case 'spider':
                this.enemies.push(new Spider(this));
                break;
        }

        this.enemies.sort((a, b) => {
            // 如果 返回结果 > 0 a排在b后面
            // 如果 返回结果 < 0 b排在a后面
            //如果a.y 大于 b.y ，那么结果 > 0 a在b后面,也就是按照 y 升序，y小的在前面
            return a.y - b.y;
        })
    }
}

class Enemy {
    constructor(game) {
        this.game = game;
        this.markedForDeletion = false;
        this.frameX = 0;
        this.maxFrame = 5;//六张图片，所以最大帧是5
        this.frameInterval = 100;
        this.frameTimer = 0;
    }

    update(deltaTime) {
        this.x -= this.vx * deltaTime;
        if (this.x + this.width < 0)
            this.markedForDeletion = true;
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) this.frameX++
            else this.frameX = 0;
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

    }
}

class Worm extends Enemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 229;
        this.spriteHeight = 171;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        this.x = this.game.width;
        this.y = Math.random() * (this.game.height - this.height);

        this.vx = Math.random() * 0.1 + 0.3;
        // try {
        //     this.image = worm;
        //     console.log(this.image);//即使没有通过选择器,我们可以直接在JS中通过id访问到dom元素
        //     // 有id属性的dom自动添加到JavaScript做一个全局变量
        // } catch (error) {
        //     console.error(error);
        // }
        this.image = new Image();
        this.image.src = "./images/worm.png"
    }
}

class Ghost extends Enemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 261;
        this.spriteHeight = 209;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        this.x = this.game.width;
        this.y = Math.random() * (this.game.height - this.height);
        this.vx = Math.random() * 0.1 + 0.3;
        this.image = new Image();
        this.image.src = "./images/ghost.png";
        this.angle = 0;
        this.amplitude = 10;//波峰
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.y += Math.sin(this.angle) * this.amplitude;
        this.angle += 0.1;
    }

    draw() {
        this.game.ctx.save();
        this.game.ctx.globalAlpha = 0.5;
        super.draw(this.game.ctx);
        this.game.ctx.restore();
        // 先把ctx的状态存储起来,改变透明度之后用这个透明度去draw鬼魂，之后就重新换回原来的状态
    }
}

class Spider extends Enemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 310;
        this.spriteHeight = 175;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        this.x = this.game.width * Math.random();
        this.y = 0 - this.height;
        this.image = new Image();
        this.image.src = "./images/spider.png";
        this.vx = 0;
        this.vy = Math.random() * 0.1 + 0.3;
        this.maxLength = Math.random() * this.game.height;
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.y += this.vy * deltaTime;
        if (this.y < 0 - this.height * 2) this.markedForDeletion = false;
        if (this.y >= this.maxLength) this.vy *= -1;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, 0);
        ctx.lineTo(this.x + this.width / 2, this.y);
        ctx.stroke();
        super.draw(ctx);
    }
}

const game = new Game(canvas.getContext('2d'), canvas.width, canvas.height);

let lastTime = 1;
function animate(timeStamp) {
    // 除了第一次调用,timeStamp都是浏览器调用的时候自己传入的,timeStamp
    game.ctx.clearRect(0, 0, game.width, game.height);
    let deltaTime = timeStamp - lastTime;//增量时间
    lastTime = timeStamp;

    game.update(deltaTime);
    game.draw()

    requestAnimationFrame(animate);
    // 每秒60帧，也就是函数被执行60次，假如我们每次执行函数移动1m,那么根据电脑性能的不同（帧数不同），每秒
    // 移动的距离也不同
}
animate(0);