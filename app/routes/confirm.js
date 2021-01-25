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
const express = require("express");
const User_1 = require("../models/User");
const confirmAccount = express.Router();
confirmAccount.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const DB = req.db;
    const user = new User_1.User(DB);
    const verifAccountId = req.query.id;
    const verifAccountToken = req.query.token;
    const cursor = yield user.filter({ id: verifAccountId, verifAcc: verifAccountToken });
    const result = yield cursor.toArray();
    if (!result)
        return;
    const currentUser = result[0];
    if (verifAccountToken !== currentUser.verifAcc)
        return;
    yield user.update(currentUser.id, { emailVerified: true, verifAcc: null });
    res.send('Votre email a bien été validé !');
}));
exports.default = confirmAccount;
