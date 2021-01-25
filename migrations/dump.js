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
const r = require("rethinkdb");
const config_1 = require("../config/config");
r.connect(config_1.database, (err, conn) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsersCursor = yield r.db('qwirk').table('users').run(conn);
    const usersResult = yield allUsersCursor.toArray();
    console.log(usersResult);
    const allTables = yield r.db('qwirk').tableList().run(conn);
    const tablesResult = yield allTables.toArray();
    console.log(tablesResult);
    yield conn.close();
}));
