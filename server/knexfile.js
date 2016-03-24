const defaultOptions = {
  seeds: {
    directory: `${__dirname}/seeds`
  },
  migrations: {
    directory: `${__dirname}/migrations`,
    tableName: 'knex_migrations'
  }
}

export default {
  development: Object.assign({
    client: 'sqlite3',
    connection: {
      filename: './db.sqlite3'
    }
  }, defaultOptions),
  production: Object.assign({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 0,
      max: 7
    }
  }, defaultOptions)
}
