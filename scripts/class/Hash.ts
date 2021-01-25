'use strict'

import * as argon2 from 'argon2'

export class Password {
  static hash (password: string) {
    return argon2.hash(password)
  }

  static compare (hash: any, password: string) {
    return argon2.verify(hash, password)
  }
}
