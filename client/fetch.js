import fetch from 'isomorphic-fetch'

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

export default function (url, options = {}) {
  return fetch(url, Object.assign({}, options, {
    headers,
    credentials: 'same-origin'
  }))
}
