import { draggable } from '@dom-native/draggable'
import Mousetrap from 'mousetrap'
import { getText } from './lib/textManager'
import { Agent } from './lib/agent'
import { sequentialNameFactory, saveImage } from './lib/namer'
import { setLoop } from './lib/drawLoop'

let saver = () => { }
let move = () => { }
let agents = {}

const config = {
  paused: false,
  numElements: 30,
  mover: null,
  capturingFrames: false,
  captureCount: 0,
  captureLimit: 500,
  captureN: 3,
  randoTextIntervalFrames: 50,
  nextFrameInterval: 100,
  frameCount: 0,
  colorShiftInterval: 500
}

const selectSome = arr => toTake => arr.sort(_ => Math.round(Math.random()) - 0.5).slice(0, toTake)
const tf = _ => Boolean(Math.round(Math.random()))
const range = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

let frameNamer = null

const dragify = _ => {
  const list = document.getElementById('dragula')
  draggable(list, '.drag-me')
  // TODO: it would be nice if we could notify the agents they are moving or have been moved
  // and THEY could decide what to do
  document.getElementById('page').addEventListener('DRAGSTART', (evt) => {
    const item = agents[evt.target.id]
    item.paused = true
    let idx = evt.target.style.zIndex || 0
    idx++
    evt.target.style.zIndex = idx
  })
  document.getElementById('page').addEventListener('DRAGEND', (evt) => {
    const item = agents[evt.target.id]
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
  agents = {}
}

const makeAgents = ({ winWidth, winHeight, items }) => {
  const maker = makeAgent({ width: winWidth, height: winHeight })
  const sizer = randomSize(winWidth)
  const locator = () => {
    var maxWidth = Math.floor(Math.random() * (winWidth / 2 - 100)) + 100

    var x = Math.floor((Math.random() * (winWidth - maxWidth)))
    var y = Math.floor((Math.random() * (winHeight - 100)))

    return { x, y }
  }

  const _agents = {}
  items.forEach(item => {
    const location = locator()
    const size = sizer()
    _agents[item.id] = maker({ item, location, size })
  })

  return _agents
}

const makeAgent = ({ width, height }) => ({ item, location, size }) => {
  const agent = Agent({
    item,
    location,
    bounding: { width, height },
    size,
    direction: { x: range(-5, 5), y: range(-5, 5) }
  })
  return agent
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
  const items = frags.map(buildListElement)
  return group(items)
}

const randomId = _ => (Math.random() * 0x1000000000).toString(36)

const buildListElement = line => {
  const li = document.createElement('li')
  li.className = 'drag-me succulentText'
  li.id = randomId()
  li.textContent = line
  li.style.position = 'absolute'
  li.style.display = 'block'
  return li
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

const randomPosition = (winWidth, winHeight) => agents => elem => {
  const maxWidth = Math.floor(Math.random() * (winWidth / 2 - 100)) + 100

  const x = range(0, winWidth - maxWidth)
  const y = range(0, winHeight - 100)

  const item = agents[elem.id]
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
  // TODO: also need to resize the vector
  replaceText(randomTextElement())
}

const saveFrames = () => {
  if (!config.capturingFrames) {
    config.captureCount = 0
    frameNamer = sequentialNameFactory()
  }
  config.capturingFrames = !config.capturingFrames
}

function capture () {
  config.captureCount += 1
  if (config.captureCount % config.captureN === 1) {
    if (frameNamer === null) {
      frameNamer = sequentialNameFactory()
    }
    saver(frameNamer)
    if (config.captureCount > config.captureLimit * config.captureN) {
      config.capturingFrames = false
      config.captureCount = 0
      frameNamer = null
    }
  }
}

const draw = agents => () => {
  if (config.paused) return
  config.frameCount += 1
  if (config.frameCount % config.randoTextIntervalFrames === 0) {
    oneRando()
  }
  Object.keys(agents).forEach(v => agents[v].next())
  // TODO: hey, what about being paused and dragging things around?
  // don't capture the drag, but the drop?
  // that'd be neat.
  if (config.capturingFrames) capture()
}

const succulent = function () {
  // so we can change the width
  // if this will be dynamic (page-resize, etc)
  // the "saver" will also have to be updated
  var width = 800 // document.documentElement.clientWidth
  var height = document.documentElement.clientHeight

  const container = document.getElementById('container')
  container.style.marginLeft = `${(document.documentElement.clientWidth - width) / 2}px`
  container.style.width = `${width}px`

  saver = saveImage(width, height)

  // by keeping them outside of builder, the color-sets stay constant
  // not saying this is by design or desirable, just point it out
  const colors = new Array(config.numElements).fill(1).map(_ => colorPair())
  const assignColors = colorAssigner(colors)

  const fader = (width, height) => fadeOutEffect(document.getElementById('infobox'), width, height)

  const builder = (width, height, cb) => createTextElements(width, height)
    .then(items => {
      items = assignColors(items)
      items = items.map(resize(width))
      items = items.map(setTransparency(tf()))

      const list = document.getElementById('dragula')
      list.append(...items)

      agents = makeAgents({ winWidth: width, winHeight: height, items })
      move = randomPosition(width, height)(agents)

      dragify()
      setLoop(draw(agents))

      if (cb && typeof cb === 'function') { cb() }
    })

  builder(width, height, fader)

  // TODO: this should be called from movit
  // which is the frame thingy
  const shiftShifter = group => {
    let interval
    let on = false
    return () => {
      if (on) {
        clearInterval(interval)
      } else {
        interval = setInterval(colorShiftGroup(group), config.colorShiftInterval)
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
}

document.addEventListener('DOMContentLoaded', succulent)
