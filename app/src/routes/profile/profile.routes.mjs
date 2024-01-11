'use strict'
import  express from "express"
import routesHelper from "../../utils/routes.helper.mjs"
import controllers from "../../controllers/index.mjs"
import middleware from "../../middleware/index.mjs"

const routes = function (app = express()) {
    var router = express.Router()

    router.post(routesHelper.detailProfileNameRoute, middleware.auth.validateToken, controllers.profile.detail)
    router.put(routesHelper.updateProfileNameRoute, middleware.auth.validateToken, controllers.profile.update)

    app.use(routesHelper.apiRoute, router)
}

export default {routes}