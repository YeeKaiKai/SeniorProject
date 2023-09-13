require('dotenv').config();

let config = {
    OPENAI_API_KEY: process.env.API_KEY,
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DB_DATABASE,
}

module.exports = config;