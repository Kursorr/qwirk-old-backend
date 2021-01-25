import { Socket } from '../../../scripts/class/Socket'
import { User } from '../../models/User'

const acceptFriend = (instance: Socket, socket: any) => {
  socket.on('GET::NEW::FRIEND', async (data) => {
    const { DB } = instance
    const userDb = new User(DB)

    const { user, friend } = data

    const userCursor = await userDb.filter({id: user})
    const sender = await userCursor.toArray()
    const friendCursor = await userDb.filter({ pseudo: friend })
    const receiver = await friendCursor.toArray()

    await userDb.updateFriend(user, sender[0].friends[0].id, {
      status: 1
    })

    await userDb.updateFriend(receiver[0].id, receiver[0].friends[0].id, {
      status: 1
    })

    socket.emit('acceptedFriend')
  })
}

export { acceptFriend }
