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
exports.login = void 0;
const path = require("path");
const jwt = require("jsonwebtoken");
const notifier = require("node-notifier");
const User_1 = require("../../models/User");
const Hash_1 = require("../../../scripts/class/Hash");
const login = (instance, socket) => {
    socket.on('login', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { DB, Secret } = instance;
        const findUser = new User_1.User(DB);
        const { email, password } = data;
        const cursor = yield findUser.filter({ email });
        const result = yield cursor.toArray();
        const user = result[0];
        if (!result.length) {
            socket.emit('connection', {
                success: false,
                message: 'Votre email ou votre mot de passe est incorrect.'
            });
            return false;
        }
        const userID = result[0].id;
        const verifPassword = yield Hash_1.Password.compare(result[0].password, password);
        if (!verifPassword) {
            socket.emit('connection', {
                success: false,
                message: 'Votre email ou votre mot de passe est incorrect.'
            });
            return false;
        }
        const token = jwt.sign({
            pseudo: result[0].pseudo,
            email: result[0].email,
            id: userID,
            tag: result[0].tag
        }, Secret, { expiresIn: 60 });
        notifier.notify({
            title: 'Welcome !',
            message: `Hello ${user.pseudo}`,
            icon: path.join(`${__dirname}/../../../avatars/${user.avatar}`),
            sound: true,
            wait: true
        }, (err, data) => { });
        socket.emit('connection', {
            success: true,
            message: 'Vous êtes connecté ! Super !',
            token,
            user
        });
        yield findUser.update(userID, { token, tokenDeath: new Date(60 * 1000) });
    }));
};
exports.login = login;
