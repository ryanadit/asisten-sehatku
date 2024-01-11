'use strict'
import express from 'express'
import models from '../../models/index.mjs'
import { Op } from 'sequelize'

const historyModel = models.historyCheckUp
const profileModel = models.profiles
const hospitalModel = models.hospital

const insert = async (req = express.request, res = express.response) => {
    try {
        const id = req.user_id
        const {content, typeIndicator, indicator, location} = req.body

        const data = {
            content:content,
            typeIndicator:typeIndicator,
            indicator:indicator,
            location:location,
            userId: id
        }

        const user = await profileModel.findOne({
            where: {
                user_id: id
            }
        })

        if (user) {
            await historyModel.create(data).then(() => {
                res.status(200).send({
                    message: 'Success Sent check up'
                })
                return
            }).catch(err => {
                res.status(500).send({
                    message: 'Error '+err
                })
                return
            })
        } else {
            res.status(401).send({
                message : 'User not found'
            })
            return
        }
        
    } catch (error) {
        res.status(401).send({
            error : error
        })
        return
    }
}

const getAll = async (req = express.request, res = express.response) => {
    try {
        const id = req.user_id
        const historyCheckUp = await historyModel.findAll({
            where: {
                userId: id 
            }
        })
        if (historyCheckUp) {
            res.status(200).send({
                data: historyCheckUp
            })
            return
        } else {
            res.status(404).send({
                message : 'History not found'
            })
            return
        }
        
    } catch (error) {
        res.status(401).send({
            error : error
        })
        return
    }
}

const detail = async (req = express.request, res = express.response) => {
    try {
        const historyId = req.params.id
        if (!historyId) {
            return res.status(401).send({
                message: 'Please insert history id'
            })
        }

        const history = await historyModel.findOne({
            where: {
                histroy_id: parseInt(historyId)
            }
        })
        if (!history) {
            return res.status(401).send({
                message : 'History not found'
            })
        } else {
            const hospitals = await hospitalModel.findAll({
                where: {
                    address: {
                        [Op.like]: history.location+'%'
                    }
                }
            })
            return res.status(200).send({
                data: history,
                hospital: hospitals
            })
        }
        
    } catch (error) {
        res.status(401).send({
            error : error
        })
        return
    }
}

export default {insert, getAll, detail}