'use strict'
import register from "./register/register_middleware.mjs"
import auth from "./auth/auth_middleware.mjs"
import uploadMiddleware from "./upload/upload.middleware.mjs"

export default {register, auth, upload : uploadMiddleware}