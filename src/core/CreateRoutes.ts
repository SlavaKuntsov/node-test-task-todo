import bodyParser from 'body-parser'
import { Request, Response } from 'express'

import { Socket } from 'dgram'
import {
	TaskController, UserController
} from '../controllers/controller'
import checkAuth from '../middleware/checkAuth'

export default (app: any, io: Socket) => {
	const User = new UserController(io)
	const Task = new TaskController(io)


	app.use(bodyParser.json())
	// app.use(checkAuth)

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
	app.post('/user', User.createUser)

	app.get('/task/show', Task.getAll)
	app.post('/task/create', Task.createTask)
	app.delete('/task/delete/:id', Task.deleteTask)
}
