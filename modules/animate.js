export default ({ update, updateFPS }) => {

  let animationId
  let initialTimestamp
  let initialFrame

  function isAnimate() {
    return !!animationId
  }

  function calculateFPS(timestamp) {

    if (!initialTimestamp) initialTimestamp = timestamp
    if (!initialFrame) initialFrame = animationId

    updateFPS?.(
      Math.round((animationId - initialFrame) / ((timestamp - initialTimestamp) / 1000))
    )
  }

  function startAnimation(timestamp) {

    if (updateFPS) calculateFPS(timestamp)

    update()
    animationId = requestAnimationFrame(startAnimation)
  }

  function stopAnimation() {
    initialTimestamp = undefined
    initialFrame = undefined
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