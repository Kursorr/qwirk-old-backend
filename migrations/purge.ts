import * as r from 'rethinkdb'

import { database } from '../config/config'

r.connect(database, async (err, conn) => {
  await r.dbDrop('qwirk').run(conn)

  await conn.close()
})
