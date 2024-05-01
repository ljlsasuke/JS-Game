/**
 * @type {HTMLCanvasElement}
 */
import { debounce } from "./utils/debounce.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let canvasWidth = canvas.width = window.innerWidth
let canvasHeight = canvas.height = window.innerHeight
ctx.font = '50px impact'

const collisionCanvas = document.getElementById('collision');
const collisionCtx = collisionCanvas.getContext('2d');
let collisionCanvasWidth = collisionCanvas.width = window.innerWidth
let collisionCanvasHeight = collisionCanvas.height = window.innerHeight

//窗口大小变化时调整画布大小
// 调出控制台，F11全屏等都会触发事件
const resetSize = () => {
    console.log('触发窗口大小事件');
    canvasWidth = canvas.width = window.innerWidth
    canvasHeight = canvas.height = window.innerHeight
    collisionCanvasWidth = collisionCanvas.width = window.innerWidth
    collisionCanvasHeight = collisionCanvas.height = window.innerHeight
    ctx.font = '50px impact' // 不知道为什么触发这个事件就会改变ctx.font 为 10px sans-serif,我还要手动调一下
}
window.addEventListener('resize', debounce(resetSize, 100))

let randomColorList = () => {
    return [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
}


let score = 0;

let timeToNextRaven = 0;
let ravenInterval = 1000;//每1000ms创建一只乌鸦
let lastTime = 0;
let gameOver = false;//如果有一只乌鸦到了边缘就会游戏结束

let ravenList = [];
class Raven {
    constructor() {
        this.x = canvasWidth;
        this.vx = Math.random() * 5 + 3 + score * 0.2;
        this.vy = Math.random() * 5 - 2.5;
        this.isexists = true;
        this.frame = 0;
        this.scale = Math.random() * 0.6 + 0.4
        this.image = new Image();
        this.image.src = './static/raven.png';
        this.imageWidth = 271;
        this.imageHeight = 194;
        this.width = this.imageWidth * this.scale;
        this.height = this.imageHeight * this.scale;
        this.y = Math.random() * (canvasHeight - this.height);
        this.timeSinceFlap = 0;
        this.flapInterval = 50;//这两个新东西不太理解
        this.rgbArr = randomColorList();
        this.color = `rgb(${this.rgbArr[0]},${this.rgbArr[1]},${this.rgbArr[2]})`;//用这个颜色去给每一只乌鸦做标识，结合getImageData去找我们点击了那一只乌鸦，但有很小的机率生成rgb完全一样的
        this.hasTrail = Math.random() < 0.3;
    }

    update(deltaTime) {
        if (this.y < 0 || this.y + this.height > canvasHeight) {
            this.vy = -this.vy
        }
        this.x -= this.vx
        this.y += this.vy
        if (this.x + this.width < 0) this.isexists = false;
        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval) {
            this.frame >= 5 ? this.frame = 0 : this.frame++
            this.timeSinceFlap = 0
            if (this.hasTrail)//根据是hasTaril来决定这只乌鸦是否有轨迹
            {
                for (let i = 0; i < 5; i++) {//一次绘制5个粒子
                    particleList.push(new Particle(this.x + this.width, this.y + this.height / 2, this.width, this.color))
                }
            }

        }
        if (this.x + this.width < 0) gameOver = true;
    }

    draw() {
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.imageWidth, 0, this.imageWidth, this.imageHeight,
            this.x, this.y, this.width, this.height)
    }
}


let explosionList = [];
class Explosion {
    constructor(x, y, width, height) {
        this.image = new Image();
        this.image.src = './static/getHit.png';
        this.imageWidth = 200;
        this.imageHeight = 179;
        this.sound = new Audio();
        this.sound.src = './static/glass.flac';
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.frame = 0;
        this.isexists = true;
        this.timeSinceFlap = 0;
        this.flapInterval = 50;
    }
    update(deltaTime) {
        if (this.frame === 0) this.sound.play()
        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval) {
            this.timeSinceFlap = 0;
            this.frame >= 5 ? this.isexists = false : this.frame++
        }
    }
    draw() {
        ctx.drawImage(this.image, this.frame * this.imageWidth, 0, this.imageWidth, this.imageHeight,
            this.x, this.y, this.width, this.height)
    }
}

