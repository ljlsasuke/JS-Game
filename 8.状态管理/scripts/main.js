import Player from './player.js'
import Input from './input.js'
import { renderStateText } from './utils.js'
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const player = new Player(canvas.width, canvas.height)
const InputHandler = new Input()

let lastTime = 0
function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.update(InputHandler.lastKey)
    player.draw(ctx, deltaTime)
    renderStateText(ctx, InputHandler, player)
    requestAnimationFrame(animate)
}
animate(0)