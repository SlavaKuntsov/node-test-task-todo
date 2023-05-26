import { NextFunction, Request, Response } from 'express'

import verifyJWTToken from '../utils/verifyJWTToken'
import { UserModel } from '../schemas/schemas'

export default (req: any, res: any, next: any) => {

	if(req.path === '/user/login' || req.path === '/user/registration') {
		return next()
	}
	
	const token = req.headers.token

	verifyJWTToken(token)
		.then((user: any) => {
			req.user = user.data._doc._id
			next()
		})
		.catch(() => {
			res.status(403)
				.json({
					message: 'Invalid auth token'
				})
		})

}
