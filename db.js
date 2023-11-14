const Pool = require('pg').Pool
require('dotenv').config()

	const devConfig = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

	const proConfig = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`

const pool = new Pool({	
    connectionString: process.env.NODE_ENV === 'production' ? proConfig : devConfig,
})

module.exports = pool
