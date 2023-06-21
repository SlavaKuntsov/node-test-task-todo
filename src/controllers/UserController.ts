import { Request, Response } from "express";
import { query, matchedData, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'

import { UserModel } from '../schemas/schemas';
import { IUser } from '../schemas/User';
import { createJWTToken, generatePasswordHash } from '../utils/utils'
import createVerifyCode from "../utils/createVerifyCode";

export default class UserController {

	io: any

	constructor(io: any) {
		this.io = io
	}

	show(req: Request, res: Response) {
		const id: string = req.params.id;

		UserModel.findById(id).then(user => {
			return res.json(user);
		}).catch(() => {
			return res.status(404).json({
				message: "User not found4"
			});
		})
	}

	createUser(req: Request, res: Response) {
		const postData = {
			email: req.body.email,
			password: req.body.password,
			fullname: req.body.fullname,
		}

		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.status(422).json({ errors: result.array() });
		}


		const user = new UserModel(postData)

		user
			.save()
			.then((obj: any) => {
				res.json({
					status: 'success',
					user: obj
				})
			})
			.catch(reason => {
				return res.json({
					status: 'error',
					messageReg: reason
				})
			})
	}

	verify(req: Request, res: Response) {

		const verifyCode = createVerifyCode(6)

		const postData = {
			email: req.body.email,
			password: req.body.password,
			fullname: req.body.fullname,
		}
		console.log('postData: ', postData);

		const transporter = nodemailer.createTransport(
			{
				name: 'smtp.gmail.com', // mail.example.com or smtp.mail.com
				host: 'smtp.gmail.com', // mail.example.com or smtp.mail.com
				port: 587, // 465
				service: 'gmail',
				auth: {
					user: 'permanent23best@gmail.com',
					pass: 'jzaiikqmczxzcayu'
				}
			}
		)

		const mailOPtions = {
			from: 'permanent23best@gmail.com',
			to: postData.email,
			subject: `Your code for React Chat`,
			text: `${verifyCode}`
		}
		console.log('mailOPtions: ', mailOPtions);

		transporter.sendMail(mailOPtions, (err, info) => {
			console.log(123)
			if(err) {
				console.log(err)
				res.json({ message: 'code didnt create'})
			}
			res.json(verifyCode)
			res.json({message: 'code create'})
		})

		console.log('verifyCode: ', verifyCode);
		return verifyCode

		// const hash = req.query.hash

		// if(!hash) {
		// 	return res.status(422).json({ errors: 'Invalid hash' });
		// }

		// console.log('hash: ', hash);

		// UserModel.find({ confirm_hash: hash }).then(user => {
		// 	console.log('confirm_hash: ');
		// 	return res.json({
		// 		status: 'success',
		// 		message: 'Аккаунт подтвержден hash'
		// 	});
		// }).catch(() => {
		// 	return res.status(404).json({
		// 		message: "Invalid hash"
		// 	});
		// })
	}

	login(req: Request, res: Response) {
		const postData = {
			email: req.body.email,
			password: req.body.password
		}
		console.log('postData: ', postData);

		const result = validationResult(req);
		console.log('result: ', result);

		if (!result.isEmpty()) {
			return res.status(422).json({ errors: result.array() });
		}
		
		UserModel.findOne({ email: postData.email})
			.then((user) => {
				if(!user) {
					return res.json({
						status: 'error',
						message: 'User not found3'
					})
				}

				if (bcrypt.compareSync(postData.password, user.password)) {
					const token = createJWTToken(user)
					res.json({
						status: 'success',
						token: token
					})
				}
				else{
					res.json({
						status: 'failed',
						message: 'Incorrect password or email'
					})
				}
		})
	}

	delete(req: Request, res: Response) {
		const id: string = req.params.id;
		
		UserModel.findOneAndDelete({_id: id}).then(user => {
			if(!user) {
				return res.json({
					message: `User not found2`
				});
			}
			if(user) {
				return res.json({
					message: `User '${user.fullname}' deleted`
				});
			}
			
		}).catch(err => {
			return res.status(404).json(err);
		})
	}
	
	getMe(req: Request, res: Response) {
		const id = req.user

		UserModel.findById(id).then(user => {
			console.log('user: ', user);
			return res.json(user);
		}).catch(() => {
			return res.status(404).json({
				message: "User not found1"
			});
		})
	}
}