/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width = 500;
const canvasHeight = canvas.height = 700;
const canvasPosition = canvas.getBoundingClientRect();
//感觉这个和offsetLeft,offsetTop的功能很像啊
const explosionList = [];
let gameFrame = 0;

class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.imgWidth = 200;
        this.imgHeight = 179;
        this.width = this.imgWidth / 2;
        this.height = this.imgHeight / 2;
        this.image = new Image();
        this.image.src = './img.png';
        this.sound = new Audio();
        this.sound.src = './glass.flac'
        this.frame = 0;
        this.angle = Math.random() * 2 * Math.PI
    }

    update() {
        if(this.frame === 0) this.sound.play()

        if (gameFrame % 10 === 0) {
            this.frame++;
        }
    }
    draw() {
        ctx.save()//这几个新的ctx的方法不太熟悉（save,translate,rotate,restore）
        ctx.translate(this.x,this.y)
        ctx.rotate(this.angle)//这个rotate不配合translate使用效果达不到啊
        ctx.drawImage(this.image, this.frame * this.imgWidth, 0,
            this.imgWidth, this.imgHeight, 0 - this.width / 2, 0 - this.height / 2,
            this.width, this.height)
        ctx.restore()
        
    }
}

window.addEventListener('click', (e) => {
    let [positionX, positionY] = [e.pageX - canvasPosition.left, e.pageY - canvasPosition.top];
    explosionList.push(new Explosion(positionX, positionY))
})

function animate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    explosionList.forEach((explosion, index, arr) => {
        explosion.update()
        explosion.draw()
        if (explosion.frame > 5) {
            arr.splice(index, 1);
        }
    })
    gameFrame++
    requestAnimationFrame(animate)
} animate()
