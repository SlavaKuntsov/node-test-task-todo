import bodyParser from 'body-parser'
import { Request, Response } from 'express'
const socket = require('socket.io')

import { Socket } from 'dgram'
import {
	DialogController,
	MessageController,
	UserController
} from '../controllers/controller'
import { checkAuth, updateLastSeen } from '../middleware/middleware'
import { loginValidation, registerValidation } from '../utils/validations/index'

export default (app: any, io: Socket) => {
	const User = new UserController(io)
	const Dialog = new DialogController(io)
	const Message = new MessageController(io)

	app.use(bodyParser.json())
	app.use(updateLastSeen)
	app.use(checkAuth)

	app.use(function (req: Request, res: Response, next: any) {
		//Enabling CORS
		res.header('Access-Control-Allow-Origin', '*')
		res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization'
		)
		next()
	})

	app.get('/user/me', User.getMe)
	app.post('/user/verify', User.verify)
	app.post('/user/registration', registerValidation, User.createUser)
	app.post('/user/login', loginValidation, User.login)
	app.delete('/user/:id', User.delete)
	app.get('/user/:id', User.show)

	app.get('/dialogs', Dialog.index)
	app.delete('/dialogs/:id', Dialog.delete)
	app.post('/dialogs', Dialog.createDialog)

	app.get('/messages', Message.index)
	app.delete('/messages/:id', Message.delete)
	app.post('/messages', Message.createMessage)
}
