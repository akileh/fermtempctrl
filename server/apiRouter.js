import express from 'express'
import cacheControl from './cacheControl'
import knex, { getConfig, updateConfig } from './db'
import { authenticate, getVariable, callFunction, parseStatus, listDevices } from './particle'

function configToJson(config) {
  return {
    particleAccessToken: !!config.particleAccessToken,
    particleDeviceName: config.particleDeviceName
  }
}

export default function apiRouter() {
  const router = express.Router()
  router.use(cacheControl(false))

  router.get('/api/version', (req, res) => {
    res.send(process.env.npm_package_version)
  })

  router.get('/api/temperatures', (req, res, next) => {
    const {
      from = Date.now() - 24 * 60 * 60 * 1000,
        to = Date.now()
    } = req.query
    knex('temperatures')
      .where('createdAt', '>', from)
      .andWhere('createdAt', '<', to)
      .then(temperatures => temperatures.map(temperature => Object.assign(
        temperature, {
          controlled: !!temperature.controlled,
          createdAt: parseInt(temperature.createdAt, 10)
        })
      ))
      .then(temperatures => temperatures.sort((a, b) => a.createdAt < b.createdAt ? -1 : 1))
      .then(temperatures => res.json(temperatures))
      .catch(next)
  })

  router.post('/api/transmitter/turn/:state', (req, res, next) => {
    callFunction('nexa', req.params.state)
      .then(json => res.json(json))
      .catch(next)
  })

  router.post('/api/transmitter', (req, res, next) => {
    const { transmitterPaired } = req.body
    callFunction('transmitterPaired', transmitterPaired.toString())
      .then(() => res.json({
        transmitterPaired
      }))
      .catch(next)
  })

  router.get('/api/transmitter', (req, res, next) => {
    getVariable('paired')
      .then(transmitterPaired => res.json({
        transmitterPaired: !!transmitterPaired
      }))
      .catch(next)
  })

  router.get('/api/status', (req, res, next) => {
    getVariable('status')
      .then(status => {
        if (status === 'none') {
          throw Error('Device not contacted')
        }
        else {
          res.json(parseStatus(status))
        }
      })
      .catch(next)
  })

  router.get('/api/pid', (req, res, next) => {
    getVariable('pid')
      .then(pid => {
        const [p, i, d, tuning] = pid.split(',')
        res.json({
          p: parseFloat(p),
          i: parseFloat(i),
          d: parseFloat(d),
          tuning: parseInt(tuning, 10) === 1
        })
      })
      .catch(next)
  })

  router.post('/api/pid', (req, res, next) => {
    const { p, i, d } = req.body
    callFunction('pid', `{p:${p},i:${i},d:${d}}`)
      .then(() => res.json(req.body))
      .catch(next)
  })

  router.post('/api/pid/autotune/:state', (req, res, next) => {
    const { state } = req.params
    callFunction('autotune', state)
      .then(() => res.json({ tuning: state === 'on' }))
      .catch(next)
  })

  router.get('/api/state', (req, res, next) => {
    return Promise.all([
      getVariable('controlled'),
      getVariable('targetTemp')
    ])
    .then(([controlled, targetTemperature]) => {
      res.json({
        controlled,
        targetTemperature
      })
    })
    .catch(next)
  })

  router.post('/api/state', (req, res, next) => {
    const { controlled, targetTemperature } = req.body
    return Promise.all([
      typeof controlled !== 'undefined'
          ? callFunction('controlled', controlled.toString())
          : Promise.resolve(),
      typeof targetTemperature !== 'undefined'
          ? callFunction('targetTemperature', targetTemperature.toString())
          : Promise.resolve()
    ])
    .then(() => {
      res.json({
        controlled,
        targetTemperature
      })
    })
    .catch(next)
  })

  router.get('/api/authentication', (req, res, next) => {
    getConfig()
      .then(configToJson)
      .then(json => res.json(json))
      .catch(next)
  })

  router.post('/api/authentication', (req, res, next) => {
    const { accessToken, username, password } = req.body
    authenticate({ accessToken, username, password })
      .then(verifiedAccessToken => updateConfig({ particleAccessToken: verifiedAccessToken }))
      .then(configToJson)
      .then(json => res.json(json))
      .catch(next)
  })

  router.delete('/api/authentication', (req, res, next) => {
    updateConfig(
      {
        particleDeviceName: null,
        particleAccessToken: null
      })
      .then(configToJson)
      .then(json => res.json(json))
      .catch(next)
  })

  router.get('/api/device', (req, res, next) => {
    listDevices()
      .then(devices => res.json(devices))
      .catch(next)
  })

  router.delete('/api/device', (req, res, next) => {
    updateConfig({ particleDeviceName: null })
      .then(configToJson)
      .then(json => res.json(json))
      .catch(next)
  })

  router.post('/api/device', (req, res, next) => {
    listDevices()
      .then(devices => devices.find(device => device === req.body.device))
      .then(device => {
        if (!device) {
          throw new Error('device not found')
        }
        else {
          return updateConfig({ particleDeviceName: device })
            .then(() => device)
        }
      })
      .then(device => res.json({ particleDeviceName: device }))
      .catch(next)
  })

  /* TODO
  router.post('/api/flashrom', (req, res, next) => {
    flashRom()
      .then(flasRes => res.json(flasRes))
      .catch(next)
  })
  */

  router.all('/api/*', (req, res, next) => {
    next(new Error('unknown api route'))
  })

  return router
}
