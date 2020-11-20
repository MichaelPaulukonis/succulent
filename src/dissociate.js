// ganked from http://cadrpear.tx0.org/dissoc-js/dissociated-press.html

function rand (max) {
  // the interval is [0, max)
  return Math.floor(Math.random() * max)
}

export default function dissociate ({ buffer, context = 2, fragments = 100, start = rand(buffer.length) }) {
//   if (context === undefined) context = 2
//   if (fragments === undefined) fragments = 80
//   if (start === undefined) start = rand(buffer.length)

  var point = start
  var limit = buffer.length
  var output = ''
  var upperBuffer = buffer.toUpperCase()

  for (var i = 0; i < fragments; i++) {
    // Take a slice from nearby.
    var end = point + context + rand(16)
    if (end < limit) {
      output += buffer.slice(point, end)
    } else {
      // wrap around
      end = 1 + context + rand(16)
      output += buffer.slice(point)
      output += buffer.slice(0, end)
    }

    // Find the overlap sequence after the fragment
    var overlap = buffer.slice(end - context, end + 1).toUpperCase()
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
