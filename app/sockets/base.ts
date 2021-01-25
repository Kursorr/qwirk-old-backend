'use strict'
import { Socket } from '../../scripts/class/Socket'
import { register } from './auth/register'
import { profile } from './edit/profile'
import { login } from './auth/login'
import { tchat } from './tchat'
import { friends } from './friends/getFriends'
import { addFriend } from './friends/addFriend'
import { acceptFriend } from './friends/acceptFriend'
import { revokeFriend } from './friends/revokeFriend'
import { status } from './status'

const base = (instance: Socket) => {
  const { IO } = instance

  IO.on('connection', (socket) => {
    console.log(`Customer connected id: ${socket.id} on port ${process.argv[2]}`)

    register(instance, socket)
    login(instance, socket)
    profile(instance, socket)
    tchat(instance, socket)
    addFriend(instance, socket)
    acceptFriend(instance, socket)
    revokeFriend(instance, socket)
    friends(instance, socket)
    status(instance, socket)

    socket.on('disconnect', () => {
      console.log(`Customer disconnected id: ${socket.id} from port ${process.argv[2]}`)
    })
  })
}

export { base }
