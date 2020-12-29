// look at layout thrashing - http://blog.wilsonpage.co.uk/preventing-layout-thrashing/

// from https://github.com/processing/p5.js/blob/150251f8da3217af5171f65a4b30085b27855559/src/core/main.js#L368

let _lastFrameTime = 0
const _targetFrameRate = 30
let _requestAnimId = null

export const loop = (drawFn) => {
  const now = window.performance.now()
  const timeSinceLast = now - _lastFrameTime
  const targetTimeBetweenFrames = 1000 / _targetFrameRate

  // only draw if we really need to; don't overextend the browser.
  // draw if we're within 5ms of when our next frame should paint
  // (this will prevent us from giving up opportunities to draw
  // again when it's really about time for us to do so). fixes an
  // issue where the frameRate is too low if our refresh loop isn't
  // in sync with the browser. note that we have to draw once even
  // if looping is off, so we bypass the time delay if that
  // is the case.
  const epsilon = 5
  if (timeSinceLast >= targetTimeBetweenFrames - epsilon) {
    // mandatory update values(matrixs and stack)
    drawFn()
    _lastFrameTime = now
  }

  // get notified the next time the browser gives us
  // an opportunity to draw.
  _requestAnimId = window.requestAnimationFrame(() => loop(drawFn))
}

export const setLoop = (drawFn) => {
  if (_requestAnimId) {
    window.cancelAnimationFrame(_requestAnimId)
  }
  loop(drawFn)
}
