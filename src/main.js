import { draggable } from '@dom-native/draggable'
import defaultText from './default_text.json'
import tumblrRandomPost from './tumblr_random'
import transform from './travesty'
import dissociater from './dissociater'
import dissociate from './dissociate'
import tokenize from './tokenize'
import rebuild from './rebuild'

document.addEventListener('DOMContentLoaded', async function (event) {
  var width = document.documentElement.clientWidth
  var height = document.documentElement.clientHeight

  let corpus = []
  try {
    corpus = await tumblrRandomPost()
  } catch (_) {
    corpus = defaultText.lines
  }

  var lines = corpus
    .sort(_ => Math.round(Math.random()) - 0.5)
    .slice(0, 30)

  const bigSample = corpus.join(' ')
  // for (let i = 0; i <= 3; i++) {
  //   console.log(transform(bigSample, i))
  // }

  // const d = dissociater({ str: bigSample, wordMode: false })
  // console.log(d)

  const d2 = dissociate({ context: 1, buffer: bigSample, fragments: 500 })
  console.log(d2)

  const tokens = tokenize(d2)
  const newItems = rebuild(30)(tokens)
  console.log(JSON.stringify(newItems))

  // const sample = transform(lines.join(' '), 0)

  const items = buildText(newItems)

  const positionedItems = reposition(items, width, height)
  const recoloredItems = recolor(positionedItems)

  const list = document.getElementById('page-wrap')
  list.append(...recoloredItems)

  const parent = Array.from(document.getElementsByClassName('dragula'))[0]
  draggable(parent, '.drag-me')
  parent.addEventListener('DROP', (evt) => {
    let idx = evt.target.style.zindex || 0
    idx++
    evt.target.style.zindex = idx
  })
  fadeOutEffect(document.getElementById('infobox'))
})

const buildText = lines => {
  return lines.map(line => {
    const li = document.createElement('li')
    li.className = 'drag-me potentialText'
    li.textContent = line
    return li
  })
}

const fadeOutEffect = target => {
  const fadeEffect = setInterval(_ => {
    if (!target.style.opacity) {
      target.style.opacity = 1
    }
    if (target.style.opacity > 0) {
      target.style.opacity -= 0.1
    } else {
      clearInterval(fadeEffect)
    }
  }, 400)
}

const reposition = (items, winWidth, winHeight) => {
  const decorated = items.map(item => {
    var maxWidth = Math.floor(Math.random() * (winWidth / 2 - 100)) + 100

    var xVar = Math.floor((Math.random() * (winWidth - (maxWidth)))) // + (0.5 * maxWidth);            // x value
    var yVar = Math.floor((Math.random() * winHeight - 100)) // y value, but is sometimes off-screen...

    // size (and opacity will be a function of size)
    var zVar = Math.floor((Math.random() * 450)) + 50 // z value, text get larger.

    item.style.position = 'absolute'
    item.style.display = 'block'
    item.style.left = `${xVar}px`
    item.style.top = `${yVar}px`
    item.style.fontSize = `${zVar}%`
    item.style.opacity = (zVar) / 600 + 0.1
    item.style.maxWidth = `${maxWidth}px`

    return item
  })
  return decorated
}

const recolor = (items) => {
  return items.map(item => {
    item.style.textColor = 'rgb(' + (Math.floor((256) * Math.random())) +
      ',' + (Math.floor((256) * Math.random())) +
      ',' + (Math.floor((256) * Math.random())) + ')'

    item.style.backgroundColor = 'rgb(' + (Math.floor((256) * Math.random())) +
      ',' + (Math.floor((256) * Math.random())) +
      ',' + (Math.floor((256) * Math.random())) + ')'

    return item
  })
}
