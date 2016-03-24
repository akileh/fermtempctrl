export function seed(knex) {
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
