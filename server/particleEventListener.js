import { getEventStream, parseStatus } from './particle'
import { emit } from './socketio'
import { getConfig, saveTemperature } from './db'

const RECONNECT_INTERVAL = 5000
const MIN_EVENT_INTERVAL = 60000

let stream
let lastEvent = Date.now()

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
  if (stream) {
    stream.abort()
  }
  getEventStream('status')
    .then(newStream => {
      stream = newStream
      stream.on('event', event => {
        getConfig()
          .then(config => {
            if (!config.particleDeviceName) {
              stream.abort()
            }
            else {
              status(event)
            }
          })
      })
      stream.on('end', (err) => {
        console.error(err) // eslint-disable-line no-console
        setTimeout(start, RECONNECT_INTERVAL)
      })
    })
    .catch(err => {
      console.error(err) // eslint-disable-line no-console
      setTimeout(start, RECONNECT_INTERVAL)
    })
}

setTimeout(start, RECONNECT_INTERVAL)

setInterval(() => {
  if (lastEvent < Date.now() - MIN_EVENT_INTERVAL) {
    console.info(`no events in ${MIN_EVENT_INTERVAL}ms, reconnecting...`) // eslint-disable-line no-console
    start()
  }
}, MIN_EVENT_INTERVAL)
