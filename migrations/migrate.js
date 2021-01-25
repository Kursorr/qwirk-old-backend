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
const tables = ['users', 'messages'];
r.connect(config_1.database, (err, conn) => __awaiter(void 0, void 0, void 0, function* () {
    yield r.dbList().contains(config_1.database.db)
        .do(databaseExist => {
        return r.branch(databaseExist, {
            dbs_created: 0
        }, r.dbCreate(config_1.database.db));
    }).run(conn);
    yield r(tables)
        .difference(r.db(config_1.database.db).tableList())
        .forEach(table => r.db(config_1.database.db).tableCreate(table))
        .run(conn);
    yield conn.close();
}));
// Kiki#1501
