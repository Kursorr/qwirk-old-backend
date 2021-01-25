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
exports.Channel = void 0;
const Model_1 = require("./Model");
class Channel extends Model_1.Model {
    constructor(db, data = null) {
        super(db, 'servers');
        this.data = null;
        this.data = data;
    }
    getMessages(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(id)('channels').filter(data)('messages').nth(-1)
                .run(this.db.conn);
        });
    }
    addNewChannel(serverId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(serverId).update({ channels: this.db.r.row('channels').append(data) }).run(this.db.conn);
        });
    }
    deleteChannel(serverId, eq) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(serverId).update(function (row) {
                return {
                    'channels': row('channels')
                        .filter(function (item) { return item('id').ne(eq); })
                };
            }).run(this.db.conn);
        });
    }
    insertMessage(serverId, convId, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const cursor = yield this.db.r.table(this.table).get(serverId)('channels').run(this.db.conn);
            const channels = yield cursor.toArray();
            // @ts-ignore
            const channel = channels.find(c => c.id === convId.id);
            channel.messages.push(msg);
            yield this.db.r.table(this.table).get(serverId)
                .update({ channels })
                .run(this.db.conn);
        });
    }
    getUsers(serverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(serverId)('members').run(this.db.conn);
        });
    }
    getLastMessage(serverId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(serverId)('channels').filter(data)('messages')
                .nth(0).nth(-1)
                .run(this.db.conn);
        });
    }
    getServerName(serverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(serverId)('name').run(this.db.conn);
        });
    }
    getChannelsName(serverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.r.table(this.table).get(serverId)('channels').pluck('id', 'name').run(this.db.conn);
        });
    }
}
exports.Channel = Channel;
