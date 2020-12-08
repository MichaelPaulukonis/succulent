import { draggable } from '@dom-native/draggable'
import * as domToImage from 'dom-to-image-more'
import download from 'downloadjs'
import Mousetrap from 'mousetrap'
import { getText } from './lib/textManager'
import { vector } from './lib/vector'

let saver = () => { }
let move = () => { }
let _colors = []
let vecs = {}

const config = {
  paused: false,
  numElements: 30,
  mover: null,
  rando: null,
  capturingFrames: false,
  captureCount: 0,
  captureLimit: 100,
  captureOverride: true
}

const selectSome = arr => toTake => arr.sort(_ => Math.round(Math.random()) - 0.5).slice(0, toTake)
const tf = _ => Boolean(Math.round(Math.random()))
const range = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const datestring = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  const secs = String(d.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}${hour}${min}${secs}`
}

const sequentialNameFactory = _ => {
  let frame = 0
  return () => {
    // const name = `succulent.${datestring()}-${String(frame).padStart(6, '0')}.png`
    const name = saveName(String(frame).padStart(6, '0'))
    frame += 1
    return name
  }
}

const saveName = infix => `succulent.${datestring()}${infix ? `-${infix}` : ''}.png`

let frameNamer = null

const dragify = _ => {
  const list = document.getElementById('dragula')
  draggable(list, '.drag-me')
  document.getElementById('page').addEventListener('DRAGSTART', (evt) => {
    const item = vecs[evt.target.id]
    item.paused = true
    let idx = evt.target.style.zIndex || 0
    idx++
    evt.target.style.zIndex = idx
  })
  document.getElementById('page').addEventListener('DRAGEND', (evt) => {
    const item = vecs[evt.target.id]
    const x = parseInt(evt.target.style.left, 10)
    const y = parseInt(evt.target.style.top, 10)
    item.setLocation({ x, y })
    item.paused = false
  })
}

const cleanSlate = () => {
  const parent = document.getElementById('dragula')
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
  vecs = {}
  clearInterval(config.mover)
  clearInterval(config.rando)
}

const makeVecs = ({ winWidth, winHeight, items }) => {
  const maker = makeVec({ width: winWidth, height: winHeight })
  const sizer = randomSize(winWidth)
  const locator = () => {
    var maxWidth = Math.floor(Math.random() * (winWidth / 2 - 100)) + 100

    var x = Math.floor((Math.random() * (winWidth - maxWidth)))
    var y = Math.floor((Math.random() * (winHeight - 100)))

    return { x, y }
  }

  const vecs = {}
  items.forEach(item => {
    const location = locator()
    const size = sizer()
    vecs[item.id] = maker({ item, location, size })
  })

  return vecs
}

const makeVec = ({ width, height }) => ({ item, location, size }) => {
  const vec = vector({
    item,
    location,
    bounding: { width, height },
    size,
    direction: { x: range(-5, 5), y: range(-5, 5) }
  })
  return vec
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
  const frags = await getText(config.numElements)
  const items = buildListElements(frags)
  return group(items)
}

const randomId = _ => (Math.random() * 0x1000000000).toString(36)

const buildListElements = fragments => {
  return fragments.map(line => {
    const li = document.createElement('li')
    li.className = 'drag-me succulentText'
    li.id = randomId()
    li.textContent = line
    li.style.position = 'absolute'
    li.style.display = 'block'
    return li
  })
}

const saveImage = (width, height) => (namer = saveName) => {
  domToImage.toPng(document.getElementById('container'), {
    width,
    height,
    filter: node => node.id !== 'infobox'
  })
    .then(function (dataUrl) {
      download(dataUrl, namer())
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

const randomPosition = (winWidth, winHeight) => vecs => elem => {
  const maxWidth = Math.floor(Math.random() * (winWidth / 2 - 100)) + 100

  const x = range(0, winWidth - maxWidth)
  const y = range(0, winHeight - 100)

  const item = vecs[elem.id]
  item.setLocation({ x, y })

  return item
}

const setTransparency = transparentp => elem => {
  var zVar = Math.floor((Math.random() * 450)) + 50
  elem.style.opacity = transparentp ? (zVar) / 600 + 0.1 : 100
  return elem
}

const resize = (winWidth) => item => {
  var maxWidth = Math.floor(Math.random() * (winWidth / 2 - 100)) + 100
  var zVar = Math.floor((Math.random() * 450)) + 50 // z value, text get larger.

  item.style.fontSize = `${zVar}%`
  item.style.maxWidth = `${maxWidth}px`

  return item
}

const randomSize = (winWidth) => () => {
  var maxWidth = Math.floor(Math.random() * (winWidth / 2 - 100)) + 100
  var fontSize = Math.floor((Math.random() * 450)) + 50 // z value, text get larger.
  return {
    maxWidth,
    fontSize
  }
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

const replaceText = elem => {
  getText(1)
    .then(text => {
      if (text[0].trim().length > 0) {
        elem.textContent = text[0]
      }
    })
}

const randomTextElement = _ => {
  const elems = Array.from(document.querySelectorAll('.succulentText'))
  return selectSome(elems)(1)[0]
}

const oneRando = _ => {
  if (!config.paused) replaceText(randomTextElement())
}

const saveFrames = () => {
  if (!config.capturingFrames) {
    config.captureCount = 0
  }
  config.capturingFrames = !config.capturingFrames
}

document.addEventListener('DOMContentLoaded', async function () {
  var width = document.documentElement.clientWidth
  var height = document.documentElement.clientHeight

  saver = saveImage(width, height)
  _colors = new Array(config.numElements).fill(1).map(_ => colorPair())
  const assignT = setTransparency(tf())
  const assignColors = colorAssigner(_colors)

  const fader = (width, height) => fadeOutEffect(document.getElementById('infobox'), width, height)

  const builder = (width, height, cb) => createTextElements(width, height)
    .then(items => {
      items = assignColors(items)
      items = items.map(resize(width))
      items = items.map(assignT)

      const list = document.getElementById('dragula')
      list.append(...items)

      vecs = makeVecs({ winWidth: width, winHeight: height, items })
      move = randomPosition(width, height)(vecs)

      const movit = vecs => () => {
        if (config.paused) return
        Object.keys(vecs).forEach(v => vecs[v].next())
        if (config.capturingFrames) {
          console.log('capturing frame')
          if (frameNamer === null) {
            frameNamer = sequentialNameFactory()
          }
          saver(frameNamer)
          config.captureCount += 1
          if (config.captureCount > config.captureLimit) {
            config.capturingFrames = false
            config.captureCount = 0
          }
        }
      }

      config.mover = setInterval(movit(vecs), 100)

      config.rando = setInterval(oneRando, 2000)

      dragify()

      if (cb && typeof cb === 'function') { cb() }
    })

  builder(width, height, fader)

  const shiftShifter = group => {
    let interval
    let on = false
    return () => {
      if (on) {
        clearInterval(interval)
      } else {
        interval = setInterval(colorShiftGroup(group), 500)
      }
      on = !on
    }
  }

  const colorShiftGroup = group => () => {
    const items = Array.from(document.querySelectorAll(`.succulentText.group${group}`))
    assignColors(items)
    return false
  }

  const mouseCommand = fn => _ => {
    fn()
    return false
  }

  for (let g = 1; g <= 3; g++) {
    Mousetrap.bind(`${g}`, shiftShifter(g))
  }

  Mousetrap.bind('space', mouseCommand(() => { config.paused = !config.paused }))

  Mousetrap.bind('command+s', mouseCommand(saver))

  Mousetrap.bind('command+a', mouseCommand(saveFrames))

  Mousetrap.bind('t', mouseCommand(() => {
    cleanSlate()
    builder(width, height)
  }))

  Mousetrap.bind('m', mouseCommand(() => {
    const elems = Array.from(document.querySelectorAll('.succulentText'))
    selectSome(elems)(10).map(move)
  }))
})
