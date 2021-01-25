"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = exports.personalData = exports.userRules = exports.JWT = exports.pusher = exports.redis = exports.elastic = exports.database = void 0;
const Pusher = require("pusher");
/**
 * Get host
 * - sudo docker ps -a
 * - docker inspect id | grep "IPAddress"
 */
// c4
const database = {
    db: 'qwirk',
    host: '172.18.0.4',
    port: 28015
};
exports.database = database;
// http://172.18.0.3:8080
// d7
const elastic = {
    host: '172.18.0.3',
    port: 9200
};
exports.elastic = elastic;
// 0f
const redis = {
    host: '172.18.0.2',
    port: '6379'
};
exports.redis = redis;
const pusher = new Pusher({
    appId: '775677',
    key: 'e0aa787b85b50bfa58eb',
    secret: 'b4f9d925b8463739fbe3',
    cluster: 'eu',
    useTLS: true
});
exports.pusher = pusher;
const JWT = 'Qw1rkS3rv3r';
exports.JWT = JWT;
const userRules = {
    pseudo: 'alpha_numeric|required|min:2|max:40',
    email: 'email|required|max:100',
    password: 'required|max:200'
};
exports.userRules = userRules;
const personalData = {
    email: 'websitesm06@gmail.com',
    pwd: 'ragnarOK06'
};
exports.personalData = personalData;
const path = {
    img: 'avatars/'
};
exports.path = path;
