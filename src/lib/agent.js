import { vector } from './vector'

const Agent = ({
  item,
  location = { x: 0, y: 0 },
  bounding = { width: 0, height: 0 },
  size = { maxWidth: 0, fontSize: 0 },
  direction = { x: 1, y: 1 },
  opacity = 100
}) => {
  const self = {
    item,
    location: { ...location },
    size: { ...size },
    opacity
  }

  const vec = vector({
    location,
    bounding: { width: bounding.width - item.clientWidth, height: bounding.height - item.clientHeight },
    size,
    direction
  })

  const position = pos => {
    self.item.style.left = `${pos.x}px`
    self.item.style.top = `${pos.y}px`
  }

  self.paused = false

  self.next = () => {
    if (self.paused) return self
    vec.next()
    position(vec.location)
    return vec
  }

  self.setLocation = loc => {
    vec.setLocation(loc)
    position(loc)
    return self
  }

  self.item.style.minWidth = `${self.item.clientWidth}px`
  position(location)

  return self
}

export { Agent }
