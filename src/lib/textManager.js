import defaultText from '../default_text.json'
import tumblrRandomPost from './tumblr_random'
import dissociate from './dissociate'
import tokenize from './tokenize'
import glue from './rebuild'
import wordfilter from 'wordfilter'

let _corpus = []

const rand = max => Math.floor(Math.random() * max)

export async function makeCorpus () {
  let corp
  try {
    corp = await tumblrRandomPost()
  } catch (_) {
    corp = defaultText.lines
  }

  return corp.filter(line => !wordfilter.blacklisted(line))
    .join(' ').replace(/\s+/g, ' ')
}

export function corpus () {
  return [..._corpus]
}

export async function getText (count) {
  if (_corpus.length === 0) {
    _corpus = await makeCorpus()
  }

  const frgs = [10, 20, 50, 75, 100, 200, 200, 300, 300, 400, 400, 400, 500, 500, 500, 500, 500, 1000, 1000]
  const fragments = frgs[rand(frgs.length)]
  const qvs = [1, 2, 5, 7, 10, 10, 10, 10, 15, 20]
  const quaver = qvs[rand(qvs.length)]
  const cntxs = [1, 1, 1, 2, 2, 3, 5]
  const context = cntxs[rand(cntxs.length)]
  // console.log(`fragSize: ${fragments} quaver: ${quaver} constext: ${context}`)
  const munged = dissociate({ context, quaver, text: _corpus, fragments })

  const tokens = tokenize(munged)
  const lines = glue(count)(tokens)

  return lines
}
