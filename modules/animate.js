export default (f) => {
  let animationId

  function isAnimate() {
    return !!animationId
  }

  function startAnimation() {
    f()
    animationId = requestAnimationFrame(startAnimation)
  }

  function stopAnimation() {
    cancelAnimationFrame(animationId)
    animationId = undefined
  }

  return {
    startAnimation,
    isAnimate,
    stopAnimation,
  }
}