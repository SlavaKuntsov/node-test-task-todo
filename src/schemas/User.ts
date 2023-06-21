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
	confirm_hash: string
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
		confirm_hash: {
			type: String,
			require: 'confirm_hash is required'
		},
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


	generatePasswordHash(user.password)
		.then(hash => {
			user.password = String(hash)
			console.log('user.password 1: ', user.password);
			// generatePasswordHash(String(+new Date()))
			// 	.then(hashLogin => {
			// 		user.confirm_hash = String(hashLogin)
			// 		console.log('user.confirm_hash: 1', user.confirm_hash);
			// 		next()
			// 	})
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
			console.log('user.password: 2', user.password);
		})



		bcrypt.genSalt(10, function (err, salt) {
			if (err) return next(err)
	
			bcrypt.hash(String(+new Date()), salt, function (err, hash) {
				if (err) return next(err)
				user.confirm_hash = hash
				console.log('user.confirm_hash: 2', user.confirm_hash);
				next()
			})
		})
	})
})

const UserModel = mongoose.model<IUser>('User', UserSchema)

export default UserModel
