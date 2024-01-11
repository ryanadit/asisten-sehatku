'use strict'
import { Sequelize, Model, DataTypes } from "sequelize"

class TokenModel extends Model {}

const db = (sequelize = new Sequelize()) => {
    return TokenModel.init({
        token : {
            type: DataTypes.STRING
        },
        expiryDate: {
            type: DataTypes.DATE
        },
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    }, {
    sequelize,
    modelName: 'token',
    tableName: 'token'
    })
}

export default {db}