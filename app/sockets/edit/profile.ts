'use strict'

import * as indicative from 'indicative'
import { RateLimiter } from 'limiter'
import * as fs from 'fs'

import { User } from '../../models/User'
import { Socket } from '../../../scripts/class/Socket'
import { Password } from '../../../scripts/class/Hash'
import { userRules, path } from '../../../config/config'
import { decodeBase64Image, imgPath } from '../../../scripts/Helper'

const limiter = new RateLimiter(5, 'hour', true)

const profile = (instance: Socket, socket: any) => {
	socket.on('UPDATE::PROFILE', async data => {
		const { DB } = instance
		const user = new User(DB)

		const isValid = await indicative.validate(data, userRules)
			.then(() => true)
			.catch(err => {
				socket.emit('UPDATE::PROFILE', {
					success: false,
					message: `${err[0].field} obligatoire`
				})
				return false
			})

		if (!isValid) return

		const { pseudo, tag, email, avatar, password, newPassword } = data

		const emailCursor = await user.filter({ tag })
		const result = await emailCursor.toArray()
		const userID = result[0].id

		const verifPassword = await Password.compare(result[0].password, password)

		if (!verifPassword) {
			socket.emit('updateProfile', {
				success: false,
				message: 'Mot de passe invalide'
			})
			return false
		}

		return limiter.removeTokens(1, async (err, remainingRequests) => {
		  /*
			if (remainingRequests < 1) {
				return socket.emit('UPDATE::PROFILE', {
					success: false,
					message: 'Vous changez vos informations trop rapidement, veuillez réessayer plus tard.'
				})
			}*/

			// Short-circuit Operators
			const preparedUser: any = {}
			pseudo && (preparedUser.pseudo = pseudo)
			email && (preparedUser.email = email)
			password && newPassword && (preparedUser.password = await Password.hash(newPassword))

			let imgBuffer

      if (avatar === null) {
        preparedUser.avatar = result[0].avatar
      } else if (avatar.length > 100) {
        imgBuffer = decodeBase64Image(avatar)
        preparedUser.avatar = imgPath(imgBuffer)

        fs.writeFile(path.img + preparedUser.avatar, imgBuffer.data, () => {})
			} else {
        preparedUser.avatar = result[0].avatar
      }

			const updateUser = await user.update(userID, preparedUser, password)

      updateUser && socket.emit('UPDATE::PROFILE', { success: true, preparedUser})
		})
	})
}

export { profile }
