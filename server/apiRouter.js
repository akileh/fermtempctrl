import express from 'express'
import cacheControl from './cacheControl'
import knex from './db'
import { getVariable, callFunction, parseStatus } from './particle'
import { getConfig, updateConfig } from './db'

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
      .then(temperatures => res.json(temperatures.map(temperature => Object.assign(
        temperature, {
          controlled: !!temperature.controlled,
          createdAt: parseInt(temperature.createdAt, 10)
        })
      )))
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
        const [p, i, d] = pid
          .split(',')
          .map(parseFloat)
        res.json({ p, i, d })
      })
      .catch(next)
  })

  router.post('/api/pid', (req, res, next) => {
    const { p, i, d } = req.body
    callFunction('pid', `{p:${p},i:${i},d:${d}}`)
      .then(() => res.json(req.body))
      .catch(next)
  })

  router.get('/api/device', (req, res, next) => {
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

  router.post('/api/device', (req, res, next) => {
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
    updateConfig(req.body)
      .then(configToJson)
      .then(json => res.json(json))
      .catch(next)
  })

  router.all('/api/*', (req, res, next) => {
    next(new Error('unknown api route'))
  })

  return router
}
