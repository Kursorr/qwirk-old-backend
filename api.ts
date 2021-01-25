'use strict'

// External modules
import * as http from 'http'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as r from 'rethinkdb'
import * as log4js from 'log4js'

// Internal modules
import { Socket } from './scripts/class/Socket'
import { base } from './app/sockets/base'
import { database, JWT } from './config/config'
import { ElasticSearch } from "./scripts/class/ElasticSearch"

// Routes
import confirmAccount from './app/routes/confirm'
import search from './app/routes/search'

// Env setting
const JWT_SECRET  : string = process.env.JWT_SECRET     || JWT
const DATABASE    : string = process.env.DATABASE       || database.db

// Creating logger
log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: 'server-api.log' }
  },
  categories: {
    'default': { appenders: [ 'out'/*, 'app'*/ ], level: 'debug' }
  }
})

// Get logger
const log = log4js.getLogger('api')

// Start app
log.debug('Loading API ...')
const app = express()

// CORS
const options = {
  'origin': true,
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
}

// Middleware
app.use(cors(options))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/avatars', express.static('avatars'))

log.debug(`Connecting to database : rethinkdb://${database.host}:${database.port}/${DATABASE}`)
const connectDatabase = r.connect(database)

connectDatabase.then(async conn => {
  log.info(`Connected to : rethinkdb://${database.host}:${database.port}/${DATABASE}`)

  await new ElasticSearch().connect()

  app.use((req, res, next) => {
    req.secretJWT = JWT_SECRET
    req.db = { r, conn }

    // Auth token
    req.bearer = null

    if (req.headers.authorization) {
      const auth = req.headers["authorization"].split(' ')
      if (auth.length === 2 && auth[0] === 'bearer') {
        req.bearer = auth[1]
      }
    }

    res.log = log
    next()
  })

  const server = http.createServer((req, res) => {})

  // Our Sockets
  const socket = new Socket(server, { r, conn }, JWT_SECRET)
  base(socket)

  // Our routes
  log.debug('Add paths for the API')

  app.get('/', (req, res) => {
    res.status(200).json({
      message: `Welcome to Qwirk API`
    })
  })

	app.use('/confirm-account', confirmAccount)
  app.use('/search', search)

  // Launch application
  app.listen(process.argv[2], () => {
    log.info(`API running on port ${process.argv[2]}`)
    log.info(`Connection success to : rethinkdb://${database.host}:${database.port}/${DATABASE}`)
  })
})

connectDatabase.error((error) => {
  log.error(`Connection failed to : rethinkdb://${database.host}:${database.port}/${DATABASE}`)
  log.error(`Reason : ${error}`)
})
