'use strict'
import bcrypt from 'bcrypt'
import routesHelper from '../../utils/routes.helper.mjs'
import nodemailer from 'nodemailer'

const getId = (length) => {
    var result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    var counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }
    var date_ob = new Date()
    // adjust 0 before single digit date
    var date = ("0" + date_ob.getDate()).slice(-2)
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2)

    var year = date_ob.getFullYear()
    var hours = date_ob.getHours()
    var minutes = date_ob.getMinutes()
    var seconds = date_ob.getSeconds()
    var dateFormat = year + month + date + hours + minutes + seconds
    return dateFormat + result;
}

const getDateString = () => {
    // adjust 0 before single digit date
    var date_ob = new Date()
    var date = ("0" + date_ob.getDate()).slice(-2)
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2)

    var year = date_ob.getFullYear()
    var hours = date_ob.getHours()
    var minutes = ("0" + date_ob.getMinutes()).slice(-2)
    var seconds = ("0" + date_ob.getSeconds()).slice(-2)
    var dateFormat = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds
    return dateFormat
}

const encryptPassword = async (password) => {
    var saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
})

const sendVerifyEmail = (email = '', token = '') => {
    try {
        // url frontend for email verification
        const urlFrontEndVerifyEmail = `${process.env.MAIN_URL_CLIENT}/confirmRegister?token=${token}`
        transporter.sendMail({
            from: process.env.AUTH_EMAIL, 
            to: email,
            priority: 'high',
            // Subject of Email 
            subject: 'Asisten Sehatku - Email Verification', 
            // This would be the text of email body 
            text: `Halo, terimakasih telah mendaftar di Asisten Sehatku. Untuk melanjutkan menggunakan layanan Asisten Sehatku mohon untuk konfirmasi email anda di link berikut ${urlFrontEndVerifyEmail} Terimakasih`
        }, (error, info) => { 
            if (error) {
                throw Error(error)
            }
            console.log('Email Sent Successfully')
            console.log(info)
        })
        
    } catch (error) {
        throw Error(error)
    }
}

const sendVerifyChangePassword = (email = '', token = '') => {
    try {
        // url frontend for email 
        const urlFrontEndVerifyChangePassword = `${process.env.MAIN_URL_CLIENT}/forgotPassword?token=${token}`
        transporter.sendMail({
            from: process.env.AUTH_EMAIL, 
            to: email,
            priority: 'high',
            // Subject of Email 
            subject: 'Asisten Sehatku - Perubahan Password', 
            // This would be the text of email body 
            text: `Halo, Sahabat Asisten Sehatku. Untuk perubahan password silahkan klik tautan berikut ${urlFrontEndVerifyChangePassword} . Anda dapat masuk kembali ke Asisten Sehatku dengan password tersebut. Terimakasih`
        }, (error, info) => { 
            if (error) {
                throw Error(error)
            }
            console.log('Email Sent Successfully')
            console.log(info)
        })
        
    } catch (error) {
        throw Error(error)
    }
}

export default {
    encryptPassword, 
    getDateString, 
    getId, 
    sendVerifyEmail, 
    sendVerifyChangePassword
}