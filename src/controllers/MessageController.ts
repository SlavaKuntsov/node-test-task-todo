import { Request, Response } from "express";
import { MessageModel } from '../schemas/schemas';

export default class MessageController {

	io: any

	constructor(io: any) {
		this.io = io
	}

	index(req: Request, res: Response) {
		const dialogId = req.query.dialog;

		MessageModel.find({ dialog: dialogId })
			.populate(["dialog"])
			.then(message => {
				return res.json(message);
			}).catch(() => {
				return res.status(404).json({
					message: "Message not found"
				});
			})
	}

	createMessage = (req: Request, res: Response) => {

		const userId = req.user

		const postData = {
			text: req.body.text,
			dialog: req.body.dialog,
			user: userId
		}
		const message = new MessageModel(postData)

		message
			.save()
			.then((obj: any) => {
				obj
					.populate('dialog')
					.then((message: any )=> {
						console.log('message: ', message);
						// this.io.emit('SERVER:NEW_MESSAGE', message)
				
						return res.json(message)
					})
					.catch((reason: any) => {
						return res.json(reason)
					})
			})
			
	}
	
	delete(req: Request, res: Response) {
		const id: string = req.params.id;
		MessageModel.findOneAndDelete({_id: id}).then(user => {
			if(!user) {
				return res.json({
					message: `Message not found`
				});
			}
			if(user) {
				return res.json({
					message: `Message deleted`
				});
			}
			
		}).catch(err => {
			return res.status(404).json(err);
		})
	}
}