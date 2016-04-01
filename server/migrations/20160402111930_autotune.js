export function up(knex) {
  return knex.schema.table('temperatures', table => {
    table.boolean('tuning')
  })
}

export function down(knex) {
  return knex.schema.table('temperatures', table => {
    table.dropColumn('tuning')
  })
}
