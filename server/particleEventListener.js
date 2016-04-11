import { getEventStream, parseStatus } from './particle'
import { emit } from './socketio'
import { getConfig, saveTemperature } from './db'

const RECONNECT_INTERVAL = 5000
const MIN_EVENT_INTERVAL = 60000

let stream
let lastEvent = Date.now()
let restartTimeout

function status(event) {
  try {
    lastEvent = Date.now()
    const data = parseStatus(event.data)
    emit('status', data)
    saveTemperature(data)
  }
  catch (err) {
    console.error(err.stack) // eslint-disable-line no-console
  }
}

function start() {
  clearTimeout(restartTimeout)
  if (stream) {
    stream.abort()
  }
  getConfig()
    .then(config => {
      if (!config.particleDeviceName) {
        restart() // eslint-disable-line no-use-before-define
      }
      else {
        startEventStream() // eslint-disable-line no-use-before-define
      }
    })
}

function restart() {
  restartTimeout = setTimeout(start, RECONNECT_INTERVAL) // eslint-disable-line no-user-before-define
}

function startEventStream() {
  getEventStream('status')
    .then(newStream => {
      stream = newStream
      stream.on('event', event => status(event))
      stream.on('end', (err) => {
        console.error(err) // eslint-disable-line no-console
        restart()
      })
    })
    .catch(err => {
      console.error(err) // eslint-disable-line no-console
      restart()
    })
}

setTimeout(start, RECONNECT_INTERVAL)

setInterval(() => {
  if (lastEvent < Date.now() - MIN_EVENT_INTERVAL) {
    console.info(`no events in ${MIN_EVENT_INTERVAL}ms, reconnecting...`) // eslint-disable-line no-console
    start()
  }
}, MIN_EVENT_INTERVAL)
