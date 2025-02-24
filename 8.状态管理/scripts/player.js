import { StandingLeft, StandingRight, SittingLeft, SittingRight, RunningLeft, RunningRight, JumpingLeft, JumpingRight, FallingLeft, FallingRight } from './state.js'
export default class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight
        this.states = [new StandingLeft(this), new StandingRight(this), new SittingLeft(this), new SittingRight(this), new RunningLeft(this), new RunningRight(this), new JumpingLeft(this), new JumpingRight(this), new FallingLeft(this), new FallingRight(this)]
        this.currentState = this.states[1]
        this.image = document.querySelector('#dog')
        this.width = 200
        this.height = 181.83
        this.x = this.gameWidth / 2 - this.width
        this.y = this.gameHeight - this.height
        this.frameX = 0
        this.frameY = 0
        this.maxFrame = 6
        this.speed = 0
        this.maxSpeed = 10
        this.vy = 0
        this.weight = 1
        this.fps = 30
        this.frameTimer = 0
        this.frameInterval = 1000 / this.fps
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context, deltaTime) {
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) this.frameX++
            else this.frameX = 0
            this.frameTimer = 0
        } else {
            this.frameTimer += deltaTime
        }
        context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
    }

    update(input_key) {

        this.currentState.handleInput(input_key)

        this.x += this.speed
        if (this.x <= 0) this.x = 0
        else if (this.x >= this.gameWidth - this.width) this.x = this.gameWidth - this.width
        if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height
        this.y += this.vy
        if (!this.onGround()) {
            this.vy += this.weight
        } else this.vy = 0
    }

    setState(index) {
        this.currentState = this.states[index]
        this.currentState.enter()
    }

    onGround() {
        return this.y >= this.gameHeight - this.height
    }
}