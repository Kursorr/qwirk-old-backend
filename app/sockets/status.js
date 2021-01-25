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
exports.status = void 0;
const User_1 = require("../models/User");
const status = (instance, socket) => {
    const { DB } = instance;
    const user = new User_1.User(DB);
    socket.on('CHANGE::STATUS', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, status } = data;
        yield user.updateData(userId, { status });
        socket.emit('getStatus', status);
    }));
};
exports.status = status;
