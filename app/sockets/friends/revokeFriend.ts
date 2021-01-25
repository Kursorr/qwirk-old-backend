import { Socket } from '../../../scripts/class/Socket'
import { User } from '../../models/User'

const revokeFriend = (instance: Socket, socket: any) => {
  socket.on('REVOKE::FRIEND', async (data) => {
    const { DB } = instance
    const userDb = new User(DB)

    const { user, friend } = data

    const userCursor = await userDb.filter({id: user})
    const sender = await userCursor.toArray()
    const friendCursor = await userDb.filter({ pseudo: friend })
    const receiver = await friendCursor.toArray()

    await userDb.deleteFriend(user, sender[0].friends[0].id)

    await userDb.deleteFriend(receiver[0].id, receiver[0].friends[0].id)

    socket.emit('revokedFriend')
  })
}

export { revokeFriend }
