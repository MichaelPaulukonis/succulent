// Dissociator.js
// translated to Javascript in 2013 by ZVK @ dadabots.com || drawordoodle@gmail.com
/*
based on Dissociated-press.php by David Pascoe-Deslauriers <dpascoed@csiuo.com>
Here's how the algorithm works:
1. Break up the corpus into a series tokens, in my case words and spaces.
2. Jump to a random token.
3. Select the 3 next tokens and output them.
4. Find the other occurrences of those 3 tokens in the corpus. Randomly select one of those occurrences and jump to that location in the text.
a. If 2 or less occurrences are found, jump to a random token instead to avoid loops.
5. Repeat steps 3 and 4 until we've outputted enough. */

// found @ https://raw.githubusercontent.com/ZVK/Dissociator/master/dissociator.js

// HELPER FUNCTIONS
function capitalizeFirstLetter (string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}

// MAIN FUCNTIONS
// Dissociate the given string.
export default function dissociate ({ str, randomStart = true, groupSize = 3, max = 64, wordMode = true }) {
  // defaults
//   randomStart = typeof randomStart !== 'undefined' ? randomStart : true
//   groupSize = typeof groupSize !== 'undefined' ? groupSize : 3
//   max = typeof max !== 'undefined' ? max : 64
//   wordMode = typeof wordMode !== 'undefined' ? wordMode : true
  // vars
  var res
  var tokens = []
  // PREP WORK
  // force groupSize to be at least 2
  if (groupSize < 2) {
    groupSize = 2
  }
  // capitalize the first word
  var capital = true
  // remove ()[]{} from corpus
  str = str.replace(['(', ')', '[', ']', '{', '}'], '')
  // break up tokens
  tokens = str.split(/[ \r\n\t]/)
  // clean up token array
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i] === '') {
      tokens.splice(i, 1)
    }
  }
  // Init vars
  var out = ''
  var lastMatch = []

  // DISSOCIATIVE PROCESS
  // if we start at the beginning, start here
  if (!randomStart) {
    for (var n = 0; n < groupSize; n++) {
      lastMatch.push(tokens[n])
      res = cleanToken(tokens[n], capital)
      out = res[0]
      capital = res[1]
    }
  }
  // loop until we have enough output
  var i = 0
  while (i < max + 32) {
    // attempt to end on a full sentence
    if (i > max - 8 && capital) {
      break
    }
    // if the lastmatch group isn't good enough, start randomly
    if (lastMatch.length < groupSize) {
      var loc = Math.floor((Math.random() * (tokens.length - 1 - groupSize)))
      // console.log("loc ="+loc);
      lastMatch = []
      for (var n = 0; n < groupSize; n++) {
        lastMatch.push(tokens[loc + n])
        res = cleanToken(tokens[loc + n], capital)
        lastMatch.push('lastmatch ' + tokens[loc + n])
        // console.log(res);
        if (res) {
          out = out.concat(res[0])
          capital = res[1]
        }
      }
    } else {
      var chains = findChains(tokens, lastMatch)
      lastMatch = []
      // if there aren't enough chains, start randomly next time(avoiding loops)
      if (chains.length > 2) {
        var loc = chains[Math.random(0, chains.length - 1)]
        for (var n = 0; n < groupSize; n++) {
          lastMatch.push('chains' + tokens[loc + n])
          // console.log(loc+n);
          res = cleanToken(tokens[loc + n], capital)
          if (res) {
            out = out.concat(res[0])
            capital = res[1]
          }
        }
      }
    }
    i++
  }
  console.log(out)
  return out
}

// join the tokens with proper typography
function cleanToken (token, capital) {
  if (token) {
    // console.log("token ="+token);
    // console.log("token ="+capital);
    if (capital) {
      token = capitalizeFirstLetter(token)
      // console.log(token);
      capital = false
    }
    var p = token.slice(-1)
    if (p === '.' || p === '!' || p === '?') {
      capital = true
      return new Array(token + ' ', capital)
    } else {
      return new Array(token + ' ', capital)
    }
  }
}

// find Markov Chains

function findChains (haystack, needle) {
  var chain = []
  for (var i = 0; i < haystack.length - needle.length; i++) {
    if (haystack[i] === needle[0]) {
      var matches = true
      for (var j = 1; j < needle.length; j++) {
        if (haystack[i + j] !== needle[j]) {
          matches = false
          break
        }
      }
      if (matches === true) {
        chain.push(i + needle.length)
      }
    }
  }
  return chain
}
