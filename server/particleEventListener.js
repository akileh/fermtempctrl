import { getEventStream, parseStatus } from './particle'
import { emit } from './socketio'
import { getConfig, saveTemperature } from './db'

function status(event) {
  try {
    const data = parseStatus(event.data)
    emit('status', data)
    saveTemperature(data)
  }
  catch (err) {
    console.error(err.stack) // eslint-disable-line no-console
  }
}

function start() {
  getEventStream('status')
    .then(stream => {
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
        setTimeout(start, 5000)
      })
    })
    .catch(err => {
      console.error(err) // eslint-disable-line no-console
      setTimeout(start, 5000)
    })
}

setTimeout(start, 5000)
