import bodyparser from 'body-parser'
import express from 'express'
import morgan from 'morgan'
import routes from '../routes/routes.js'
import cors from 'cors'
const app = express()

app.use(morgan('dev'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cors())

routes(app)

export default app