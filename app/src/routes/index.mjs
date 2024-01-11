'use strict'
import express from 'express'
import authRoutes from './auth/auth.routes.mjs'
import profileRoutes from './profile/profile.routes.mjs'
import hospitalRoute from './hospital/hospital.route.mjs'
import historyCheckUpRoute from './history/history.check.up.route.mjs'

const routes = function (app = express()) {
    authRoutes.routes(app)
    profileRoutes.routes(app)
    hospitalRoute.routes(app)
    historyCheckUpRoute.routes(app)
}

export default {route : routes}