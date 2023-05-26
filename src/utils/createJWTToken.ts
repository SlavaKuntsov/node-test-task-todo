import jwt, { Secret } from 'jsonwebtoken'
import { IUser } from '../schemas/User'
import { reduce } from 'lodash'

interface ILoginData {
	email: string,
	password: any
}

export default (user: ILoginData) => {

	let token = jwt.sign(
		{
			data: reduce(user, (result, value, key) => {
				if(key !== 'password') {
					result[key] = value;
				}
				return result;
			})
		},
		process.env.JWT_SECRET as Secret,
		{
			expiresIn: process.env.JWT_MAX_AGE,
			algorithm: 'HS256'
		}
	)

	return token
}