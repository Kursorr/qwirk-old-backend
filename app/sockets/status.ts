import { Socket } from '../../scripts/class/Socket'
import { User } from '../models/User'

const status = (instance: Socket, socket: any) => {
  const { DB } = instance
  const user = new User(DB)

  socket.on('CHANGE::STATUS', async data => {
    const { userId, status } = data

    await user.updateData(userId, { status })

    socket.emit('getStatus', status)
  })

}

export { status }
