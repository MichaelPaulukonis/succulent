import { draggable } from '@dom-native/draggable'
import * as htmlToImage from 'html-to-image'
import download from 'downloadjs'
import Mousetrap from 'mousetrap'
import { getText } from './lib/textManager'

let saver = () => {}

document.addEventListener('DOMContentLoaded', async function () {
  var width = document.documentElement.clientWidth
  var height = document.documentElement.clientHeight

  saver = saveImage(width, height)

  Mousetrap.bind('command+s', () => {
    saver()
    return false
  })

  // // keep this around, so we can work with them later
  const frags = await getText()
  const items = buildText(frags)

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
  fadeOutEffect(document.getElementById('infobox'), width, height)
})

const buildText = lines => {
  return lines.map(line => {
    const li = document.createElement('li')
    li.className = 'drag-me potentialText'
    li.textContent = line
    return li
  })
}

const saveImage = (width, height) => () => {
  htmlToImage.toPng(document.getElementById('page'), { backgroundColor: '#000', width, height })
    .then(function (dataUrl) {
      download(dataUrl, 'my-node.png')
    })
}

const fadeOutEffect = (target, width, height) => {
  const fadeEffect = setInterval(_ => {
    if (!target.style.opacity) {
      target.style.opacity = 1
    }
    if (target.style.opacity > 0) {
      target.style.opacity -= 0.1
    } else {
      clearInterval(fadeEffect)
      target.parentElement.removeChild(target)
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
