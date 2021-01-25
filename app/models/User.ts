'use strict'

import { IDB, Model } from './Model'
import { Password } from '../../scripts/class/Hash'

enum REASON
{
	NOT_FOUND,
	PASSWORD_MATCH,
	ERROR
}

interface IUserModel
{
	id              : string,
	tag             : number,
	pseudo          : string,
	email           : string,
	password        : string,
	createdAt?      : Date,
	modifiedAt?     : Date,
	emailVerified?  : boolean,
	file?           : string,
  friends         : Array<Object>
}

class User extends Model {
  private readonly data: IUserModel

  get Data (): IUserModel {
    return this.data
  }

  constructor (db: IDB, data: IUserModel = null)
  {
    super(db, 'users')
    this.data = data
  }

  async filter (data: object): Promise<any>
  {
    return this.db.r.table(this.table).filter(data).run(this.db.conn)
  }

  async filterPluck (id: string, data: Object): Promise<any>
  {
    return this.db.r.table(this.table).get(id)('friends').filter(data).run(this.db.conn)
  }

  private async opt (id: string, data: object): Promise<any>
  {
    return this.db.r.table(this.table).get(id).update(data).run(this.db.conn)
  }

  async updateData (id: string, data: Object): Promise<any>
  {
    return this.db.r.table(this.table).get(id).update(data).run(this.db.conn)
  }

  async update (id: string, data: object, password?: string): Promise<any>
  {
    const cursor = await this.filter({ id })
    const { password: result } = await cursor.next()

    if (password) {
      const verifPassword = await Password.compare(result, password)

      if (verifPassword) {
        return await this.opt(id, data)
      } else {
        throw new Error('Mot de passe invalide')
      }
    } else {
      return await this.opt(id, data)
    }
  }

  async get (data: object): Promise<any>
  {
    return this.db.r.table(this.table).get(data).run(this.db.conn)
  }

  async getServers (id: string): Promise<any>
  {
    return this.db.r.table(this.table).get(id)('servers').run(this.db.conn)
  }

  async getFriends (id: string): Promise<any>
  {
    return this.db.r.table(this.table).get(id)('friends').run(this.db.conn)
  }

  async addFriend (id: string, appendData: Object): Promise<any>
  {
    return this.db.r.table(this.table).get(id).update(
      { friends: this.db.r.row('friends').append(appendData) }
    ).run(this.db.conn)
  }

  async updateFriend (id: string, eq: string, data: Object): Promise<any>
  {
    return this.db.r.table(this.table).get(id).update(function(row) {
      return row('friends').offsetsOf(function(x) {
        return x('id').eq(eq)
      })(0).do(function(index) {
        return {
          friends: row('friends').changeAt(index, row('friends')(index).merge(data))
        }
      })
    }).run(this.db.conn)
  }

  async deleteFriend (id: string, eq: string): Promise<any>
  {
    return this.db.r.table(this.table).get(id).update(function(row) {
      return row('friends').offsetsOf(function(x) {
        return x('id').eq(eq)
      })(0).do(function(index) {
        return {
          friends: row('friends').deleteAt(index)
        }
      })
    }).run(this.db.conn)
  }

}

export { User, IUserModel }
