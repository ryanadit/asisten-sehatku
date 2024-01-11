'use strict'
import { Sequelize, Model, DataTypes } from "sequelize"

class HospitalModel extends Model {}

const db = (sequelize = new Sequelize()) => {
    return HospitalModel.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.TEXT
        },
        phone: {
            type: DataTypes.STRING
        },
        coordinate: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
    }, {
        sequelize,
        modelName: 'hospital',
        tableName: 'hospital'
    })
}

export default {db}