// TODO: take apart the 2D vector components
// and add a 1D vector component - see "vectorMod" (ganked from OBSCURUS)
// and the "agent"-thing can use both
// for example, color and speed might have their own vector things.....
const vector = ({
  location = { x: 0, y: 0 },
  bounding = { width: 0, height: 0 },
  size = { maxWidth: 0, fontSize: 0 },
  direction = { x: 1, y: 1 }
}) => {
  const self = {
    location: { ...location },
    bounding: { ...bounding },
    size: { ...size },
    direction: { ...direction }
  }

  self.setLocation = loc => {
    self.location = { ...loc }
    return self
  }

  self.next = () => {
    const newLocation = {
      x: self.location.x + self.direction.x,
      y: self.location.y + self.direction.y
    }

    self.setLocation({
      x: Math.min(Math.max(newLocation.x, 0), self.bounding.width),
      y: Math.min(Math.max(newLocation.y, 0), self.bounding.height)
    })

    self.direction.x = (newLocation.x < self.bounding.width && newLocation.x >= 0)
      ? self.direction.x : -self.direction.x
    self.direction.y = (newLocation.y < self.bounding.height && newLocation.y >= 0)
      ? self.direction.y : -self.direction.y

    return self
  }

  return self
}

export { vector }
