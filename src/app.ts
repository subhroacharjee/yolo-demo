import express from 'express'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import compression from 'compression'
import cors from 'cors'
import routes from './routes'
import { APP_PREFIX_PATH } from './config/config'
import httpStatus from 'http-status'
import ApiError from './utils/ApiError'
import { errorConverter, errorHandler } from './middlewares/error'
import { Context } from './utils/Context'
import { timer } from './interceptors/timer'

const app = express()

// set interceptor

app.use(timer);

// set context
app.use((req, _, next) => {
  Context.bindRequestContext(req);
  next();
})

// set security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// sanitize request data
// app.use(xss())
app.use(mongoSanitize())

// gzip compression
app.use(compression())

app.use(cors())

app.get('/', (_req, res) => {
  res.json({
    success: true,
    data: "Healthy",
  })
})

app.use(APP_PREFIX_PATH, routes)

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

// convert error to ApiError, if needed
app.use(errorConverter)

// handle error
app.use(errorHandler)

export default app
