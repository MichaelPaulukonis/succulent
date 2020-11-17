import $ from 'jquery'
import { draggable } from '@dom-native/draggable'
import defaultText from './default_text.json'
import tumblrRandomPost from './tumblr_random'

$(document).ready(async function () {
  var width = $(document).width()
  var height = $(document).height()

  let corpus = []
  try {
    corpus = await tumblrRandomPost()
  } catch (_) {
    corpus = defaultText.lines
  }

  buildText(corpus)

  var items = $('li').not('#mustshow').get()
    .sort(_ => Math.round(Math.random()) - 0.5)
    .slice(0, 30).concat($('#mustshow'))

  reposition(items, width, height)
  recolor(items)

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
  const parent = document.getElementById('page-wrap')
  lines.forEach(line => {
    const li = document.createElement('li')
    li.className = 'drag-me potentialText'
    li.textContent = line
    parent.appendChild(li)
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

function reposition (items, winWidth, winHeight) {
  for (var i = items.length - 1; i >= 0; --i) {
    var maxWidth = Math.floor(Math.random() * (winWidth / 2 - 100)) + 100

    var xVar = Math.floor((Math.random() * (winWidth - (maxWidth)))) // + (0.5 * maxWidth);            // x value
    var yVar = Math.floor((Math.random() * winHeight - 100)) // y value, but is sometimes off-screen...

    // size (and opacity will be a function of size)
    var zVar = Math.floor((Math.random() * 450)) + 50 // z value, text get larger.

    $(items[i]).css({
      position: 'absolute',
      display: 'block',
      left: xVar + 'px',
      top: yVar + 'px',
      'font-size': zVar + '%',
      opacity: (zVar) / 600 + 0.1,
      'max-width': maxWidth
    })
  }
}

// TODO: would be nice to be able to select some color "schemes" or families....
// TODO: test these ranges sometime
var recolor = function (items) {
  $.each(items, function () {
    var textColor = 'rgb(' + (Math.floor((256) * Math.random())) +
      ',' + (Math.floor((256) * Math.random())) +
      ',' + (Math.floor((256) * Math.random())) + ')'

    var backgroundColor = 'rgb(' + (Math.floor((256) * Math.random())) +
      ',' + (Math.floor((256) * Math.random())) +
      ',' + (Math.floor((256) * Math.random())) + ')'

    $(this).css({ color: textColor, 'background-color': backgroundColor })
  })
}
