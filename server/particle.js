import Particle from 'particle-api-js'
import { getConfig } from './db'

const particle = new Particle()
export default particle

function getAuth() {
  return getConfig()
    .then(config => {
      if (!config.particleAccessToken) {
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

function authenticateAccessToken(auth) {
  return particle
    .listDevices({ auth })
    .then(() => {
      return auth
    })
}

function getAccessToken(username, password) {
  return particle
    .listAccessTokens({ username, password })
    .then(res => res.body ? res.body : new Error('invalid accessTokens response'))
    .then(accessTokens => accessTokens.find(accessToken => accessToken.client === 'user'))
    .then(accessToken => accessToken.token)
}

export function authenticate({ accessToken, username, password }) {
  if (accessToken) {
    return authenticateAccessToken(accessToken)
  }
  else {
    return getAccessToken(username, password)
      .then(authenticateAccessToken)
  }
}

export function listDevices() {
  return getAuth()
    .then(auth => particle.listDevices(auth))
    .then(res => res.body)
    .then(devices => devices.map(device => device.name))
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
    sTimestamp,
    sTuning
  ] = status.split(',')

  return {
    temperature: parseFloat(sTemperature),
    targetTemperature: parseFloat(sTargetTemperature),
    status: parseInt(sStatus, 10),
    controlled: sControlled === '1',
    transmitterPaired: sTransmitterPaired === '1',
    createdAt: parseInt(sTimestamp, 10),
    tuning: sTuning === '1'
  }
}

/* TODO
export function flashRom() {
  return Promise.all(
    [
      getConfig(),
      getAuth()
    ])
    .then(([{ particleDeviceName: deviceId }, { auth }]) => {
      return particle.flashDevice({
        deviceId,
        auth,
        files: {
          'main.ino': './particle/main.ino',
          'PID-AutoTune.cpp': './particle/PID-Autotune/PID-AutoTune.cpp',
          'PID-AutoTune.h': './particle/PID-Autotune/PID-AutoTune.h',
          'NexaCtrl.cpp': './particle/NexaCtrl/NexaCtrl.cpp',
          'NexaCtrl.h': './particle/NexaCtrl/NexaCtrl.h',
          'pid.cpp': './particle/pid/pid.cpp',
          'pid.h': './particle/pid/pid.h',
          'spark-dallas-temperature.cpp': './particle/spark-dallas-temperature/spark-dallas-temperature.cpp',
          'spark-dallas-temperature.h': './particle/spark-dallas-temperature/spark-dallas-temperature.h',
          'OneWire.cpp': './particle/OneWire/OneWire.cpp',
          'OneWire.h': './particle/OneWire/OneWire.h'
        }
      })})
}
*/
