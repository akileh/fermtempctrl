export function seed(knex) { // eslint-disable-line import/prefer-default-export
  return knex('config')
    .whereNotExists(() => {
      this.select('id').from('config').where({ id: 0 })
    })
    .insert({
      id: 0,
      particleAccessToken: null,
      particleDeviceName: null
    })
}
