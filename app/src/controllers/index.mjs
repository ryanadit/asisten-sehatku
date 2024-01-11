'use strict'
import auth from "./auth/auth.controller.mjs"
import profile from "./profile/profile.controller.mjs"
import hospitalController from "./hospital/hospital.controller.mjs"
import historyCheckUpController from "./history/history.check.up.controller.mjs"

export default {
    auth, 
    profile, 
    hospitalController, 
    historyCheckUpController
}