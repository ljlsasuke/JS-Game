/**
 * @type {HTMLCanvasElement}
 */
// 告诉vscode,这个项目为canvas项目
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width = 500;
const canvasHeight = canvas.height = 1000;

const randomNum = (min, max) => Math.floor(Math.random() * (max - min)) + min

let gameFrame = 0;

class Enemy {
    constructor(imageSrc) {
        // this.imgWidth = 293;图1
        // this.imgHeight = 155;
        // this.imgWidth = 218;//图3                       
        // this.imgHeight = 177;
        this.imgWidth = 213;//图4                      
        this.imgHeight = 213;
        // this.imgWidth = 266;//图2
        // this.imgHeight = 188;//切图大小
        this.scale = 0.5;//放缩大小倍数
        this.frame = 0;//所处的帧数
        this.speed = Math.random() * 6 + 1;//移动速度
        this.width = this.imgWidth * this.scale;
        this.height = this.imgHeight * this.scale;//实际在canvas中的大小
        this.x = Math.random() * (canvasWidth - this.width);    //这样可以避免生成位置卡在墙壁里
        this.y = Math.random() * (canvasHeight - this.height);
        this.image = new Image();
        this.image.src = imageSrc;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);  //配合gameFrame控制每帧切换的速度
        // this.angle = Math.random() * 2;//角度
        // this.angleSpeed = Math.random() * 2 + 0.5//角速度，也就是角度单位时间内的增加量
        // this.amplitude = Math.random() * 2//正弦波振幅
        // this.radius = Math.random() * 200 + 50;//运动的半径
        this.targetX = Math.random() * (canvasWidth - this.width);//代表目标位置的坐标，也可以说是新位置
        this.targetY = Math.random() * (canvasHeight - this.height);

    }
    update() {
        /*this.x -= this.speed;
        this.y += Math.sin(this.angle) * this.amplitude 
        if (this.x + this.width < 0) this.x = canvasWidth  如果全身走过，就把位置调到右边
        1.正弦波运动*/

        //                                角度转为弧度  可以通过修改这个number修改周期       让初始位置
        /*this.x = this.radius * Math.sin(this.angle * Math.PI / 180) + (canvasWidth / 2 - this.width / 2)
        this.y = this.radius * Math.cos(this.angle * Math.PI / 180) + (canvasHeight / 2 - this.height / 2)
        2.通过修改周期和半径，有很多种运动方式，ps:x和y的半径不一定要一样，除非要做圆周运动
        修改x和y的不同周期，可以用很多种玩法 1，2都要求有一个角度和角速度（下面这行就是角速度的运用）*/
        // this.angle += this.angleSpeed


        // 3.每 x 帧 修改一次目标位置
        if (gameFrame % 100 === 0) {//每30帧更新一次目标位置
            this.targetX = Math.random() * (canvasWidth - this.width);
            this.targetY = Math.random() * (canvasHeight - this.height);
        }
        let dx = this.x - this.targetX;
        let dy = this.y - this.targetY;
        this.x -= dx / 80;
        this.y -= dy / 80;//走到这个目标位置需要80帧


        if (gameFrame % this.flapSpeed === 0) {//每 this.flapSpeed帧换一次图片形成动画
            this.frame > 4 ? this.frame = 0 : this.frame++
            /*gameFrame = 0;一开始我是想着所有的敌人帧的切换都依赖这个全局变量，那么他一定会自增到非常大
            所以就想着每次切换后就把他归零，然后这样进行循环，但是出现了有的敌人不切换帧的问题
            其实这样也不符合规范和gameFrame的意义
            */
        }
    }

    draw() {
        ctx.drawImage(this.image, this.frame * this.imgWidth, 0, this.imgWidth, this.imgHeight,
            this.x, this.y, this.width, this.height)
    }
}

let enemyCount = 40;
const enemyList = [];
while (enemyList.length < enemyCount) {
    enemyList.push(new Enemy(
        './images/enemy4.png'
    ))
}


function animate()//
{
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    enemyList.forEach(enemy => {
        enemy.update();
        enemy.draw()
    })
    gameFrame > 10000 ? gameFrame = 0 : gameFrame++;
    // 每10000帧就归零   防止gameFrame过大,但我不知道这样做有没有必要
    requestAnimationFrame(animate);
}
animate()

