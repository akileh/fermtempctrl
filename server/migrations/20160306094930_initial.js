export function up(knex) {
  return Promise.all([
    knex.schema.createTable('config', table => {
      table.increments()
      table
        .string('particleAccessToken')
      table
        .string('particleDeviceName')
    }),
    knex.schema.createTable('temperatures', table => {
      table.increments()
      table
        .bigInteger('createdAt')
        .notNullable()
        .unique()
      table
        .float('temperature')
        .notNullable()
      table
        .boolean('controlled')
        .notNullable()
      table
        .float('targetTemperature')
        .notNullable()
      table
        .integer('status')
        .notNullable()
    })
  ])
}

export function down(knex) {
  return knex.schema.dropTable('config')
}
