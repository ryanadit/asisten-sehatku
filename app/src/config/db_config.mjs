'use strict'
import dotenv from 'dotenv'
dotenv.config()

const HOST = process.env.DB_HOST
const USER = process.env.DB_USER
const PASSWORD = process.env.DB_PASSWORD
const DB = process.env.DB_DATABASE
const port = process.env.DB_PORT
const dialect = "mysql"
const pool = {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
}

export default { HOST, USER, PASSWORD, DB, port, dialect, pool }