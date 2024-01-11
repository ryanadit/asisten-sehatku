'use strict'
import  express from "express"
import routesHelper from "../../utils/routes.helper.mjs"
import controllers from "../../controllers/index.mjs"
import middleware from "../../middleware/index.mjs"

const routes = function (app = express()) {
    var router = express.Router()

    router.get(
        routesHelper.getAllHistoryCheckUpNameRoute, 
        middleware.auth.validateToken, 
        controllers.historyCheckUpController.getAll
    )
    router.post(
        routesHelper.createHistoryCheckUpNameRoute,
        middleware.auth.validateToken, 
        controllers.historyCheckUpController.insert
    )
    router.get(
        routesHelper.detailHistoryCheckUpNameRoute, 
        middleware.auth.validateToken, 
        controllers.historyCheckUpController.detail
    )

    app.use(routesHelper.apiRoute, router)
}

export default {routes}