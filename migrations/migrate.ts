import * as r from 'rethinkdb'

import { database } from '../config/config'

const tables = ['users', 'messages']

r.connect(database, async (err, conn) => {
  await r.dbList().contains(database.db)
    .do(databaseExist => {
      return r.branch(databaseExist, {
        dbs_created: 0
      }, r.dbCreate(database.db))
    }).run(conn)

  await r(tables)
    .difference(r.db(database.db).tableList())
    .forEach(table => r.db(database.db).tableCreate(table))
    .run(conn)

  await conn.close()
})

// Kiki#1501
