'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.base = void 0;
const register_1 = require("./auth/register");
const profile_1 = require("./edit/profile");
const login_1 = require("./auth/login");
const tchat_1 = require("./tchat");
const getFriends_1 = require("./friends/getFriends");
const addFriend_1 = require("./friends/addFriend");
const acceptFriend_1 = require("./friends/acceptFriend");
const revokeFriend_1 = require("./friends/revokeFriend");
const status_1 = require("./status");
const base = (instance) => {
    const { IO } = instance;
    IO.on('connection', (socket) => {
        console.log(`Customer connected id: ${socket.id} on port ${process.argv[2]}`);
        register_1.register(instance, socket);
        login_1.login(instance, socket);
        profile_1.profile(instance, socket);
        tchat_1.tchat(instance, socket);
        addFriend_1.addFriend(instance, socket);
        acceptFriend_1.acceptFriend(instance, socket);
        revokeFriend_1.revokeFriend(instance, socket);
        getFriends_1.friends(instance, socket);
        status_1.status(instance, socket);
        socket.on('disconnect', () => {
            console.log(`Customer disconnected id: ${socket.id} from port ${process.argv[2]}`);
        });
    });
};
exports.base = base;
