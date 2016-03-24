import Particle from 'particle-api-js'
import { getConfig } from './db'

const particle = new Particle()
export default particle

function getAuth() {
  return getConfig()
    .then(config => {
      if (!config.particleDeviceName || !config.particleAccessToken) {
        throw Error('particle api call failed: particle accessToken and/or deviceId not set')
      }
      else {
        return {
          deviceId: config.particleDeviceName,
          auth: config.particleAccessToken
        }
      }
    })
}

export function getVariable(name) {
  return getAuth()
    .then(auth => particle.getVariable(Object.assign({}, auth, {
      name
    })))
    .then(result => result.body.result)
}

export function callFunction(name, argument) {
  if (typeof argument !== 'string') {
    return Promise.reject(new Error('argument must be a string'))
  }

  return getAuth()
    .then(auth => particle.callFunction(Object.assign({}, auth, {
      name: 'command',
      argument: `${name}:${argument}`
    })))
}

export function getEventStream(name) {
  return getAuth()
    .then(auth => particle.getEventStream(Object.assign({}, auth, {
      name
    })))
}

export function parseStatus(status) {
  const [
    sStatus,
    sTemperature,
    sTargetTemperature,
    sControlled,
    sTransmitterPaired,
    sTimestamp
  ] = status.split(',')

  return {
    temperature: parseFloat(sTemperature),
    targetTemperature: parseFloat(sTargetTemperature),
    status: parseInt(sStatus, 10),
    controlled: sControlled === '1',
    transmitterPaired: sTransmitterPaired === '1',
    createdAt: parseInt(sTimestamp, 10)
  }
}
