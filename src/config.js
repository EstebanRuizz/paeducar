require('dotenv').config()

module.exports = { 
    
    PORT: process.env.ENV_PORT || 5555,
    DB_HOST: process.env.ENV_DB_HOST || 'localhost',
    DB_PORT: process.env.ENV_DB_PORT || 3306,
    DB_USER: process.env.ENV_DB_USER || 'link',
    DB_PASSWORD: process.env.ENV_DB_PASSWORD || 'link',
    DB_DATABASE: process.env.ENV_DB_DATABASE || 'database_paeducar' 
    
}
