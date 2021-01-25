'use strict'

interface IDB
{
  r     : any,
  conn  : any
}

class Model {
  protected db: IDB
  get DB (): IDB { return this.db }

  protected table: string
  get Table (): string { return this.table }

  constructor (db: IDB, table: string)
  {
    this.db = db
    this.table = table
  }

  async insert (data: object): Promise<any>
  {
    return this.db.r.table(this.table).insert(data).run(this.db.conn)
  }

  async getSpecificData (id: string, ...data: Array<string>): Promise<any>
  {
    return this.db.r.table(this.table).get(id).pluck(['id', ...data]).run(this.db.conn)
  }
}

export { IDB, Model }
