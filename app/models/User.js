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
exports.User = void 0;
const Model_1 = require("./Model");
const Hash_1 = require("../../scripts/class/Hash");
var REASON;
(function (REASON) {
    REASON[REASON["NOT_FOUND"] = 0] = "NOT_FOUND";
    REASON[REASON["PASSWORD_MATCH"] = 1] = "PASSWORD_MATCH";
    REASON[REASON["ERROR"] = 2] = "ERROR";
})(REASON || (REASON = {}));
class User extends Model_1.Model {
    constructor(db, data = null) {
        super(db, 'users');
        this.data = data;
    }
    get Data() {
        return this.data;
    }
    filter(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).filter(data).run(this.db.conn);
        });
    }
    filterPluck(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(id)('friends').filter(data).run(this.db.conn);
        });
    }
    opt(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(id).update(data).run(this.db.conn);
        });
    }
    updateData(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(id).update(data).run(this.db.conn);
        });
    }
    update(id, data, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const cursor = yield this.filter({ id });
            const { password: result } = yield cursor.next();
            if (password) {
                const verifPassword = yield Hash_1.Password.compare(result, password);
                if (verifPassword) {
                    return yield this.opt(id, data);
                }
                else {
                    throw new Error('Mot de passe invalide');
                }
            }
            else {
                return yield this.opt(id, data);
            }
        });
    }
    get(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(data).run(this.db.conn);
        });
    }
    getServers(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(id)('servers').run(this.db.conn);
        });
    }
    getFriends(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(id)('friends').run(this.db.conn);
        });
    }
    addFriend(id, appendData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(id).update({ friends: this.db.r.row('friends').append(appendData) }).run(this.db.conn);
        });
    }
    updateFriend(id, eq, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(id).update(function (row) {
                return row('friends').offsetsOf(function (x) {
                    return x('id').eq(eq);
                })(0).do(function (index) {
                    return {
                        friends: row('friends').changeAt(index, row('friends')(index).merge(data))
                    };
                });
            }).run(this.db.conn);
        });
    }
    deleteFriend(id, eq) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(id).update(function (row) {
                return row('friends').offsetsOf(function (x) {
                    return x('id').eq(eq);
                })(0).do(function (index) {
                    return {
                        friends: row('friends').deleteAt(index)
                    };
                });
            }).run(this.db.conn);
        });
    }
}
exports.User = User;
