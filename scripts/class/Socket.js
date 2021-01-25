'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
const socketio = require("socket.io");
const redis = require("socket.io-redis");
const config = require('../../config/config');
class Socket {
    constructor(http, db, secret) {
        this.http = http;
        this.db = db;
        this.secret = secret;
        const io = socketio(process.argv[3], {
            transports: ['websocket']
        }).adapter(redis({ host: config.redis.host, port: config.redis.port }));
        this.io = io;
    }
    get IO() { return this.io; }
    get DB() { return this.db; }
    get Secret() { return this.secret; }
}
exports.Socket = Socket;
