'use strict'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { response, request } from 'express'
import { v4 as uuidv4 } from 'uuid'
import model from '../../models/index.mjs'
import { createHmac } from 'node:crypto'

dotenv.config()

const tokenModel = model.token

const generateToken = (user_id = '', email = '') => {
    const data = {
        user_id: user_id,
        email: email
    }
    const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {expiresIn : process.env.JWT_EXPIRATION * 1440}) // one day
    return token
}

const validateToken = (req = request, res = response, next) => {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(' ')
        var bearerToken = bearer[1]
        jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                if (err instanceof jwt.TokenExpiredError) {
                    res.status(403).send({message : 'Unauthorized! Access Token expired!'})
                } else {
                    res.status(403).send({message: err})
                }
            } else {
                req.user_id = decoded.user_id
                next()
            }
        })
    } else {
        res.status(403).send({
            message : 'Unauthorization'
        })
    }
}

const createToken = async (user_id = '') => {
    try {
        let expiredAt = new Date();

        expiredAt.setTime(expiredAt.getTime() + process.env.JWT_REFRESH_EXPIRATION * 60 * 60 * 1000)
        
        let _token = uuidv4()
        let data = {
            userId: user_id,
            token: _token,
            expiryDate: expiredAt
        }
        let token = await tokenModel.create(data)

        return token.token
    } catch (error) {
        throw new Error(error)
    }
}

const verifyExpiration = (token = new tokenModel()) => {
    return token.expiryDate.getTime() < new Date().getTime()
}

const createToekenVerifyEmail = (email = '') => {
    const secret = process.env.SECRET_KEY_CRYPTO
    const hash = createHmac('sha256', secret)
               .update(email)
               .digest('hex')
    return hash
}

export default {
    generateToken, 
    validateToken, 
    createToken, 
    verifyExpiration,
    createToekenVerifyEmail
}
