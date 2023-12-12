export default ({ update, updateFPS }) => {

  let animationId
  let lastFrames = []

  function isAnimate() {
    return !!animationId
  }

  function calculateFPS(timestamp) {

    lastFrames.push(timestamp)

    if (lastFrames.length > 2) {
      lastFrames.shift()

      const elapsedSeconds = (lastFrames.at(-1) - lastFrames[0]) / 1000

      updateFPS?.(
        Math.round(lastFrames.length / elapsedSeconds)
      )
    }
  }

  function startAnimation(timestamp) {

    if (updateFPS) calculateFPS(timestamp)

    update()
    animationId = requestAnimationFrame(startAnimation)
  }

  function stopAnimation() {
    lastFrames = []
    updateFPS?.('')
    cancelAnimationFrame(animationId)
    animationId = undefined
  }

  return {
    startAnimation,
    isAnimate,
    stopAnimation,
  }
}