let particleList = [];
class Particle {
    constructor(x, y, size, color) {
        this.size = size;//用乌鸦的宽度去和圆粒子的初始半径做一个关联
        this.x = x + Math.random() * 50 - 25;
        this.y = y + Math.random() * 50 - 25;
        this.radius = Math.random() * this.size / 10;
        this.maxRadius = Math.random() * 20 + 35;
        this.isexists = true;
        this.speedX = Math.random() + 0.5;
        this.color = color;
    }
    update() {
        this.x += this.speedX;
        this.radius += 0.5;
        if (this.radius > this.maxRadius - 2)//在删掉过大的粒子之前先进行了update和draw方法，进行draw的时候，
            //粒子的透明度不断在1和0之间变化就会造成闪烁，需要提前删除
            this.isexists = false;
    }
    draw() {
        ctx.save()
        ctx.globalAlpha = 1 - this.radius / this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill()
        ctx.restore()//恢复我们保存的那些可以影响全局的canvas属性，以免影响了别的canvas元素
    }
}


function drawScore() {
    //两层模仿阴影效果
    ctx.fillStyle = 'black';
    ctx.fillText('Score :' + score, 45, 72)
    ctx.fillStyle = 'white';
    ctx.fillText('Score :' + score, 50, 75)
}

function drawGameOver() {
    ctx.textAlign = 'center'
    ctx.fillStyle = 'black';
    ctx.fillText('游戏结束，你的分数是 :' + score, canvasWidth / 2, canvasHeight / 2)
    ctx.fillStyle = 'white';
    ctx.fillText('游戏结束，你的分数是 :' + score, canvasWidth / 2 + 5, canvasHeight / 2 + 3)
}

function animate(timestamp)//当前回调被触发的时间戳,requestAnimationFrame指定的回调会被传入这一个参数,
//但是当函数第一次被触发时由于是我们手动调用，所以并没有这个值，我们需要手动去传一个
{
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    collisionCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    let deltaTime = timestamp - lastTime;//当前函数触发的时间减去上一次的时间得到两个函数之间相差的时间
    lastTime = timestamp;
    timeToNextRaven += deltaTime;
    if (timeToNextRaven > ravenInterval) {
        ravenList.push(new Raven())
        timeToNextRaven = 0;
        ravenList.sort((a, b) => a.width - b.width)//对数组进行排序，先把宽度小的排在前面，先进行绘制
    }
    drawScore();
    [...particleList, ...ravenList, ...explosionList].forEach(item => item.update(deltaTime));
    //这里不用原数组遍历有什么好处吗，不太懂
    // 这下知道了
    [...particleList, ...ravenList, ...explosionList].forEach(item => item.draw());
    ravenList = ravenList.filter(raven => raven.isexists);
    explosionList = explosionList.filter(explosion => explosion.isexists);
    particleList = particleList.filter(particle => particle.isexists);
    if (!gameOver)
        requestAnimationFrame(animate);
    else
        drawGameOver();
}
animate(0)

window.addEventListener('click', (e) => {
    const { data } = collisionCtx.getImageData(e.pageX, e.pageY, 1, 1);
    ravenList.forEach(raven => {
        if (raven.rgbArr[0] !== data[0] || raven.rgbArr[1] !== data[1] || raven.rgbArr[2] !== data[2])
            return;//如果有一个值不匹配就跳出本次循环
        raven.isexists = false
        raven.hasTrail ? score += 2 : score++//有路径的一个两分，没有的一分
        explosionList.push(new Explosion(raven.x, raven.y, raven.width, raven.height))
    })
})