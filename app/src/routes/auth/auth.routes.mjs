'use strict'
import  express from "express"
import routesHelper from "../../utils/routes.helper.mjs"
import controllers from "../../controllers/index.mjs"
import middleware from "../../middleware/index.mjs"

const routes = function (app = express()) {
    var router = express.Router()

    router.post(routesHelper.loginNameRoute, controllers.auth.login)
    router.post(routesHelper.logoutNameRoute, middleware.auth.validateToken, controllers.auth.logout)
    router.post(routesHelper.refreshTokenNameRoute, controllers.auth.refreshToken)
    router.post(routesHelper.registerNameRoute, controllers.auth.register)
    router.put(routesHelper.verifyRegisterNameRoute, controllers.auth.verifyEmail)
    router.post(routesHelper.findEmailRouteName, controllers.auth.findEmail)
    router.post(routesHelper.forgotPasswordRouteName, controllers.auth.forgotPassword)

    app.use(routesHelper.apiRoute, router)
}

export default {routes}