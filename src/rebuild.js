// centerLength is the "approximate" token-length of a fragment

const select = arr => arr[Math.floor(Math.random() * arr.length)]

const offsets = [0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 5, 10, -4, -4, -3, -3, -2, -2, -1, -1]

const rebuild = count => tokens => {
  let tokenIndex = 0
  const frags = []
  const tLength = tokens.length
  const toTake = 5
  for (let i = 0; i < count; i++) {
    const taker = toTake + select(offsets)
    const endIndex = tokenIndex + taker % tLength
    frags.push(tokens.slice(tokenIndex, endIndex).join(' '))
    tokenIndex = endIndex
  }
  return frags
}

export default rebuild
