import bodyparser from 'body-parser'
import express from 'express'
import morgan from 'morgan'
import routes from '../routes/routes.js'
import cors from 'cors';
import rateLimit from 'express-rate-limit'
const app = express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
  });


app.use('/signup', limiter);
app.use(morgan('dev'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cors())

routes(app)

export default app