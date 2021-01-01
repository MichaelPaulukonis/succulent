// TODO: take apart the 2D vector components
// and add a 1D vector component - see "vectorMod" (ganked from OBSCURUS)
// and the "agent"-thing can use both
// for example, color and speed might have their own vector things.....
const vector = ({
  location = { x: 0, y: 0 },
  bounding = { width: 0, height: 0 },
  size = { maxWidth: 0, fontSize: 0 },
  direction = { x: 1, y: 1 },
  item = { width: 0, height: 0 }
}) => {
  const self = {
    location: { ...location },
    bounding: { ...bounding },
    size: { ...size },
    direction: { ...direction },
    item: { ...item }
  }

  self.next = () => {
    const newLocation = {
      x: self.location.x + self.direction.x,
      y: self.location.y + self.direction.y
    }

    self.location = {
      x: Math.min(Math.max(newLocation.x, 0), self.bounding.width - self.item.width),
      y: Math.min(Math.max(newLocation.y, 0), self.bounding.height - self.item.height)
    }

    self.direction.x = (newLocation.x + self.item.width < self.bounding.width && newLocation.x >= 0)
      ? self.direction.x : -self.direction.x
    self.direction.y = (newLocation.y + self.item.height < self.bounding.height && newLocation.y >= 0)
      ? self.direction.y : -self.direction.y

    return self
  }

  return self
}

export { vector }
