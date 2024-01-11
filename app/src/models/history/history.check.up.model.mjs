'use strict'
import { Sequelize, Model, DataTypes } from "sequelize"

class HistoryCheckUpModel extends Model {}

const db = (sequelize = new Sequelize()) => {
    return HistoryCheckUpModel.init({
        histroy_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        content: {
            type: DataTypes.TEXT
        },
        indicator: {
            type: DataTypes.STRING
        },
        typeIndicator: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING
        },
    }, {
        sequelize,
        modelName: 'historyCheckUp',
        tableName: 'history-check-up'
    })
}

export default {db}