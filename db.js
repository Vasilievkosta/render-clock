const Pool = require('pg').Pool;
require('dotenv').config();

// const devConfig = {
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // host: process.env.DB_HOST,
    // database: process.env.DB_NAME,
    // port: process.env.DB_PORT,
// };

const devConfig = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const proConfig = `postgres://postgresql:c1MtvrqFF6oghoeAfkciChQHfdB4mOuf@dpg-ci10t1g2qv21rs5t3lk0-a/database_clock_9v7h`;

// const proConfig = postgres://USER:PASSWORD@INTERNAL_HOST:PORT/DATABASE
 
const pool = new Pool({
	
    connectionString: process.env.NODE_ENV === 'production' ? proConfig : devConfig,
    
});

module.exports = pool;