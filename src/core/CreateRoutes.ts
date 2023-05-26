import bodyParser from 'body-parser'
const socket = require('socket.io')

import {
	DialogController,
	MessageController,
	UserController
} from '../controllers/controller'
import { checkAuth, updateLastSeen } from '../middleware/middleware'
import { loginValidation } from '../utils/validations/index'
import { Socket } from 'dgram'

export default (app: any, io: Socket) => {
	const User = new UserController(io)
	const Dialog = new DialogController(io)
	const Message = new MessageController(io)

	app.use(bodyParser.json())
	app.use(updateLastSeen)
	app.use(checkAuth)

	app.get('/user/me', User.getMe)
	app.get('/user/:id', User.show)
	app.delete('/user/:id', User.delete)
	app.post('/user/registration', loginValidation, User.createUser)
	app.post('/user/login', loginValidation, User.login)

	app.get('/dialogs', Dialog.index)
	app.delete('/dialogs/:id', Dialog.delete)
	app.post('/dialogs', Dialog.createDialog)

	app.get('/messages', Message.index)
	app.delete('/messages/:id', Message.delete)
	app.post('/messages', Message.createMessage)
}
