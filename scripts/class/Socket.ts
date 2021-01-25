'use strict'

import * as socketio from 'socket.io'
import * as redis from 'socket.io-redis'

import { IDB } from '../../app/models/Model'
const config = require('../../config/config')

class Socket {
  private http: any

  private readonly io: any
  get IO (): any { return this.io }

  private readonly db: IDB
  get DB (): IDB { return this.db }

  private readonly secret: string
  get Secret (): string { return this.secret }

  constructor (http: any, db: IDB, secret: string) {
    this.http = http
    this.db = db
    this.secret = secret
    const io = socketio(process.argv[3], {
      transports: ['websocket']
    }).adapter(redis({ host: config.redis.host, port: config.redis.port }))
    this.io = io
  }
}

export { Socket }
