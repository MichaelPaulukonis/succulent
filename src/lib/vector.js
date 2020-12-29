// TODO: take apart the 2D vector components
// and add a 1D vector component - see "vectorMod" (ganked from OBSCURUS)
// and the "agent"-thing can use both
// for example, color and speed might have their own vector things.....
const vector = ({
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
    bounding: { ...bounding },
    size: { ...size },
    direction: { ...direction },
    opacity
  }

  const position = pos => {
    self.item.style.left = `${pos.x}px`
    self.item.style.top = `${pos.y}px`
  }
  self.paused = false

  self.next = () => {
    if (self.paused) return self

    const newLocation = {
      x: self.location.x + self.direction.x,
      y: self.location.y + self.direction.y
    }

    self.setLocation({
      x: Math.min(Math.max(newLocation.x, 0), self.bounding.width - self.item.clientWidth),
      y: Math.min(Math.max(newLocation.y, 0), self.bounding.height - self.item.clientHeight)
    })

    self.direction.x = (newLocation.x + self.item.clientWidth < self.bounding.width && newLocation.x >= 0)
      ? self.direction.x : -self.direction.x
    self.direction.y = (newLocation.y + self.item.clientHeight < self.bounding.height && newLocation.y >= 0)
      ? self.direction.y : -self.direction.y

    return self
  }
  self.set = vec => {
    self.location = { ...vec.location }
    self.bounding = { ...vec.bounding }
    self.diretion = { ...vec.direction }
    self.size = { ...vec.size }
  }
  self.setLocation = loc => {
    self.location = { ...loc }
    position(loc)
    return self
  }
  self.item.style.minWidth = `${self.item.clientWidth}px`
  self.setLocation(location)
  return self
}

export { vector }
