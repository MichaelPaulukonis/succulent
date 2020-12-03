const vector = ({
  item,
  location = { x: 0, y: 0 },
  bounding = { width: 0, height: 0 },
  size = { maxWidth: 0, fontSize: 0 },
  direction = { x: 1, y: 1 }
}) => {
  const effectiveHeight = size.maxWidth / 2 // no simple way of knowing ???

  const self = { item, location: { ...location }, bounding: { ...bounding }, size: { ...size }, direction: { ...direction } }

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
      x: Math.min(Math.max(newLocation.x, 0), self.bounding.width - self.size.maxWidth),
      y: Math.min(Math.max(newLocation.y, 0), self.bounding.height - effectiveHeight)
    })

    self.direction.x = (newLocation.x + self.size.maxWidth < self.bounding.width && newLocation.x >= 0)
      ? self.direction.x : -self.direction.x
    self.direction.y = (newLocation.y + effectiveHeight < self.bounding.height && newLocation.y >= 0)
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
    if (loc.x < 0 || loc.x >= bounding.width || loc.y < 0 || loc.y > bounding.height) {
      throw new Error('Value is outside boundaries')
    }
    self.location = { ...loc }
    position(loc)
    return self
  }
  self.setLocation(location)
  return self
}

export { vector }
