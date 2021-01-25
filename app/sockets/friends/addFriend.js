"use strict";
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
exports.addFriend = void 0;
const uuidv4 = require('uuid/v4');
const User_1 = require("../../models/User");
const addFriend = (instance, socket) => {
    socket.on('ADD::FRIEND', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { DB } = instance;
        const userDb = new User_1.User(DB);
        const { user, friend, tag } = data;
        const friendCursor = yield userDb.filter({ pseudo: friend, tag: tag });
        const requestedFriend = yield friendCursor.toArray();
        if (requestedFriend.length === 0) {
            return socket.emit('sendFriendRequest', {
                requestResult: false
            });
        }
        yield userDb.addFriend(user, {
            id: uuidv4(),
            from: user,
            status: 2,
            requestedBy: true,
            to: requestedFriend[0].id
        });
        yield userDb.addFriend(requestedFriend[0].id, {
            id: uuidv4(),
            from: requestedFriend[0].id,
            status: 2,
            requestedBy: false,
            to: user
        });
        socket.emit('sendFriendRequest', {
            requestResult: true,
            pseudo: requestedFriend[0].pseudo
        });
    }));
};
exports.addFriend = addFriend;
