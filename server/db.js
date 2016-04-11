import Knex from 'knex'
import knexConfigs from './knexfile'
import { getAppConfig } from './appConfig'

const knexConfig = knexConfigs[process.env.NODE_ENV]
const knex = Knex(knexConfig)
const temperatureSaveInterval = getAppConfig('temperatureSaveInterval')
const maxDbRows = getAppConfig('maxDbRows')

knex.migrate.latest(knexConfig)
  .then(() => knex.seed.run(knexConfig))
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

export function updateConfig(args) {
  return knex('config')
    .where({ id: 0 })
    .update(args)
    .then(getConfig)
}

export function saveTemperature(data) {
  getConfig()
    .then(config => {
      if (!config.particleDeviceName) {
        return
      }

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
    })
}
