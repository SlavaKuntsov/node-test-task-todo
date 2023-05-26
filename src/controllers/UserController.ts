import { Request, Response } from "express";
import { query, matchedData, validationResult } from 'express-validator';
import bcrypt from 'bcrypt'

import { UserModel } from '../schemas/schemas';
import { IUser } from '../schemas/User';
import { createJWTToken, generatePasswordHash } from '../utils/utils'

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
				message: "User not found"
			});
		})
	}

	createUser(req: Request, res: Response) {
		const postData = {
			email: req.body.email,
			fullname: req.body.fullname,
			password: req.body.password
		}
		const user = new UserModel(postData)

		user
			.save()
			.then((obj: any) => {
				return res.json({
					email: obj.email,
					fullname: obj.fullname,
					password: obj.password,
					confirmed: obj.confirmed,
					last_seen: obj.last_seen,
					_id: obj._id,
					__v: obj.__v
				})
			})
			.catch(reason => {
				return res.json(reason)
			})
	}

	login(req: Request, res: Response) {
		const postData = {
			email: req.body.email,
			password: req.body.password
		}

		const result = validationResult(req);

		if (!result.isEmpty()) {
			return res.status(422).json({ errors: result.array() });
		}
		
		
		UserModel.findOne({ email: postData.email})
			.then((user) => {
				if(!user) {
					return res.json({
						message: 'User not found'
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
					message: `User not found`
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
			return res.json(user);
		}).catch(() => {
			return res.status(404).json({
				message: "User not found1"
			});
		})
	}
}