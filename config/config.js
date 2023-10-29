require('dotenv').config();

let config = {
    OPENAI_API_KEY: process.env.API_KEY,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DATABASE,
    SERVER_HOST: process.env.SERVER_HOST,
    SERVER_PORT: process.env.SERVER_PORT
}

module.exports = config;