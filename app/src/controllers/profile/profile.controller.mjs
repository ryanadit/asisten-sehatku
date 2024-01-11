'use strict'
import express from 'express'
import models from '../../models/index.mjs'

const profileDb = models.profiles

const detail = async (req = express.request, res = express.response) => {
    try {
        const id = req.user_id
        const user = await profileDb.findOne({
            where: {
                user_id : id
            },
            attributes : {
                exclude: ['password']
            }
        })
        if (user) {
            res.status(200).send({
                data : user
            })
            return
        } else {
            res.status(404).send({
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

const update = async (req = express.request, res = express.response) => {
    try {
        const id = req.user_id
        const user = await profileDb.findOne({
            where: {
                user_id : id
            },
        })
        if (user) {
            let data = req.body
            await profileDb.update(data, {
                where: {
                    user_id : id,
                }
            })
            res.status(200).send({
                message : 'Success Updated'
            })
            return
        } else {
            res.status(404).send({
                message : 'User not found'
            })
            return
        }
    } catch (error) {
        
    }
}

export default {detail, update}