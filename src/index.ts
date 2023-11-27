import mongoose from 'mongoose'
import app from './app'
import { APP_PORT, DB_NAME, DB_SERVER } from './config/config'
import logger from './config/logger'
import { redisClient } from './config/redis'

let dbURI: string = `${DB_SERVER}${DB_NAME}`

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  // If not connected, return errors immediately rather than waiting for reconnect
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  authSource: 'admin',
}

logger.debug(dbURI)
logger.info('connecting to database...')

mongoose
  .connect(dbURI, options)
  .then(() => {
    logger.info('Mongoose connection done')
    redisClient.ping().then(() => {
      logger.info("Redis connected!")
      app.listen(APP_PORT, () => {
        logger.info(`server listening on ${APP_PORT}`)
      })
    }).catch((e) => {
      logger.info("Redis connection error");
      logger.error(e);
    })
  })
  .catch((e) => {
    logger.info('Mongoose connection error')
    logger.error(e)
  })

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  logger.debug('Mongoose default connection open to ' + dbURI)
})

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  logger.error('Mongoose default connection error: ' + err)
})

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose default connection disconnected')
})

// If the Node process ends, close the Mongoose connection (ctrl + c)
process.on('SIGINT', () => {
  mongoose.connection.close(true);
})

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception: ' + err)
})
