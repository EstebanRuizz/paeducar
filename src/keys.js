const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = require('./config');

console.log(DB_DATABASE,' <<<<< keys.js');

module.exports = {
    database: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE
    }
};
