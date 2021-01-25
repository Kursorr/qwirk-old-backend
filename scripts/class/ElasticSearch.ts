'use strict'

import * as elasticsearch from 'elasticsearch'
import { elastic } from '../../config/config'

interface Data {
  index: string,
  type: string,
  client: elasticsearch.Client
}

class ElasticSearch {
  private readonly config: Data = {
    index: 'data',
    type: 'message',
    client: new elasticsearch.Client({ host: { host: elastic.host, port: elastic.port} })
  }

  constructor () {}

  async connect () {
    try { return await this.config.client.cluster.health({}) }
    catch (err) { console.error(err) }
  }

  mapping () {
    const schema = {
      pseudo: { type: 'keyword' },
      text: { type: 'text' }
    }

    return this.config.client.indices.putMapping({ index: this.config.index, type: this.config.type, body: { properties: schema } })
  }

  async resetIndex () {
    if (await this.config.client.indices.exists({ index: this.config.index })) {
      await this.config.client.indices.delete({ index: this.config.index })
    }

    await this.config.client.indices.create({ index: this.config.index })
    await this.mapping()
  }

  async readAndInsertData (messages) {
    try {
      await this.resetIndex()
      await this.insertData(messages)
    } catch (e) {
      console.error(e)
    }
  }

  async insertData (messages) {
    const bulkOps = []
    for (let i = 0; i < messages.length; i++) {
      bulkOps.push({ index: { _index: this.config.index, _type: this.config.type } })
      bulkOps.push({
        avatar: messages[i].avatar,
        pseudo: messages[i].pseudo,
        text: messages[i].content,
        location: i
      })
    }
    await this.config.client.bulk({ body: bulkOps })
  }

  getText (term: string, offset: number = 0) {
    const body = {
      from: offset,
      query: {
        match: {
          text: {
            query: term,
            operator: 'and',
            fuzziness: 'auto'
          }
        }
      },
      highlight: { fields: { text: {}}}
    }
    return this.config.client.search({index: this.config.index, type: this.config.type, body})
  }

  getTextFromUser (author: string, term: string) {
    const body = {
      query: {
        bool: {
          must: [
            { match: { pseudo: author }},
            { match: { text: term }}
          ]
        }
      }
    }
    return this.config.client.search({index: this.config.index, type: this.config.type, body})
  }
}

export { ElasticSearch }
