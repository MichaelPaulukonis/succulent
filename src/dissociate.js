// ganked from http://cadrpear.tx0.org/dissoc-js/dissociated-press.html

function rand (max) {
  // the interval is [0, max)
  return Math.floor(Math.random() * max)
}

export default function dissociate ({ text, context = 2, quaver = 16, fragments = 100, start = rand(text.length) }) {
  var point = start
  var limit = text.length
  var output = ''
  var upperBuffer = text.toUpperCase()

  for (var i = 0; i < fragments; i++) {
    // Take a slice from nearby.
    var end = point + context + rand(quaver)
    if (end < limit) {
      output += text.slice(point, end)
    } else {
      // wrap around
      end = 1 + context + rand(quaver)
      output += text.slice(point)
      output += text.slice(0, end)
    }

    // Find the overlap sequence after the fragment
    var overlap = text.slice(end - context, end + 1).toUpperCase()
    // Jump somewhere random
    point = rand(limit)
    // Look for the next overlap
    point = upperBuffer.indexOf(overlap, point)
    if (point === -1) {
      // wrap around
      point = upperBuffer.indexOf(overlap)
      if (point === -1) {
        // wat
        // give up
        point = 0
      }
    }
    // Go to the *end* of the overlapping fragment
    point += context
  }

  return output
}
