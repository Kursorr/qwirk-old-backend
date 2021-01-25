import * as r from 'rethinkdb'

import { database } from '../config/config'

r.connect(database, async (err, conn) => {
  const allUsersCursor = await r.db('qwirk').table('users').run(conn)
  const usersResult = await allUsersCursor.toArray()
  console.log(usersResult)

  const allTables = await r.db('qwirk').tableList().run(conn)
  const tablesResult = await allTables.toArray()
  console.log(tablesResult)

  await conn.close()
})
