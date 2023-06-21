import { Request, Response } from "express";

import { DialogModel, MessageModel } from '../schemas/schemas';

export default class DialogController {

	io: any

	constructor(io: any) {
		this.io = io
	}
	
	index(req: Request, res: Response) {
		const authorId = req.user

		DialogModel.find({ author: authorId })
			.populate(["author", "partner"])
			.then(dialog => {
				return res.json(dialog);
			}).catch(() => {
				return res.status(404).json({
					message: "Dialog not found"
				});
			})
	}

	createDialog(req: Request, res: Response) {
		const postData = {
			author: req.body.author,
			partner: req.body.partner,
			fullname: req.body.fullname,
			password: req.body.password,
		}
		const dialog = new DialogModel(postData)

		dialog
			.save()
			.then((dialogObj: any) => {

				const message = new MessageModel({
					text: req.body.text,
					user: req.body.author,
					dialog: dialogObj._id,
				})

				message
					.save()
					.then((messageObj: any) => {
						return res.json({
							dialog: dialogObj,
							message: messageObj
						})
					})
					.catch(reason => {
						return res.json(reason)
					})
				
			})
			.catch(reason => {
				return res.json(reason)
			})
	}
	
	delete(req: Request, res: Response) {
		const id: string = req.params.id;
		DialogModel.findOneAndDelete({_id: id}).then(dialog => {
			if(!dialog) {
				return res.json({
					message: `Dialog not found`
				});
			}
			if(dialog) {
				return res.json({
					message: `Dialog deleted`
				});
			}
			
		}).catch(err => {
			return res.status(404).json(err);
		})
	}
}