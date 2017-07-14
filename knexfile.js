/*jshint esversion: 6 */

module.exports = {
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/madlib_test',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    }
  },

  development: {
    client: 'pg',
    connection: 'postgres://localhost/madlib',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    }
  }

};
