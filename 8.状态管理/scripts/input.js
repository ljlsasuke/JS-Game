export default class Input {
    constructor() {
        this.lastKey = ''
        this.initListener()
    }
    initListener() {
        window.addEventListener('keydown', (e) => {
            const { code } = e
            switch (code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.lastKey = 'PRESS up'
                    break
                case 'ArrowLeft':
                case 'KeyA':
                    this.lastKey = 'PRESS left'
                    break
                case 'ArrowDown':
                case 'KeyS':
                    this.lastKey = 'PRESS down'
                    break
                case 'ArrowRight':
                case 'KeyD':
                    this.lastKey = 'PRESS right'
                    break

            }
        })
        window.addEventListener('keyup', (e) => {
            const { code } = e
            switch (code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.lastKey = 'RELEASE up'
                    break
                case 'ArrowLeft':
                case 'KeyA':
                    this.lastKey = 'RELEASE left'
                    break
                case 'ArrowDown':
                case 'KeyS':
                    this.lastKey = 'RELEASE down'
                    break
                case 'ArrowRight':
                case 'KeyD':
                    this.lastKey = 'RELEASE right'
                    break
            }
        })
    }
}