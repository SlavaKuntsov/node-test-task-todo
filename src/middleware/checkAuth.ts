import verifyJWTToken from '../utils/verifyJWTToken'

export default (req: any, res: any, next: any) => {

	if(req.path === '/user/login' || req.path === '/user/registration' || req.path === '/user/verify') {
		return next()
	}
	
	const token = req.headers.token
	// console.log('token: ', token);

	if(token === '' || token === null || token === undefined) {

	}

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
