const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: 'spideyDb',
    options: {
        trustedConnection: false,
        encrypt: false
    },
    pool: {
        max: 150,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

sql.connect(config)
.then(() => {
    console.log('Connected to database ' + config.database);
})
.catch(err => {
    console.error('Error connecting to db:', err);
});;

module.exports = sql;