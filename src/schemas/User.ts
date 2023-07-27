import bcrypt from 'bcrypt'
import mongoose, { Document } from 'mongoose'
const { Schema } = mongoose

export interface IUser extends Document {
	email: string
	password: string
}

// const emailValidator = [
// 	validate({
// 		validator: 'matches',
// 		arguments: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
// 		message: 'Please enter a valid email address'
// 	})
// ]

const UserSchema = new Schema(
	{
		email: {
			type: String,
			require: 'Email address is required',
			index: { unique: true },
		},
		password: {
			type: String,
			require: 'Password is required'
		},
	},
	{
		timestamps: true
	}
)

const UserModel = mongoose.model<IUser>('User', UserSchema)

export default UserModel
