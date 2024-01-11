'use strict'
import bcrypt from 'bcrypt'
import express from 'express'
import middleware from '../../middleware/index.mjs'
import models from '../../models/index.mjs'

const lengthId = 12
const lengthEncryptPassword = 10

const profileDb = models.profiles
const tokenDb = models.token
const authMiddleware = middleware.auth
const registerMiddleware = middleware.register

const login = async (req = express.request, res = express.response) => {
    try {
        const {email, password} = req.body
        if (!password && !email) {
            res.status(400).send({
                message : 'email & password not be empty'
            })
            return
        }

        const user = await profileDb.findOne({
            where: {
                email : email
            },
        })

        if (user && (await bcrypt.compare(password , user.password))) {
            if (!user.verified) {
                res.status(401).send({
                    message : 'Failed login. Please verify your email!',
                })
                return
            }
            let token = authMiddleware.generateToken(user.user_id, user.email)
            let refreshToken = await authMiddleware.createToken(user.user_id)
            res.status(200).send({
                message : 'Success login',
                accessToken: token,
                refreshToken: refreshToken
            })
            return
        } else {
            res.status(401).send({
                message: 'Wrong password or email!',
            })
            return
        }
    } catch (error) {
        res.status(401).send({
            error : error,
            message: 'Failed login. Something wrong'
        })
    }
}

const logout = async (req = express.request, res = express.response) => {
    try {
        const { refreshToken: requestToken } = req.body
        if (requestToken == null) {
            return res.status(403).json({ message: 'Refresh Token is required!' })
        }
        let refreshToken = await tokenDb.findOne({ 
            where : {
                token: requestToken
            }
        })
        if (refreshToken) {
            await tokenDb.destroy({ where: { id: refreshToken.id } })
            res.status(200).send({
                message : 'Success Logout'
            })
            return
        }
        
    } catch (error) {
        res.status(401).send({
            error : error,
            message: 'Failed logout. Something wrong'
        })
    }
}

const refreshToken = async (req = express.request, res = express.response) => {
    try {
        const { refreshToken: requestToken } = req.body
        if (requestToken == null) {
            return res.status(403).json({ message: 'Refresh Token is required!' })
        }

        let refreshToken = await tokenDb.findOne({ 
            where : {
                token: requestToken
            }
        })

        if (!refreshToken) {
            res.status(403).json({ message: 'Refresh token is not in database!' })
            return
        }

        if (authMiddleware.verifyExpiration(refreshToken)) {
            await tokenDb.destroy({where: {id: refreshToken.id}})
            res.status(403).json({
                message: 'Refresh token was expired. Please make a new signin request',
            })
            return
        }

        const user = await profileDb.findOne({
            where: {
                user_id : refreshToken.userId
            }
        })
        if (user) {
            let newAccessToken = authMiddleware.generateToken(user.user_id, user.email)
            return res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: refreshToken.token,
            })
        } else {
            return res.status(401).send({
                message: 'User not found'
            })
        }

    } catch (error) {
        return res.status(401).send({
            error : error,
            message: 'Failed refresh token. Something wrong'
        })
    }
}

const register = async (req = express.request, res = express.response) => {
    try {
        const {email, password, city, name, gender, age} = req.body
        if (!password && !email) {
            res.status(400).send({
                message : 'email & password not be empty'
            })
            return
        }
        const tokenVerify = authMiddleware.createToekenVerifyEmail(email)
        const pass = await registerMiddleware.encryptPassword(password, lengthEncryptPassword)
        const profile = {
            name: name,
            email: email,
            password: pass,
            user_id: registerMiddleware.getId(lengthId),
            city: city,
            gender: gender,
            age: age,
            verified: false,
            tokenVerify: tokenVerify
        }

        const [user, created] = await profileDb.findOrCreate({
            where: {
                email : email 
            }, 
            defaults: profile
        }).catch(error => {
            res.status(500).send({
                message : 'error register '+error
            })
            return
        })

        if (created) {
            registerMiddleware.sendVerifyEmail(user.email, user.tokenVerify)
            res.status(200).send({
                success: true,
                message: 'Success Register',
            })
            return
        } else {
            res.status(500).send({
                message : 'email '+user.email+' has taken'
            })
            return
        }
    
    } catch (error) {
        return res.status(401).send({
            error : error,
            message: 'Failed register. Something wrong'
        })
    }

}

const verifyEmail = async (req = express.request, res = express.response) => {
    try {
        const tokenVerify = req.params.token
        if (!tokenVerify) {
            res.status(400).send({
                message : 'Token not be empty'
            })
            return
        }
        const user = await profileDb.findOne({
            where: {
                tokenVerify: tokenVerify
            }
        })

        if (user) {
            const data = {
                verified: true
            }
            await profileDb.update(data, {
                where: {
                    user_id: user.user_id
                }
            }).then(() => {
                res
                .status(200).send({
                    message: 'Account has been verified'
                })
            }).catch(error => {
                return res.status(500).send({
                    message: 'Error '+error
                })
            })

        } else {
            return res.status(401).send({
                message: 'User not found'
            })
        }
        
    } catch (error) {
        res.status(401).send({
            error : error,
            message: 'Failed verification. Something wrong'
        })
    }
}

const findEmail = async (req = express.request, res = express.response) => {
    try {
        const {email} = req.body
        if (!email) {
            res.status(400).send({
                message : 'email not be empty'
            })
            return
        }

        const user = await profileDb.findOne({
            where: {
                email : email
            },
        })

        if (user) {
            registerMiddleware.sendVerifyChangePassword(user.email, user.tokenVerify)
            res.status(200).send({
                message : 'Check your mail for confirm',
            })
        } else {
            res.status(401).send({
                message: 'Email not found',
            })
            return
        }
    } catch (error) {
        res.status(401).send({
            error : error,
            message: 'Failed find email. Something wrong'
        })
    }
}

const forgotPassword = async (req = express.request, res = express.response) => {
    try {
        const tokenVerify = req.params.token
        const { password } = req.body

        if (!tokenVerify) {
            res.status(400).send({
                message : 'token not be empty'
            })
            return
        }

        if (!password) {
            res.status(400).send({
                message : 'password not be empty'
            })
            return
        } 

        const user = await profileDb.findOne({
            where: {
                tokenVerify : tokenVerify
            },
        })

        if (user) {
            const pass = await registerMiddleware.encryptPassword(password, lengthEncryptPassword)
            const dataUpdate = {
                password: pass
            }
            await profileDb.update(dataUpdate,{
                where: {
                    email : user.email
                },
            })
            res.status(200).send({
                message : 'Password has been update, please login again',
            })
            return
        } else {
            res.status(401).send({
                message: 'Email not found',
            })
            return
        }


    } catch (error) {
        res.status(401).send({
            error : error,
            message: 'Forgot password failed. Something wrong'
        })
    }
}

export default {
    refreshToken, 
    register, 
    login, 
    logout, 
    verifyEmail, 
    findEmail,
    forgotPassword
}