const uuidv4 = require('uuid/v4')

import { Socket } from '../../../scripts/class/Socket'
import { User } from '../../models/User'

const addFriend = (instance: Socket, socket: any) => {
  socket.on('ADD::FRIEND', async (data) => {
    const { DB } = instance
    const userDb = new User(DB)

    const { user, friend, tag } = data

    const friendCursor = await userDb.filter({ pseudo: friend, tag: tag })
    const requestedFriend = await friendCursor.toArray()

    if (requestedFriend.length === 0) {
      return socket.emit('sendFriendRequest', {
        requestResult: false
      })
    }

    await userDb.addFriend(user, {
      id: uuidv4(),
      from: user,
      status: 2,
      requestedBy: true,
      to: requestedFriend[0].id
    })

    await userDb.addFriend(requestedFriend[0].id, {
      id: uuidv4(),
      from: requestedFriend[0].id,
      status: 2,
      requestedBy: false,
      to: user
    })

    socket.emit('sendFriendRequest', {
      requestResult: true,
      pseudo: requestedFriend[0].pseudo
    })
  })
}

export { addFriend }
