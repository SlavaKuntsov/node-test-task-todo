import bcrypt from 'bcrypt'
import mongoose, { Document } from 'mongoose'
const { Schema } = mongoose

const validate = require('mongoose-validator')

import { generatePasswordHash } from '../utils/utils'

export interface IUser extends Document {
	email: string
	avatar?: string
	fullname: string
	password: string
	confirmed: boolean
	confirm_hash?: string
	last_seen: string,
}

const emailValidator = [
	validate({
		validator: 'matches',
		arguments: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
		message: 'Please enter a valid email address'
	})
]

const UserSchema = new Schema(
	{
		email: {
			type: String,
			require: 'Email address is required',
			index: { unique: true },
			validate: emailValidator
		},
		avatar: String,
		fullname: {
			type: String,
			require: 'Fullname is required'
		},
		password: {
			type: String,
			require: 'Password is required'
		},
		confirmed: {
			type: Boolean,
			default: false
		},
		confirm_hash: String,
		last_seen: {
			type: String,
			default: new Date().toLocaleString()
		},
	},
	{
		timestamps: true
	}
)

UserSchema.pre('save', function (next) {
	const user = <IUser>this

	if (!user.isModified('password')) return next()

	console.log('user.password: ', user.password);
	generatePasswordHash(user.password)
		.then(hash => {
			user.password = String(hash)
			console.log('hash: ', hash);
			next()
		})
		.catch(err => {
			next(err)
		})

	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err)

		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err)
			user.password = hash
			next()
		})
	})
})

const UserModel = mongoose.model<IUser>('User', UserSchema)

export default UserModel
