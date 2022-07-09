require('dotenv').config();
const env = process.env.NODE_ENV === 'production';
const options = {
    client: 'pg',
    version: '7.2',
    connection: {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT,
    }
};

const productionOptions = {
    client: 'pg',
    version: '7.2',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    }
};

const knex = require('knex')(env ? productionOptions : options);

module.exports = knex;