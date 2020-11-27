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
const range = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const dragify = items => {
  const list = document.getElementById('dragula')
  list.append(...items)

  draggable(list, '.drag-me')
  document.getElementById('page').addEventListener('DRAGSTART', (evt) => {
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

const group = items => {
  const group1 = range(0, items.length - 3)
  const group2 = range(group1 + 1, items.length - 2)
  // const group3 = items.length - 1
  return items.map((item, idx) => {
    if (idx <= group1) {
      item.className += ' group1'
    } else if (idx <= group2) {
      item.className += ' group2'
    } else {
      item.className += ' group3'
    }
    return item
  })
}

const createTextElements = async _ => {
  const frags = await getText(30)
  const items = buildListElements(frags)
  return group(items)
}

const buildListElements = fragments => {
  return fragments.map(line => {
    const li = document.createElement('li')
    li.className = 'drag-me succulentText'
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
  if (!target.style.opacity) {
    target.style.opacity = 1
  }
  const fadeEffect = setInterval(_ => {
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

  var xVar = Math.floor((Math.random() * (winWidth - maxWidth)))
  var yVar = Math.floor((Math.random() * winHeight - 100))

  var zVar = Math.floor((Math.random() * 450)) + 50

  item.style.left = `${xVar}px`
  item.style.top = `${yVar}px`
  item.style.opacity = transparent ? (zVar) / 600 + 0.1 : 100

  return item
}

const resize = (winWidth) => item => {
  var maxWidth = Math.floor(Math.random() * (winWidth / 2 - 100)) + 100
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
  move = reposition(width, height)(tf()) // also adds transparency, which cannot then be changed
  _colors = new Array(30).fill(1).map(_ => colorPair())
  const assignColors = colorAssigner(_colors)

  const fader = (width, height) => fadeOutEffect(document.getElementById('infobox'), width, height)

  const builder = (width, height, cb) => createTextElements(width, height)
    .then(items => {
      items = assignColors(items)
      items = items.map(resize(width))
      items = items.map(move)
      dragify(items)

      if (cb && typeof cb === 'function') { cb() }
    })

  builder(width, height, fader)

  const colorShiftGroup = group => () => {
    const items = Array.from(document.querySelectorAll(`.succulentText.group${group}`))
    assignColors(items)
    return false
  }

  for (let g = 1; g <= 3; g++) {
    Mousetrap.bind(`${g}`, colorShiftGroup(g))
  }

  const mouseCommand = fn => _ => {
    fn()
    return false
  }

  Mousetrap.bind('command+s', mouseCommand(saver))

  Mousetrap.bind('t', mouseCommand(() => {
    clearText()
    builder(width, height)
  }))

  Mousetrap.bind('m', mouseCommand(() => {
    const items = Array.from(document.querySelectorAll('.succulentText'))
    selectSome(items)(10).map(move)
  }))
})
