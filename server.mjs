import express from 'express'
import cors from 'cors'
import db from './app/src/models/index.mjs'
import routes from './app/src/routes/index.mjs'

const app = express()

var corsOptions = {
    // origin: "http://localhost:8081"
    origin: "http://localhost:5173"
};

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({urlencoded : true}))

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.")
    console.log("Creating tables ===================")
    // sync table database
    db.sequelize
      .sync()
      .then(() => {
        console.log("=============== Tables created per model")
      })
      .catch((err) => {
        console.error("Unable to create tables:", err)
      })
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err)
  })

routes.route(app)

const PORT = process.env.NODE_LOCAL_PORT || 8081
app.listen(process.env.NODE_LOCAL_PORT, function () {
    console.log('Server listening at: ' + PORT)})