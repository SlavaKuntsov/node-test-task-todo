import mongoose, { Document, Types } from 'mongoose'
const { Schema } = mongoose

export interface IDialog extends Document {
	author: {
		type: Types.ObjectId,
		ref: string
	},
	partner: {
		type: Types.ObjectId,
		ref: string
	},
	lastMessage: {
		type: Types.ObjectId,
		ref: string
	},
	lastMessageTime: string,
	isReaded: boolean,
	unread: number
}

const DialogSchema = new Schema(
	{
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			require: true
		},
		partner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			require: true
		},
		lastMessage: {
			type: Schema.Types.ObjectId,
			ref: 'Message'
		},
		lastMessageTime: {
			type: String,
			default: new Date().toLocaleString()
		},
		isReaded: {
			type: Boolean,
			default: false
		},
		unread: Number
	},
	{
		timestamps: true
	}
)

const DialogModel = mongoose.model<IDialog>('Dialog', DialogSchema);

export default DialogModel
