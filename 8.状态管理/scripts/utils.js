export const KEY_CODE_MAP = {
    up: ['ArrowUp', 'KeyW'],
    left: ['ArrowLeft', 'KeyA'],
    down: ['ArrowDown', 'KeyS'],
    right: ['ArrowRight', 'KeyD'],
}

export const renderStateText = (context, input, player) => {
    context.font = '16px Consola'
    context.fillText('Last input: ' + input.lastKey, 20, 50)
    context.fillText('Current input: ' + player.currentState.state, 20, 80)
}