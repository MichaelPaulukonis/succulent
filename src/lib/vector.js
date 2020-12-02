const vector = ({
  item,
  location = { x: 0, y: 0 },
  bounding = { width: 0, height: 0 },
  size = { maxWidth: 0, fontSize: 0 },
  direction = { x: 1, y: 1 }
}) => {
  const effectiveHeight = size.maxWidth / 2 // no simple way of knowing ???
  if (location.x < 0 || location.x >= bounding.width || location.y < 0 || location.y > bounding.height) {
    throw new Error('Value is outside boundaries')
  }
  const self = { item, location: { ...location }, bounding: { ...bounding }, size: { ...size }, direction: { ...direction } }
  const position = pos => {
    self.item.style.left = `${pos.x}px`
    self.item.style.top = `${pos.y}px`
  }
  self.next = () => {
    const newLocation = {
      x: self.location.x + self.direction.x,
      y: self.location.y + self.direction.y
    }

    self.location = {
      x: Math.min(Math.max(newLocation.x, 0), self.bounding.width - self.size.maxWidth),
      y: Math.min(Math.max(newLocation.y, 0), self.bounding.height - effectiveHeight)
    }

    position(self.location)

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
  position(self.location)
  return self
}

export { vector }
