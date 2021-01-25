import { Socket } from '../../../scripts/class/Socket'
import { User } from '../../models/User'

const friends = (instance: Socket, socket: any) => {
  socket.on('GET::FRIENDS', async (userId) => {
    const { DB } = instance
    const user = new User(DB)

    let total = {}
    let friends = []

    const cursor = await user.getFriends(userId)

    const obj = {
      pseudo: '',
      tag: '',
      avatar: '',
      status: '',
      requestedBy: ''
    }

    const friendsStatus: Array<string> = cursor.map(({ status }) => status)
    const requestedBy: Array<string> = cursor.map(({ requestedBy }) => requestedBy)

    let i = 0
    for await (const friend of cursor) {
      const cursorFriendData = await user.getSpecificData(friend.to, 'pseudo', 'tag', 'avatar')
      const { pseudo, tag, avatar } = cursorFriendData

      obj.pseudo = pseudo
      obj.tag = tag
      obj.avatar = avatar
      obj.status = friendsStatus[i]
      obj.requestedBy = requestedBy[i]

      let three = Object.assign({}, obj, total)

      friends.push(three)
      i++
    }

    socket.emit('getFriends', friends)
  })
}

export { friends }
