import Knex from 'knex'
import configs from './knexfile'
import particle from './particle'
import { getAppConfig } from './appConfig'

const config = configs[process.env.NODE_ENV]
const knex = Knex(config)
const temperatureSaveInterval = getAppConfig('temperatureSaveInterval')
const maxDbRows = getAppConfig('maxDbRows')

knex.migrate.latest(config)
  .then(() => knex.seed.run(config))
  .catch(err => console.error(err.stack)) // eslint-disable-line no-console

export default knex

export function getConfig() {
  return knex('config')
    .where({ id: 0 })
    .then(result => {
      if (result.length > 0) {
        return result[0]
      }
      else {
        throw new Error('config not found')
      }
    })
}

// TODO
export function updateConfig(args) {
  if (args.particleAccessToken === null || args.particleAccessToken === false) {
    Object.assign(args, {
      particleAccessToken: null,
      particleDeviceName: null
    })
  }

  return new Promise((resolve, reject) => {
    if (typeof args.particleAccessToken === 'string') {
      particle.listDevices({ auth: args.particleAccessToken })
        .then(res => res.body)
        .then(devices => {
          if (devices.find(device => device.name === args.particleDeviceName)) {
            resolve()
          }
          else {
            reject()
          }
        })
        .catch(reject)
    }
    else {
      resolve()
    }})
    .then(() => knex('config')
        .where({ id: 0 })
        .update(args)
    )
    .then(getConfig)
}

export function saveTemperature(data) {
  const dbData = Object.assign({}, data)
  delete dbData.transmitterPaired
  if (dbData.temperature !== -127) {
    knex('temperatures')
      .where('createdAt', '>', Date.now() - temperatureSaveInterval)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .then(temperatures => {
        if (temperatures.length === 0) {
          knex('temperatures')
            .insert(dbData)
            .catch(err => console.error(err)) // eslint-disable-line no-console
        }
      })

    if (maxDbRows) {
      knex('temperatures')
        .select('createdAt')
        .orderBy('createdAt', 'desc')
        .offset(maxDbRows)
        .limit(1)
        .then(temperatures => temperatures.length > 0 ? temperatures[0] : null)
        .then(temperature => {
          if (temperature) {
            knex('temperatures')
              .where('createdAt', '<', temperature.createdAt)
              .del()
              .then()
              .catch(err => console.error(err)) // eslint-disable-line no-console
          }
        })
    }
  }
}
