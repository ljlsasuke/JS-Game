let playerState = 'idle';
const select = document.querySelector('#animationSelect')
select.addEventListener('change', ({ target }) => playerState = target.value)
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width = 600;
const canvasHeight = canvas.height = 600;

const image = new Image();
image.src = './shadow_dog.png';
const spriteWidth = 575;
const spriteHeight = 523;
let gameFrame = 0;
let staggerFrames = 5;//交错帧，这个数字越大，动画就越慢

const spriteAnimations = [];
const animationStates = [
    {
        name: 'idle',//空闲状态
        frames: 7,//帧数
    },
    {
        name: 'jump',//跳跃状态
        frames: 7,//帧数
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',//眩晕
        frames: 11,
    },
    {
        name: 'sit',//坐
        frames: 5,
    },
    {
        name: 'roll',//滚动
        frames: 7,
    },
    {
        name: 'bite',//咬
        frames: 7,
    },
    {
        name: 'ko',//死亡
        frames: 12,
    },
    {
        name: 'getHit',//受攻击
        frames: 4,
    },
]

animationStates.forEach((state, index) => {//生成一个记录了所有状态对应的帧数额坐标的数组
    let frames = {
        loc: []
    }
    for (let i = 0; i < state.frames; i++) //
    {
        let positionX = i * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({ x: positionX, y: positionY });
    }
    spriteAnimations[state.name] = frames;
})
console.log(spriteAnimations);
alert(1)
function animate()//
{
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)    // 这行代码的作用是每次运行都清楚上一次的画布残留
    let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length;
    // 这个position的计算代表什么意义还不太理解
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;
    ctx.drawImage(image, frameX, frameY, spriteWidth, spriteHeight,
        0, 0, canvasWidth, canvasHeight);
    gameFrame++
    requestAnimationFrame(animate);
}
animate()