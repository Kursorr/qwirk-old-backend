import { IDB, Model } from './Model'
import { IMembers } from '../interfaces/members'
import { IRoles } from '../interfaces/roles'
import { IMessages } from '../interfaces/messages'

interface IChannelModel
{
  id              : string,
  icon            : string,
  name            : string,
  moderation      : string,
  boosts          : number,
  members         : Array<IMembers>,
  messages        : Array<IMessages>,
  roles           : Array<IRoles>
}

class Channel extends Model {
  private readonly data: IChannelModel =  null

  constructor (db: IDB, data: IChannelModel = null)
  {
    super(db, 'servers')
    this.data = data
  }

  async getMessages (id: string, data: Object): Promise<any>
  {
    return this.db.r.table(this.table).get(id)('channels').filter(data)('messages').nth(-1)
      .run(this.db.conn)
  }

  async addNewChannel (serverId: string, data: Object): Promise<any>
  {
    return this.db.r.table(this.table).get(serverId).update(
      { channels: this.db.r.row('channels').append(data) }
    ).run(this.db.conn)
  }

  async deleteChannel (serverId: string, eq: string): Promise<any>
  {
    return this.db.r.table(this.table).get(serverId).update(function (row)  {
      return {
        'channels': row('channels')
          .filter(function (item) { return item('id').ne(eq) })
      }
    }).run(this.db.conn)
  }

  async insertMessage (serverId: string, convId: Object, msg: Object): Promise<any>
  {
    const cursor = await this.db.r.table(this.table).get(serverId)('channels').run(this.db.conn)
    const channels = await cursor.toArray()

    // @ts-ignore
    const channel = channels.find(c => c.id === convId.id)
    channel.messages.push(msg)

    await this.db.r.table(this.table).get(serverId)
      .update({channels})
      .run(this.db.conn)
  }

  async getUsers (serverId: string): Promise<any>
  {
    return this.db.r.table(this.table).get(serverId)('members').run(this.db.conn)
  }

  async getLastMessage (serverId: string, data: Object): Promise<any>
  {
    return this.db.r.table(this.table).get(serverId)('channels').filter(data)('messages')
      .nth(0).nth(-1)
      .run(this.db.conn)
  }

  async getServerName (serverId: string): Promise<any>
  {
    return this.db.r.table(this.table).get(serverId)('name').run(this.db.conn)
  }

  async getChannelsName (serverId: string): Promise<Object>
  {
    return this.db.r.table(this.table).get(serverId)('channels').pluck('id', 'name').run(this.db.conn)
  }
}

export { Channel, IChannelModel }
