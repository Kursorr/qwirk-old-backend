import * as express from 'express'

import { User } from "../models/User"

const confirmAccount = express.Router()

confirmAccount.get('/', async (req, res) => {
	const DB = req.db
	const user = new User(DB)
	const verifAccountId = req.query.id
	const verifAccountToken = req.query.token

	const cursor = await user.filter({ id: verifAccountId, verifAcc: verifAccountToken })
	const result = await cursor.toArray()

	if (!result) return

	const currentUser = result[0]

	if (verifAccountToken !== currentUser.verifAcc) return

	await user.update(currentUser.id, { emailVerified: true, verifAcc: null })

	res.send('Votre email a bien été validé !')
})

export default confirmAccount
