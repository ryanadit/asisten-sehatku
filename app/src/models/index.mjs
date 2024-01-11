'use strict'
import { Sequelize } from "sequelize"
import profileModel from './profile/profile_model.mjs'
import tokenModel from "./token/token_model.mjs"
import hospitalModel from "./hospital/hospital.model.mjs"
import historyCheckUpModel from "./history/history.check.up.model.mjs"
import dbConfig from "../config/db_config.mjs"

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  operatorsAliases: false,
  // logging: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
})

const profiles = profileModel.db(sequelize)
const token = tokenModel.db(sequelize)
const hospital = hospitalModel.db(sequelize)
const historyCheckUp = historyCheckUpModel.db(sequelize)

token.belongsTo(profiles, {
  foreignKey: 'userId',
})

historyCheckUp.belongsTo(profiles, {
  foreignKey: 'userId'
})

profiles.hasOne(token, {
  foreignKey: 'userId',
  targetKey: 'id'
})

profiles.hasMany(historyCheckUp, {
  foreignKey: 'userId',
  targetKey: 'history_id'
})

export default {
  Sequelize, 
  sequelize, 
  profiles, 
  token, 
  hospital,
  historyCheckUp
}