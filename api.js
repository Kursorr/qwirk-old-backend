'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// External modules
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const r = require("rethinkdb");
const log4js = require("log4js");
// Internal modules
const Socket_1 = require("./scripts/class/Socket");
const base_1 = require("./app/sockets/base");
const config_1 = require("./config/config");
const ElasticSearch_1 = require("./scripts/class/ElasticSearch");
// Routes
const confirm_1 = require("./app/routes/confirm");
const search_1 = require("./app/routes/search");
// Env setting
const JWT_SECRET = process.env.JWT_SECRET || config_1.JWT;
const DATABASE = process.env.DATABASE || config_1.database.db;
// Creating logger
log4js.configure({
    appenders: {
        out: { type: 'stdout' },
        app: { type: 'file', filename: 'server-api.log' }
    },
    categories: {
        'default': { appenders: ['out' /*, 'app'*/], level: 'debug' }
    }
});
// Get logger
const log = log4js.getLogger('api');
// Start app
log.debug('Loading API ...');
const app = express();
// CORS
const options = {
    'origin': true,
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
};
// Middleware
app.use(cors(options));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/avatars', express.static('avatars'));
log.debug(`Connecting to database : rethinkdb://${config_1.database.host}:${config_1.database.port}/${DATABASE}`);
const connectDatabase = r.connect(config_1.database);
connectDatabase.then((conn) => __awaiter(void 0, void 0, void 0, function* () {
    log.info(`Connected to : rethinkdb://${config_1.database.host}:${config_1.database.port}/${DATABASE}`);
    yield new ElasticSearch_1.ElasticSearch().connect();
    app.use((req, res, next) => {
        req.secretJWT = JWT_SECRET;
        req.db = { r, conn };
        // Auth token
        req.bearer = null;
        if (req.headers.authorization) {
            const auth = req.headers["authorization"].split(' ');
            if (auth.length === 2 && auth[0] === 'bearer') {
                req.bearer = auth[1];
            }
        }
        res.log = log;
        next();
    });
    const server = http.createServer((req, res) => { });
    // Our Sockets
    const socket = new Socket_1.Socket(server, { r, conn }, JWT_SECRET);
    base_1.base(socket);
    // Our routes
    log.debug('Add paths for the API');
    app.get('/', (req, res) => {
        res.status(200).json({
            message: `Welcome to Qwirk API`
        });
    });
    app.use('/confirm-account', confirm_1.default);
    app.use('/search', search_1.default);
    // Launch application
    app.listen(process.argv[2], () => {
        log.info(`API running on port ${process.argv[2]}`);
        log.info(`Connection success to : rethinkdb://${config_1.database.host}:${config_1.database.port}/${DATABASE}`);
    });
}));
connectDatabase.error((error) => {
    log.error(`Connection failed to : rethinkdb://${config_1.database.host}:${config_1.database.port}/${DATABASE}`);
    log.error(`Reason : ${error}`);
});
