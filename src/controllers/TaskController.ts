import { Request, Response } from 'express'
import { TaskModel } from '../schemas/schemas'

export default class MessageController {
	io: any

	constructor(io: any) {
		this.io = io
	}

	getAll(req: Request, res: Response) {
		// res.json({
		// 	task: '123'
		// })
		// const dialogId = req.query.dialog;

		// MessageModel.find({ task: dialogId })
		// 	.populate(["dialog"])
		// 	.then(message => {
		// 		return res.json(message);
		// 	}).catch(() => {
		// 		return res.status(404).json({
		// 			message: "Message not found"
		// 		});
		// 	})

		const email = req.headers.token
		console.log('email task: ', email);


		TaskModel.find({ user : email })
			.then(task => {
				// console.log('task: ', task);
				return res.json(task) //return
			})
			.catch(() => {
				return res.status(404).json({
					message: 'Task not found'
				})
			})
	}

	createTask = (req: Request, res: Response) => {
		const postData = {
			user: req.body.user,
			category: req.body.category,
			name: req.body.name,
			text: req.body.text,
			status: req.body.status
		}
		// console.log('new task: ', postData);

		const task = new TaskModel(postData)

		task.save()
			.then((task: any) => {
				// console.log('task: ', task)

				return res.json(task)
			})
			.catch((reason: any) => {
				return res.json(reason)
			})
	}

	deleteTask(req: Request, res: Response) {
		const id: string = req.params.id
		console.log('id: ', id);
		TaskModel.findOneAndDelete({ _id: id })
			.then(task => {
				if (!task) {
					return res.json({
						message: `Task not found`
					})
				}
				if (task) {
					return res.json({
						message: `Task deleted`
					})
				}
			})
			.catch(err => {
				return res.status(404).json(err)
			})
		
	}
}
