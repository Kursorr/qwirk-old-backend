import * as express from 'express'

import { ElasticSearch } from '../../scripts/class/ElasticSearch'

const search = express.Router()

search.get('/', async (req, res) => {
  const search = new ElasticSearch()
  const result = await search.getText(req.query.term, req.query.offset)
  res.status(200).json({
    result
  })
})

export default search
