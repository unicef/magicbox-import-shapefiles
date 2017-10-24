module.exports = {
    // shapefile_dir: './data/shapefiles/',
    shapefile_dir: '../../magicbox2/shapefile-ingest/data/shapefiles/',
    pg_config: {
      database: 'all_countries_one_db',
      database_all_counties_one_table: 'all_countries_one_table',
      user: 'postgres', //env var: PGUSER
      connectionString: 'postgres://localhost:5432/all_countries',
      password: 'password', //env var: PGPASSWORD
      host: 'localhost', // Server hosting the postgres database
      port: 5432, //env var: PGPORT
      max: 10, // max number of clients in the pool
      idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    },

}
