import { draggable } from '@dom-native/draggable'
import * as htmlToImage from 'html-to-image'
import download from 'downloadjs'
import Mousetrap from 'mousetrap'
import { getText } from './lib/textManager'

let saver = () => { }
let move = () => { }
let _colors = []

const selectSome = arr => toTake => arr.sort(_ => Math.round(Math.random()) - 0.5).slice(0, toTake)
const tf = _ => Boolean(Math.round(Math.random()))

const dagify = items => {
  const list = document.getElementById('dragula')
  list.append(...items)

  draggable(list, '.drag-me')
  document.getElementById('page').addEventListener('DRAGEND', (evt) => {
    let idx = evt.target.style.zIndex || 0
    idx++
    evt.target.style.zIndex = idx
  })
}

const clearText = () => {
  const parent = document.getElementById('dragula')
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

const createTextElements = async _ => {
  const frags = await getText(30)
  const items = buildListElements(frags)
  return items
}

const buildListElements = lines => {
  return lines.map(line => {
    const li = document.createElement('li')
    li.className = 'drag-me potentialText'
    li.textContent = line
    li.style.position = 'absolute'
    li.style.display = 'block'
    return li
  })
}

const saveImage = (width, height) => () => {
  htmlToImage.toPng(document.getElementById('page'), { backgroundColor: '#000', width, height })
    .then(function (dataUrl) {
      download(dataUrl, 'my-node.png')
    })
}

const fadeOutEffect = (target) => {
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

const reposition = (winWidth, winHeight) => transparent => item => {
  var maxWidth = Math.floor(Math.random() * (winWidth / 2 - 100)) + 100

  var xVar = Math.floor((Math.random() * (winWidth - (maxWidth)))) // + (0.5 * maxWidth);            // x value
  var yVar = Math.floor((Math.random() * winHeight - 100)) // y value, but is sometimes off-screen...

  // size (and opacity will be a function of size)
  var zVar = Math.floor((Math.random() * 450)) + 50 // z value, text get larger.

  item.style.left = `${xVar}px`
  item.style.top = `${yVar}px`
  item.style.opacity = transparent ? (zVar) / 600 + 0.1 : 100

  return item
}

const resize = (winWidth) => item => {
  var maxWidth = Math.floor(Math.random() * (winWidth / 2 - 100)) + 100
  // size (and opacity will be a function of size)
  var zVar = Math.floor((Math.random() * 450)) + 50 // z value, text get larger.

  item.style.fontSize = `${zVar}%`
  item.style.maxWidth = `${maxWidth}px`

  return item
}

const r256 = _ => Math.floor((256) * Math.random())

const randomColor = _ => `rgb(${r256()}, ${r256()}, ${r256()})`

const colorPair = _ => ({
  text: randomColor(),
  background: randomColor()
})

const assignColor = item => color => {
  item.style.color = color.text
  item.style.backgroundColor = color.background
  return item
}

const colorAssigner = colors => {
  let colorIndex = 0
  return items => {
    const newItems = items.map((item, i) => {
      return assignColor(item)(colors[(i + colorIndex) % colors.length])
    })
    colorIndex = colorIndex + 1 % colors.length
    return newItems
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  var width = document.documentElement.clientWidth
  var height = document.documentElement.clientHeight

  saver = saveImage(width, height)
  move = reposition(width, height)(tf())
  _colors = new Array(30).fill(1).map(_ => colorPair())
  const assignColors = colorAssigner(_colors)

  // take apart the colorPositionAndDrag ugh

  Mousetrap.bind('command+s', () => {
    saver()
    return false
  })

  Mousetrap.bind('t', () => {
    clearText()
    createTextElements(width, height)
      .then(items => {
        items = assignColors(items)
        items = items.map(resize(width))
        items = items.map(move)
        dagify(items)

        return false
      })
  })

  Mousetrap.bind('c', () => {
    // TODO: figure out a way to break into sub-groups that move/color independently
    // but stay in the same group
    const items = Array.from(document.querySelectorAll('.potentialText'))
    assignColors(items)
    return false
  })

  Mousetrap.bind('m', () => {
    const items = Array.from(document.querySelectorAll('.potentialText'))
    selectSome(items)(10).map(move)
    return false
  })

  createTextElements(width, height)
    .then(items => {
      items = assignColors(items)
      items = items.map(resize(width))
      items = items.map(move)
      dagify(items)

      fadeOutEffect(document.getElementById('infobox'), width, height)
    })
})
