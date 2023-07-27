import { Request, Response } from "express";
import { query, matchedData, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'

import { UserModel } from '../schemas/schemas';

export default class UserController {

	io: any

	constructor(io: any) {
		this.io = io
	}

	createUser(req: Request, res: Response) {
		const postData = {
			email: req.body.email,
			password: req.body.password,
		}
		console.log('postData: c ', postData);


		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.status(422).json({ errors: result.array() });
		}


		const user = new UserModel(postData)

		user
			.save()
			.then((obj: any) => {
				console.log('obj: ', obj);
				res.json({
					status: 'success',
					user: obj
				})
			})
			.catch(reason => {
				console.log('reason: ', reason);
				return res.json({
					status: 'error',
					messageReg: reason
				})
			})
	}


	getMe(req: Request, res: Response) {
		const email = req.headers.token
		console.log('email user: ', email);

		UserModel.findOne({ email: email }).then(user => {
			return res.json(user);
		}).catch(() => {
			return res.status(404).json({
				message: "User not found1"
			});
		})

		// UserModel.findOne({email: })
	}
}