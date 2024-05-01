const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width = 800;
const canvasHeight = canvas.height = 700;

const backgroundLayer1 = new Image();
backgroundLayer1.src = './images/layer-1.png'
const backgroundLayer2 = new Image();
backgroundLayer2.src = './images/layer-2.png'
const backgroundLayer3 = new Image();
backgroundLayer3.src = './images/layer-3.png'
const backgroundLayer4 = new Image();
backgroundLayer4.src = './images/layer-4.png'
const backgroundLayer5 = new Image();
backgroundLayer5.src = './images/layer-5.png'


let gameSpeed = 10;//这个变量是移动的速度

window.addEventListener('load', () => {
    const speedSelect = document.querySelector('.speedSelect')
    const speedShow = document.querySelector('#speedShow')
    speedShow.innerText = gameSpeed;
    speedSelect.addEventListener('change', ({ target }) => {
        // 其实也可以用普通函数，通过this，但我更喜欢这种
        speedShow.innerText = gameSpeed = target.value;
    })

    //这个是用了两个变量x和x2的，通过控制两个变量不断交错地变化，来进行两张图片位置交错的循环，第二张图片全部用到
    // class Layer {
    //     constructor(image, speedModifier) {//speedModifier控制不同的图层有不同的速度
    //         this.x = 0;
    //         this.y = 0;
    //         this.width = 2400;
    //         this.height = 700;
    //         this.x2 = this.width;
    //         this.image = image;
    //         this.speedModifier = speedModifier;
    //         this.speed = gameSpeed * this.speedModifier;
    //     }
    //     update() {
    //         this.speed = gameSpeed * this.speedModifier;
    //         // 重新计算速度
    //         if (this.x <= -this.width) {
    //             this.x = this.width + this.x2 - this.speed;
    //         }
    //         else if (this.x2 <= -this.width) {
    //             this.x2 = this.width + this.x - this.speed;
    //         }
    //         else {
    //             this.x = Math.floor(this.x - this.speed);
    //             this.x2 = Math.floor(this.x2 - this.speed);
    //             这里进行向下取整是为了不出现除不尽的情况,出现空出的区域
    //         }
    //     }
    //     draw() {
    //         ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    //         ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
    //     }
    // }
    // 这个只用一个变量,在第一张图片走完，并且第二张图片刚好显示一个视口的时候
    // 直接归零x,然后继续之前的，由于第二张图片刚好显示一个视口的时候和第一张一样，并且下面要走的路程也一样
    // （相当于第二章图片只用到了一个视口大小）
    // 所以直接归零并不会有影响（和轮播图那个很像）

    // let gameFrame = 0;
    class Layer {
        constructor(image, speedModifier) {//speedModifier控制不同的图层有不同的速度
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 700;
            this.image = image;
            this.speedModifier = speedModifier;
            this.speed = gameSpeed * this.speedModifier;
        }
        update() {
            this.speed = gameSpeed * this.speedModifier;
            // 重新计算速度
            // if (this.x <= -this.width) {
            //     this.x = 0;
            // }
            // else {
            //     this.x =this.x - this.speed;
            //     console.log(this.x);
            // }
            // 这个就是上面if,else的简写形式
            this.x = this.x <= -this.width ? 0 : this.x - this.speed;
            // 这个需要配合一个每帧自减的gameFrame变量使用,通过取余运算,让X在 0 到 2400之间无限循环
            // 但这种方法有缺陷,就是当我们改变gameSpeed的时候会让页面的位置跳转
            // this.x = gameFrame * this.speed % (this.width);

        }
        draw() {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
    }

    const layer1 = new Layer(backgroundLayer1, 0.2);
    const layer2 = new Layer(backgroundLayer2, 0.4);
    const layer3 = new Layer(backgroundLayer3, 0.5);
    const layer4 = new Layer(backgroundLayer4, 0.7);
    const layer5 = new Layer(backgroundLayer5, 1);
    const layerList = [layer1, layer2, layer3, layer4, layer5];

    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        layerList.forEach(layer => {
            layer.update();
            layer.draw();
        })
        // gameFrame--;
        requestAnimationFrame(animate);
    }

    // 要做到无缝滚动，就必须使用两张一样的图片

    // function animate()//
    // {
    //     ctx.clearRect(0, 0, canvasWidth, canvasHeight) // ctx.fillRect(0,0,100,100)//填充这个不需要递归就可以显示，
    //     //但是drawImage必需使用，不然显示不了图像
    //     ctx.drawImage(backgroundLayer5, x, 0)
    //     ctx.drawImage(backgroundLayer5, x2, 0);
    //     if (x <= -2400)
    //         x = 2400 + x2 - gameSpeed;
    //         //为什么加一个x2,和减去gameSpeed不太懂
    //     else if(x2 <= -2400)
    //         x2 = 2400 + x - gameSpeed;
    //     else{
    //         x -= gameSpeed;//只是简单的去减去一个gameSpeed，会出现图片长度不是gameSpeed的整数倍的情况，然后就可能产生空隙
    //         x2 -=gameSpeed;
    //     }

    //     requestAnimationFrame(animate)
    // }
    animate()
})