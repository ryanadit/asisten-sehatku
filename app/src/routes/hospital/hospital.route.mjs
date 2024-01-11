'use strict'
import  express from "express"
import routesHelper from "../../utils/routes.helper.mjs"
import controllers from "../../controllers/index.mjs"
import middleware from "../../middleware/index.mjs"

const routes = function (app = express()) {
    var router = express.Router()

    router.get(
        routesHelper.getHospitalBasedLocationNameRoute, 
        middleware.auth.validateToken, 
        controllers.hospitalController.getHospitalBasedLocation
    )
    router.post(
        routesHelper.uploadHospitalCsvFileNameRoute,
        middleware.auth.validateToken, 
        middleware.upload.uploadFile.single('import-csv') ,
        controllers.hospitalController.insertFromCsv
    )

    app.use(routesHelper.apiRoute, router)
}

export default {routes}