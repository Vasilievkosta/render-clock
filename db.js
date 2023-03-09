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

const proConfig = `postgres://clock:9faPT5OzWjqA42GPHzCqnOO2V5Psgn4A@dpg-cg509bvdvk4n2c1ljsv0-a/database_clock`;

// const proConfig = postgres://USER:PASSWORD@INTERNAL_HOST:PORT/DATABASE
 
const pool = new Pool({
	
    connectionString: process.env.NODE_ENV === 'production' ? proConfig : devConfig,	
    
});

module.exports = pool;