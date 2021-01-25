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
exports.acceptFriend = void 0;
const User_1 = require("../../models/User");
const acceptFriend = (instance, socket) => {
    socket.on('GET::NEW::FRIEND', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { DB } = instance;
        const userDb = new User_1.User(DB);
        const { user, friend } = data;
        const userCursor = yield userDb.filter({ id: user });
        const sender = yield userCursor.toArray();
        const friendCursor = yield userDb.filter({ pseudo: friend });
        const receiver = yield friendCursor.toArray();
        yield userDb.updateFriend(user, sender[0].friends[0].id, {
            status: 1
        });
        yield userDb.updateFriend(receiver[0].id, receiver[0].friends[0].id, {
            status: 1
        });
        socket.emit('acceptedFriend');
    }));
};
exports.acceptFriend = acceptFriend;
