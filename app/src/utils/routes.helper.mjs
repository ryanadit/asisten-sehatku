'use strict'
// for auth route name
const registerNameRoute = '/register'
const loginNameRoute = '/login'
const logoutNameRoute = '/logout'
const refreshTokenNameRoute = '/refreshToken'
const findEmailRouteName = '/findEmail'
const forgotPasswordRouteName = '/forgotPassword/:token'
const verifyRegisterNameRoute = '/verify/:token'
// for profile route name
const detailProfileNameRoute = '/profile/detail'
const updateProfileNameRoute = '/profile/update'
// for history check up route name
const detailHistoryCheckUpNameRoute = '/historyCheckUp/detail/:id'
const getAllHistoryCheckUpNameRoute = '/historyCheckUp/getAll'
const createHistoryCheckUpNameRoute = '/historyCheckUp/create'
// for hospital route name
const getHospitalBasedLocationNameRoute = '/hospital/getBasedLocation/:location'
const uploadHospitalCsvFileNameRoute = '/hospital/upload/csv'

const apiRoute = '/api/v1'

export default {
    apiRoute, 
    registerNameRoute, 
    loginNameRoute, 
    detailProfileNameRoute,
    findEmailRouteName,
    logoutNameRoute,
    refreshTokenNameRoute,
    verifyRegisterNameRoute,
    updateProfileNameRoute,
    detailHistoryCheckUpNameRoute,
    getAllHistoryCheckUpNameRoute,
    createHistoryCheckUpNameRoute,
    getHospitalBasedLocationNameRoute,
    uploadHospitalCsvFileNameRoute,
    forgotPasswordRouteName
}