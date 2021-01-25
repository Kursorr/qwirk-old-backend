'use strict'

import * as fs from 'fs'
import * as indicative from 'indicative'
import * as nodemailer from 'nodemailer'

import { User } from '../../models/User'
import { Socket } from '../../../scripts/class/Socket'
import { Password } from '../../../scripts/class/Hash'
import { userRules, path } from '../../../config/config'
import { randomText, randomTag, decodeBase64Image, imgPath } from '../../../scripts/Helper'
import { personalData } from '../../../config/config'

const register = (instance: Socket, socket: any) => {
	socket.on('register', async (data) => {
		const { pseudo, email, password, confirm, avatar } = data

		const { DB } = instance
    const user = new User(DB)

		const isValid = await indicative.validate(data, userRules)
			.then(() => true)
			.catch(err => {
				socket.emit('registration', {
				  success: false,
					message: `${err[0].field} obligatoire`
				})
				return false
			})

		if (!isValid) return

		if (password !== confirm) {
			socket.emit('registration', {
				success: false,
				message: 'Mots de passe non identiques'
			})
			return false
		}

		const cursor = await user.filter({ email })
		const result = await cursor.toArray()

		let emailAlreadyExist: string = ''

		if (result.length > 0) emailAlreadyExist = result[0].email

		if (emailAlreadyExist === email) {
			socket.emit('registration', {
				success: false,
				message: 'Adresse email déjà existante'
			})
			return false
		}

		const tag = randomTag()
		const verifAcc = randomText(16)
		const hPassword = await Password.hash(password)
		const imgBuffer = avatar ? decodeBase64Image(avatar) : ''
		const imgName = imgPath(imgBuffer)
		const newUser = await user.insert({
			pseudo,
			email,
			password: hPassword,
			tag,
			createdAt: new Date(),
			modifiedAt: new Date(),
			emailVerified: false,
			avatar: imgName,
			verifAcc,
      friends: []
		})

		fs.appendFile(path.img + imgName, imgBuffer.data, (err) => {
      if (err) throw err;
    })

		if (newUser) {
			socket.emit('registration', {
				success: true,
				message: 'Welcome to the team !'
			})

			/*const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: personalData.email,
					pass: personalData.pwd
				}
			})

			let link = 'http://localhost/confirm-account?token=' + verifAcc + '&id=' + newUser.generated_keys[0]

			const mailOptions = {
				from: email,
				to: personalData.email,
				subject: 'Inscription Qwirk',
				html: "Bienvenue !<br> Cliquez sur le lien pour confirmer votre email.<br><a href="+link+">Valider mon compte</a>"
			}

			transporter.sendMail(mailOptions, {})*/
		}
	})
}

export { register }
