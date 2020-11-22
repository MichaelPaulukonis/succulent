import defaultText from './default_text.json'
import tumblrRandomPost from './tumblr_random'
import dissociate from './dissociate'
import tokenize from './tokenize'
import glue from './rebuild'

let _corpus = []

export async function makeCorpus () {
  try {
    _corpus = await tumblrRandomPost()
  } catch (_) {
    _corpus = defaultText.lines
  }
  return _corpus
}

export function corpus () {
  return [..._corpus]
}

export async function getText () {
  if (_corpus.length === 0) {
    _corpus = await makeCorpus()
  }

  // TODO: reducing the number of fragments also yields interesting results!
  // too small of a quaver is annoying
  const munged = dissociate({ context: 1, quaver: 10, text: _corpus.join(' '), fragments: 500 })

  const tokens = tokenize(munged)
  const newItems = glue(30)(tokens)

  return newItems
}
